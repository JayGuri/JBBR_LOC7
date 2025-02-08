import logging
import os
import json
import re
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

    def extract_gst_number(self, text):
        """Extract GST number using regex patterns"""
        # Common GST number patterns
        gst_patterns = [
            r'GST\s*(?:No\.?|Number|#)?\s*:?\s*([0-9A-Z]{15})',  # Standard GST format
            r'GSTIN\s*:?\s*([0-9A-Z]{15})',                      # GSTIN format
            r'([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3})'    # Raw GST number
        ]
        
        for pattern in gst_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)
        return None

    def extract_bill_number(self, text):
        """Extract bill/invoice number using regex patterns"""
        # Common bill/invoice number patterns
        bill_patterns = [
            r'(?:Bill|Invoice|Transaction|Receipt)\s*(?:No\.?|Number|#|ID)?\s*:?\s*([A-Za-z0-9-/]{1,20})',
            r'(?:Order|Ref)\s*(?:No\.?|Number|#|ID)?\s*:?\s*([A-Za-z0-9-/]{1,20})'
        ]
        
        for pattern in bill_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None

    def query_qwen2(self, text):
        """Sends text to the locally running Qwen2.5-3B model and forces valid JSON output."""
        # Extract GST and Bill numbers before sending to LLM
        gst_number = self.extract_gst_number(text)
        bill_number = self.extract_bill_number(text)
        
        prompt = f"""
        Extract structured details from the following receipt text. Respond only in JSON format without any extra text.
        **Input Receipt Text:**
        \"\"\"{text}\"\"\"
        **JSON Format (Example Output):**
        {{
            "vendor": "Walmart",
            "amount": "45.67",
            "date": "2024-02-08",
            "category": "Grocery",
            "gst_number": "{gst_number if gst_number else ''}",
            "bill_number": "{bill_number if bill_number else ''}",
            "payment_method": "Card/Cash/UPI",
            "items": [
                {{"item": "Product name", "quantity": "1", "price": "10.00"}}
            ]
        }}
        Now, extract details from the given receipt and return only JSON:
        """
        response = ollama.chat(model='qwen2.5:3b', messages=[{"role": "user", "content": prompt}])
        json_text = response['message']['content'].strip()
        
        try:
            structured_data = json.loads(json_text)
            # Override LLM's GST and bill number with regex results if available
            if gst_number:
                structured_data['gst_number'] = gst_number
            if bill_number:
                structured_data['bill_number'] = bill_number
            return structured_data
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON response for text: {text[:100]}...")
            return None

    def process_receipt(self, ocr_text_list):
        """Process single receipt text to structured data"""
        combined_text = " ".join([text[0] for text in ocr_text_list])
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