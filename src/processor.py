import requests
import base64
from PIL import Image
from io import BytesIO
from typing import Dict
from pathlib import Path
import pandas as pd
from tqdm import tqdm
import json
from src.config import Config

class ReceiptProcessor:
    def __init__(self):
        """Initialize the receipt processor with API headers"""
        self.headers = {"Authorization": f"Bearer {Config.HUGGING_FACE_TOKEN}"}

    def create_prompt(self) -> str:
        """Create structured prompt for receipt analysis"""
        return """<|image|><|begin_of_text|>Extract the following information from this receipt:
        - Store/Vendor name
        - Total amount
        - Date
        - Purchase category

        Format the response as a JSON object with fields: vendor, amount, date, category."""

    def encode_image(self, image_path: Path) -> str:
        """Convert image to base64 string"""
        with Image.open(image_path) as img:
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Convert to JPEG format in memory
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')

    def query_api(self, image_path: Path) -> Dict:
        """Send request to Hugging Face API"""
        image_b64 = self.encode_image(image_path)
        payload = {
            "inputs": {
                "image": image_b64,
                "prompt": self.create_prompt()
            }
        }
        
        response = requests.post(
            Config.API_URL,
            headers=self.headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"API request failed: {response.text}")
            
        return response.json()

    def process_single_receipt(self, image_path: Path) -> Dict:
        """Process a single receipt image"""
        try:
            # Query the API
            result = self.query_api(image_path)
            
            try:
                # Extract JSON from response
                if isinstance(result, list):
                    result = result[0]
                json_str = result.get('generated_text', '').split("|>")[-1].strip()
                parsed_data = json.loads(json_str)
                
                return {
                    'vendor': parsed_data.get('vendor', 'Unknown'),
                    'amount': float(parsed_data.get('amount', 0.0)),
                    'date': parsed_data.get('date', ''),
                    'category': parsed_data.get('category', 'Uncategorized'),
                    'status': 'success',
                    'filename': image_path.name
                }
                
            except (json.JSONDecodeError, AttributeError) as e:
                return self._create_error_dict(image_path.name, f'Failed to parse API response: {str(e)}')
                
        except Exception as e:
            return self._create_error_dict(image_path.name, str(e))

    def _create_error_dict(self, filename: str, error: str) -> Dict:
        """Create error dictionary for failed processing"""
        return {
            'vendor': 'Error',
            'amount': 0.0,
            'date': '',
            'category': 'Error',
            'status': 'failed',
            'filename': filename,
            'error': error
        }

    def process_bulk_receipts(self) -> pd.DataFrame:
        """Process multiple receipt images"""
        results = []
        image_files = [f for f in Config.INPUT_DIR.iterdir() 
                      if f.suffix.lower() in Config.SUPPORTED_FORMATS]
        
        print(f"Found {len(image_files)} receipt images to process")
        
        for image_path in tqdm(image_files, desc="Processing receipts"):
            result = self.process_single_receipt(image_path)
            results.append(result)
            
        return pd.DataFrame(results)