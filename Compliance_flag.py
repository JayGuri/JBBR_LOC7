from langchain_community.llms import Ollama
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.embeddings import Embeddings
from sentence_transformers import SentenceTransformer
import json
from typing import Dict, Any, List
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class SentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
    
    def embed_documents(self, texts):
        embeddings = self.model.encode(texts)
        return embeddings.tolist()
    
    def embed_query(self, text):
        embedding = self.model.encode([text])[0]
        return embedding.tolist()

class CategoryBasedExpenseChecker:
    def __init__(self):
        # Initialize components
        self.embeddings = SentenceTransformerEmbeddings()
        self.vector_store = InMemoryVectorStore(self.embeddings)
        self.similarity_threshold = 0.7  # Adjust this threshold as needed
        self.authorized_categories = []
        self.category_budgets = {}

    def load_categories_from_csv(self, csv_file: str) -> None:
        """Load authorized categories and budgets from CSV file"""
        try:
            # Read CSV file
            df = pd.read_csv(csv_file)
            
            # Expecting columns: 'category' and 'max_budget'
            if 'Categories' not in df.columns or 'Max_budget_per_bill' not in df.columns:
                raise ValueError("CSV must contain 'category' and 'max_budget' columns")
            
            # Extract categories and budgets
            self.authorized_categories = df['Categories'].tolist()
            self.category_budgets = dict(zip(df['Categories'], df['Max_budget_per_bill']))
            
            print("Loaded authorized categories:", self.authorized_categories)
            print("Loaded category budgets:", self.category_budgets)
            
        except Exception as e:
            print(f"Error loading CSV file: {str(e)}")
            raise

    def calculate_category_similarity(self, receipt_category: str) -> tuple:
        """Calculate similarity between receipt category and authorized categories"""
        if not receipt_category:
            return None, 0.0
            
        receipt_embedding = self.embeddings.embed_query(receipt_category.lower())
        
        max_similarity = 0.0
        best_match = None
        
        for auth_category in self.authorized_categories:
            auth_embedding = self.embeddings.embed_query(auth_category.lower())
            similarity = cosine_similarity(
                [receipt_embedding],
                [auth_embedding]
            )[0][0]
            
            if similarity > max_similarity:
                max_similarity = similarity
                best_match = auth_category
                
        return best_match, max_similarity

    def evaluate_expense(self, amount: float, category: str, justification: str) -> Dict[str, str]:
        """Evaluate a single expense against policies"""
        violations = []
        
        # Check category authorization using similarity
        best_match, similarity = self.calculate_category_similarity(category)
        if similarity < self.similarity_threshold:
            violations.append(f"UNAUTHORIZED CATEGORY (Best match: {best_match}, Similarity: {similarity:.2f})")
        else:
            # Check budget limits only if category is authorized
            if amount > 0 and best_match in self.category_budgets:
                if amount > self.category_budgets[best_match]:
                    violations.append(f"OVER-BUDGET CLAIM (Limit: {self.category_budgets[best_match]})")
        
        # Check justification
        if not justification or justification.strip() == "":
            violations.append("MISSING JUSTIFICATION")
        
        if violations:
            return {
                "flag": "red",
                "reason": " | ".join(violations),
                "matched_category": best_match,
                "similarity_score": f"{similarity:.2f}"
            }
        else:
            return {
                "flag": "none",
                "reason": "none",
                "matched_category": best_match,
                "similarity_score": f"{similarity:.2f}"
            }

    def process_receipts(self, receipts_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process all receipts and add compliance flags"""
        processed_receipts = receipts_data.copy()
        
        for receipt_id, receipt in processed_receipts.items():
            try:
                amount = float(receipt['amount']) if receipt['amount'] != "Total amount not provided in the text" else 0
            except ValueError:
                amount = 0
            
            evaluation = self.evaluate_expense(
                amount=amount,
                category=receipt['category'],
                justification=receipt['justification']
            )
            
            processed_receipts[receipt_id].update({
                'flag': evaluation['flag'],
                'reason': evaluation['reason'],
                'matched_category': evaluation['matched_category'],
                'similarity_score': evaluation['similarity_score']
            })
        
        return processed_receipts

def main():
    # Initialize checker
    checker = CategoryBasedExpenseChecker()
    
    # Load categories and budgets from CSV
    checker.load_categories_from_csv("C:/PF/Projects/LOC_7.0/Company_budget_reimburse - Sheet1.csv")
    
    # Load receipt data
    with open('C:/PF/Projects/LOC_7.0/output/updated_receipt_results.json', 'r') as f:
        receipts_data = json.load(f)
    
    # Process receipts and add compliance flags
    processed_receipts = checker.process_receipts(receipts_data)
    
    # Save results
    with open('C:/PF/Projects/LOC_7.0/output/compliance_checked_receipts.json', 'w') as f:
        json.dump(processed_receipts, f, indent=4)

if __name__ == "__main__":
    main()