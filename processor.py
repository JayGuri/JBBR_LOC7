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
        Analyze this receipt text and extract key information. The text may have missing spaces or joined words due to OCR processing.

        Example of how text might appear:
        - "WalmartStore" instead of "Walmart Store"
        - "Rs.1450.00" or "Rs1450.00" instead of "Rs. 1450.00"
        - "Date:25/01/2024" instead of "Date: 25/01/2024"
        - "GSTIN27XXXXX" instead of "GSTIN: 27XXXXX"
        - "billno12345" or "invoiceno12345" instead of "Bill No: 12345"
        - "inv8179912"" or "invoiceno123" instead of invoice : 8179912"" or "invoiceno : 123" or "Invoice : 817991 "
        
        Look for these patterns or similar to these:
        1. GST numbers:
        - "GSTIN27AAAAA1234A1Z5"
        - "gst27AAAAA1234A1Z5"
        - "gstin27AAAAA1234A1Z5"
        - Any 15-character sequence starting with numbers

        2. Bill/Invoice numbers or similar to these :
        - "billno12345"
        - "invoiceno123"
        - "bill#12345"
        - "inv8179912"
        -"inv : 7821971"
        - Look for numbers near words like "bill", "invoice", "ref", "no",inv,Inv,1nv
        
        3. Amounts like:
        - "1450.00"
        - "Rs1450"
        - "₹1,450.00"
        - "1450/-"
        - "amountdue1450"
        
        4. Dates like:
        - "25/01/2024"
        - "25-01-2024"
        - "date25012024"
        - "dt25012024"

        Receipt text to analyze:
        \"\"\"{text}\"\"\"

        Return only this JSON format with these exact fields:
        {{
            "vendor": "Store name",
            "amount": "Total amount (numbers only, no currency symbols)",
            "date": "YYYY-MM-DD format if possible",
            "category": "Grocery/Restaurant/Electronics/General/Services",
            "gst_number": "15-character GST number if found, empty string if not found",
            "bill_number": "Bill/invoice number if found, empty string if not found"
        }}
        """
        
        response = ollama.chat(
            model='qwen2.5:3b',
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.25}
        )
        json_text = response['message']['content'].strip()
        
        try:
            structured_data = json.loads(json_text)
            return structured_data
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON response for text: {text[:100]}...")
            return None

    def process_receipt(self, ocr_text_list):
        """Process single receipt text to structured data"""
        # Join without spaces since OCR might already include necessary spaces
        combined_text = "".join([text[0] for text in ocr_text_list])
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
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(self.output_dir, f'receipt_results_{timestamp}.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_results, f, indent=4)
        
        print(f"\nProcessing complete! Results saved to {output_file}")
        return all_results