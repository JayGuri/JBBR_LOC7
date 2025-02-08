import logging
import os
import json
from datetime import datetime
from paddleocr import PaddleOCR, draw_ocr
import ollama

# Suppress PaddleOCR debug messages
logging.getLogger("ppocr").setLevel(logging.ERROR)

class ReceiptProcessor:
    def __init__(self, images_dir='images', output_dir='output'):
        self.ocr_model = PaddleOCR(lang='en', use_gpu=False, show_log=False)
        self.images_dir = images_dir
        self.output_dir = output_dir
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def get_strings_simple(self, data):
        """Extract strings using simple list comprehension"""
        return [item[1] for item in data[0]]

    def query_qwen2(self, text):
        """Sends text to the locally running Qwen2.5-3B model with a focused prompt"""
        prompt = f"""
        You are a precise receipt information extractor. Extract information from the following receipt text into a specific JSON format.

        Key things to look for:
        1. Vendor name is usually business name or store name
        2. Amount/total is usually at the bottom, after subtotal, tax, etc
        3. Date could be anywhere but often at top or bottom
        4. GST number usually starts with state code (2 digits) followed by letters and numbers
        5. Bill/invoice number might be labeled as ref no, order no, etc

        Categories to use:
        - Grocery (for supermarkets, grocery stores)
        - Restaurant (for food service, cafes)
        - Electronics (for electronics stores)
        - Services (for services)
        - Travelling (for petrol, transport)
    

        INPUT TEXT:
        {text}

        Respond ONLY with valid JSON in this exact format, nothing else:
        {{
            "vendor": "Store or business name",
            "amount": "Total amount as numbers only",
            "date": "YYYY-MM-DD if found, otherwise empty string",
            "category": "One of the categories listed above",
            "gst_number": "15-character GST number if found, otherwise empty string",
            "bill_number": "Any reference/bill/invoice number found, otherwise empty string"
        }}
        """
        
        response = ollama.chat(
            model='qwen2.5:3b',
            messages=[{"role": "user", "content": prompt}],
            options={
                "temperature": 0.1,  # Lower temperature for more consistent outputs
                "top_p": 0.1,        # More focused sampling
                "frequency_penalty": 0.1  # Reduce repetition
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
            # Ensure all required fields exist
            required_fields = ["vendor", "amount", "date", "category", "gst_number", "bill_number"]
            for field in required_fields:
                if field not in structured_data:
                    structured_data[field] = ""
            return structured_data
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON response for text: {text[:100]}...")
            # Return a valid but empty response instead of None
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
        # Combine with newlines to preserve structure
        combined_text = "\n".join([text[0] for text in ocr_text_list])
        return self.query_qwen2(combined_text)

    def process_image(self, image_path):
        """Process single image and return structured data"""
        try:
            result = self.ocr_model.ocr(image_path)
            if result is None or not result[0]:
                print(f"Warning: No text detected in {image_path}")
                return None
            
            strings = self.get_strings_simple(result)
            return self.process_receipt(strings)
        except Exception as e:
            print(f"Error processing {image_path}: {str(e)}")
            return None

    def process_batch(self):
        """Process all images in the directory and save results"""
        all_results = {}
        successful_count = 0
        
        # Get all image files
        image_files = [f for f in os.listdir(self.images_dir) 
                      if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        print(f"Found {len(image_files)} images to process...")
        
        for image_file in image_files:
            print(f"Processing {image_file}...")
            image_path = os.path.join(self.images_dir, image_file)
            result = self.process_image(image_path)
            
            if result:
                all_results[image_file] = result
                successful_count += 1
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(self.output_dir, f'receipt_results_{timestamp}.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_results, f, indent=4)
        
        print(f"\nProcessing complete! Results saved to {output_file}")
        print(f"Successfully processed {successful_count} out of {len(image_files)} receipts")
        return all_results