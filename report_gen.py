import os
import json

def generate_expense_reports(data):
    """
    Generate structured reports for each bill with user-provided justifications.
    """
    print("\nEnter justifications for each bill:")

    for file_name, bill_data in data.items():
        print(f"\nBill: {file_name}")
        print(f"Vendor: {bill_data['vendor']}")
        print(f"Amount: {bill_data['amount']}")
        print(f"Category: {bill_data['category']}")
        print(f"Date: {bill_data.get('date', 'Not provided')}")

        # Prompt user for justification
        justification_text = input("Enter justification: ").strip()
        if not justification_text:
            justification_text = ""

        # Add justification directly to the JSON structure
        bill_data["justification"] = justification_text

    return data

# File path for the JSON data
file_path = "C:/PF/Projects/LOC_7.0/output/receipt_results.json"

# Open and load the JSON file
with open(file_path, "r", encoding="utf-8") as file:
    sample_data = json.load(file)

# Generate reports with user-provided justifications
updated_data = generate_expense_reports(sample_data)

# Save the updated data
output_file = "C:/PF/Projects/LOC_7.0/output/updated_receipt_results.json"
with open(output_file, "w", encoding="utf-8") as out_file:
    json.dump(updated_data, out_file, indent=4)

print(f"\nUpdated receipt data saved to {output_file}")