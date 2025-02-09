import logging
import os
import json
import re
from datetime import datetime
from paddleocr import PaddleOCR, draw_ocr
import ollama
from pdf2image import convert_from_path
from PIL import Image

# Suppress PaddleOCR debug messages
logging.getLogger("ppocr").setLevel(logging.ERROR)

class ReceiptProcessor:
    def __init__(self, input_dir='input', output_dir='output', temp_dir='temp'):
        self.ocr_model = PaddleOCR(lang='en', use_gpu=False, show_log=False)
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.temp_dir = temp_dir
        
        # Create necessary directories if they don't exist
        for directory in [output_dir, temp_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)

    def get_strings_simple(self, data):
        """Extract strings using simple list comprehension"""
        return [item[1] for item in data[0]]

    def clean_gst_number(self, gst_number):
        """Clean GST number to extract only the 15-character code"""
        if not gst_number:
            return ""
        # Remove common prefixes and special characters
        gst_patterns = [
            r'GST[:\-\s]*([0-9A-Z]{15})',
            r'GSTIN[:\-\s]*([0-9A-Z]{15})',
            r'([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3})'  # Raw 15-char GST format
        ]
        
        for pattern in gst_patterns:
            match = re.search(pattern, gst_number)
            if match:
                return match.group(1)
        
        # If no pattern matches but string contains 15 alphanumeric characters
        clean_gst = re.sub(r'[^0-9A-Z]', '', gst_number.upper())
        if len(clean_gst) >= 15:
            return clean_gst[:15]
        return ""

    def clean_bill_number(self, bill_number):
        """Clean bill number to remove prefixes like 'Inv' or 'Bill'"""
        if not bill_number:
            return ""
        # Remove common prefixes
        prefixes = ['inv', 'bill', 'invoice', 'no', 'number', '#', ':','ref']
        clean_num = bill_number.lower()
        
        for prefix in prefixes:
            clean_num = clean_num.replace(prefix, '')
        
        # Remove special characters and extra spaces
        clean_num = re.sub(r'[^0-9a-zA-Z]', '', clean_num)
        return clean_num

    def query_qwen2(self, text):
        """Sends text to the locally running Qwen2.5-3B model with a focused prompt"""
        prompt = f"""
        You are a precise receipt information extractor. Extract information from the following receipt text into a specific JSON format.

        Key things to look for:
        1. Vendor name is usually at the top of receipt or in large text
        2. Amount/total is usually at the bottom, after subtotal, tax, etc
        3. Date could be anywhere but often at top or bottom
        4. GST number usually starts with state code (2 digits) followed by letters and numbers
        5. Bill/invoice number might be labeled as ref no, order no, etc

        Categories to use:
        - Grocery (for supermarkets, grocery stores)
        - Restaurant (for food service, cafes)
        - Electronics (for electronics stores)
        - Services (for services)
        - Fuel (for petrol or diesal or gas)
        - Cab services(for Uber or Ola or rapido)
        - Entertainment(for movies or shows or concerts)
        - General (for other retail)

        Hard input :
        -If Category = Cab services then vendor is either uber,ola or rapido.Check it on the basis of the input

        INPUT TEXT:
        {text}

        Respond ONLY with valid JSON in this exact format, nothing else:
        {{
            "vendor": "Store or business name",
            "amount": "Total amount as numbers only",
            "date": "YYYY-MM-DD if found, otherwise empty string",
            "category": "One of the categories listed above",
            "gst_number": "Raw GST number if found",
            "bill_number": "Raw bill/invoice number if found"
        }}
        """
        
        response = ollama.chat(
            model='qwen2.5:3b',
            messages=[{"role": "user", "content": prompt}],
            options={
                "temperature": 0.1,
                "top_p": 0.1,
                "frequency_penalty": 0.1
            }
        )
        json_text = response['message']['content'].strip()
        
        # Clean up common JSON formatting issues
        json_text = json_text.replace('\n', ' ').strip()
        if json_text.startswith('```json'):
            json_text = json_text[7:]
        if json_text.endswith('```'):
            json_text = json_text[:-3]
        json_text = json_text.strip()
        
        try:
            structured_data = json.loads(json_text)
            # Clean up GST and bill numbers
            structured_data["gst_number"] = self.clean_gst_number(structured_data.get("gst_number", ""))
            structured_data["bill_number"] = self.clean_bill_number(structured_data.get("bill_number", ""))
            
            # Ensure all required fields exist
            required_fields = ["vendor", "amount", "date", "category", "gst_number", "bill_number"]
            for field in required_fields:
                if field not in structured_data:
                    structured_data[field] = ""
            return structured_data
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON response for text: {text[:100]}...")
            return {
                "vendor": "",
                "amount": "",
                "date": "",
                "category": "General",
                "gst_number": "",
                "bill_number": ""
            }

    def process_receipt(self, ocr_text_list):
        """Process single receipt text to structured data"""
        combined_text = "\n".join([text[0] for text in ocr_text_list])
        return self.query_qwen2(combined_text)

    def convert_pdf_to_images(self, pdf_path):
        """Convert PDF to images"""
        try:
            print(f"Converting PDF to images: {pdf_path}")
            images = convert_from_path(pdf_path)
            image_paths = []
            
            for i, image in enumerate(images):
                image_path = os.path.join(self.temp_dir, f'page_{i+1}.jpg')
                image.save(image_path, 'JPEG')
                image_paths.append(image_path)
            
            return image_paths
        except Exception as e:
            print(f"Error converting PDF: {str(e)}")
            return []

    def process_file(self, file_path):
        """Process single file (PDF or image) and return structured data"""
        try:
            if file_path.lower().endswith('.pdf'):
                # Convert PDF to images and process first page
                image_paths = self.convert_pdf_to_images(file_path)
                if not image_paths:
                    return None
                # Process only the first page of the PDF
                result = self.ocr_model.ocr(image_paths[0])
                # Clean up temporary images
                for img_path in image_paths:
                    os.remove(img_path)
            else:
                # Process image directly
                result = self.ocr_model.ocr(file_path)
            
            if result is None or not result[0]:
                print(f"Warning: No text detected in {file_path}")
                return None
            
            strings = self.get_strings_simple(result)
            return self.process_receipt(strings)
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
            return None

    def process_batch(self):
        """Process all files in the directory and save results"""
        all_results = {}
        successful_count = 0
        
        # Get all valid files
        valid_extensions = ('.png', '.jpg', '.jpeg', '.pdf')
        input_files = [f for f in os.listdir(self.input_dir) 
                      if f.lower().endswith(valid_extensions)]
        
        print(f"Found {len(input_files)} files to process...")
        
        for input_file in input_files:
            print(f"Processing {input_file}...")
            file_path = os.path.join(self.input_dir, input_file)
            result = self.process_file(file_path)
            
            if result:
                all_results[input_file] = result
                successful_count += 1
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(self.output_dir, f'receipt_results.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_results, f, indent=4)
        
        print(f"\nProcessing complete! Results saved to {output_file}")
        print(f"Successfully processed {successful_count} out of {len(input_files)} files")
        return all_results