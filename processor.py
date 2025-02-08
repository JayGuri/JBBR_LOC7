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
        """Sends text to the locally running Qwen2.5-3B model and forces valid JSON output."""
        prompt = f"""
        Extract structured details from the following receipt text. Respond only in JSON format without any extra text.
        **Input Receipt Text:**
        \"\"\"{text}\"\"\"
        **JSON Format (Example Output):**
        {{
            "vendor": "Walmart",
            "amount": "45.67",
            "date": "2024-02-08",
            "category": "Grocery"
        }}
        Now, extract details from the given receipt and return only JSON:
        """
        response = ollama.chat(model='qwen2.5:3b', messages=[{"role": "user", "content": prompt}])
        json_text = response['message']['content'].strip()
        
        try:
            structured_data = json.loads(json_text)
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