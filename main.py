from processor import ReceiptProcessor

if __name__ == "__main__":
    processor = ReceiptProcessor(input_dir='LOC_7.0/images', output_dir='C:/PF/Projects/LOC_7.0/output')
    results = processor.process_batch()

    # Print summary
    if results:
        print("\nProcessing Summary:")
        print(f"Total receipts processed: {len(results)}")
        for image, data in results.items():
            print(f"\nReceipt: {image}")
            print(f"Details: {data}")
    else:
        print("\nNo receipts were processed.")
