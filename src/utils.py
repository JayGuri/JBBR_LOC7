import os
import json
from datetime import datetime
import pandas as pd
from pathlib import Path
from .config import Config

def ensure_directories():
    """Ensure all required directories exist"""
    Config.INPUT_DIR.mkdir(parents=True, exist_ok=True)
    Config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def save_results(df: pd.DataFrame) -> tuple:
    """Save processing results in multiple formats"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save paths
    csv_path = Config.OUTPUT_DIR / f"receipt_data_{timestamp}.csv"
    excel_path = Config.OUTPUT_DIR / f"receipt_data_{timestamp}.xlsx"
    summary_path = Config.OUTPUT_DIR / f"summary_{timestamp}.json"
    
    # Save data
    df.to_csv(csv_path, index=False)
    df.to_excel(excel_path, index=False)
    
    # Generate summary
    summary = {
        "total_receipts": len(df),
        "successful_processed": len(df[df['status'] == 'success']),
        "failed_processed": len(df[df['status'] == 'failed']),
        "total_amount": df[df['status'] == 'success']['amount'].sum(),
        "categories": df[df['status'] == 'success']['category'].value_counts().to_dict()
    }
    
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=4)
        
    return csv_path, excel_path, summary_path