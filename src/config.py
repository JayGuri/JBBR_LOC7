from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    HUGGING_FACE_TOKEN = os.getenv('HUGGING_FACE_TOKEN')
    API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision"
    BASE_DIR = Path(__file__).parent.parent
    INPUT_DIR = BASE_DIR / "input" / "receipt_images"
    OUTPUT_DIR = BASE_DIR / "output" / "processed_receipts"
    SUPPORTED_FORMATS = ('.png', '.jpg', '.jpeg', '.tiff')