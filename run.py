from src.auth import setup_authentication
from src.utils import ensure_directories, save_results
from src.processor import ReceiptProcessor

def main():
    """Main function to run the receipt processing pipeline"""
    try:
        # Setup
        print("Setting up directories...")
        ensure_directories()
        
        print("Authenticating with Hugging Face...")
        setup_authentication()
        
        # Initialize processor
        print("Initializing receipt processor...")
        processor = ReceiptProcessor()
        
        # Process receipts
        print("Starting bulk receipt processing...")
        results_df = processor.process_bulk_receipts()
        
        # Save results
        print("Saving results...")
        csv_path, excel_path, summary_path = save_results(results_df)
        
        print(f"\nProcessing complete!")
        print(f"Results saved to:")
        print(f"CSV: {csv_path}")
        print(f"Excel: {excel_path}")
        print(f"Summary: {summary_path}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    main()