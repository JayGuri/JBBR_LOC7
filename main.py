from processor import ReceiptProcessor

if __name__ == "__main__":
    processor = ReceiptProcessor(images_dir='LOC_7.0/images', output_dir='output')
    results = processor.process_batch()
    
    # Print summary
    print("\nProcessing Summary:")
    print(f"Total receipts processed: {len(results)}")
    for image, data in results.items():
        print(f"\nReceipt: {image}")
        print(f"Details: {data}")