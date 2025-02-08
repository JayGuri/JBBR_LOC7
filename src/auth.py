from huggingface_hub import login
from .config import Config

def setup_authentication():
    """Setup authentication with Hugging Face"""
    if not Config.HUGGING_FACE_TOKEN:
        raise ValueError("HUGGING_FACE_TOKEN not found in environment variables")
    
    try:
        login(Config.HUGGING_FACE_TOKEN)
        print("Successfully authenticated with Hugging Face")
    except Exception as e:
        raise Exception(f"Authentication failed: {str(e)}")