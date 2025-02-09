import streamlit as st
import json
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings
import numpy as np

# Custom embedding class to wrap SentenceTransformer
class SentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
    
    def embed_documents(self, texts):
        embeddings = self.model.encode(texts)
        return embeddings.tolist()
    
    def embed_query(self, text):
        embedding = self.model.encode([text])[0]
        return embedding.tolist()

# Initialize components
embeddings = SentenceTransformerEmbeddings()
vector_store = InMemoryVectorStore(embeddings)
model = OllamaLLM(model="qwen2.5:7b", temperature=0.3)

compliance_template = """
You are an assistant for expense compliance analysis. Based on the compliance report, flag each expense as:
- **Green**: No issues.
- **Yellow**: Identify duplicate receipts, outlier transactions, or suspicious spending patterns using anomaly detection.
- **Red**: Flag policy violations such as over-budget claims, unauthorized categories, or missing justifications.
Provide explanations for flagged transactions.

Compliance Report Context:
{context}

Expense Report JSON:
{expense_report}

Analysis:
"""

pdfs_directory = 'C:/PF/Projects/CO-CODE/Pdf_folder/'

def upload_pdf(file):
    with open(pdfs_directory + file.name, "wb") as f:
        f.write(file.getbuffer())

def load_pdf(file_path):
    loader = PDFPlumberLoader(file_path)
    documents = loader.load()
    return documents

def split_text(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True
    )
    return text_splitter.split_documents(documents)

def index_docs(documents):
    vector_store.add_documents(documents)

def retrieve_docs(query):
    return vector_store.similarity_search(query)

def analyze_expenses(compliance_docs, expense_json):
    context = "\n\n".join([doc.page_content for doc in compliance_docs])
    prompt = ChatPromptTemplate.from_template(compliance_template)
    chain = prompt | model
    return chain.invoke({"context": context, "expense_report": json.dumps(expense_json, indent=2)})

# Streamlit Interface
st.title("Expense Compliance Checker")

if 'vector_store_initialized' not in st.session_state:
    st.session_state.vector_store_initialized = False

uploaded_compliance_file = st.file_uploader("Upload Compliance Report (PDF)", type="pdf", accept_multiple_files=False)

expense_report_json = st.text_area("Paste your Expense Report (JSON Format)")

if uploaded_compliance_file:
    with st.spinner("Processing Compliance Report..."):
        upload_pdf(uploaded_compliance_file)
        compliance_documents = load_pdf(pdfs_directory + uploaded_compliance_file.name)
        chunked_documents = split_text(compliance_documents)
        index_docs(chunked_documents)
        st.session_state.vector_store_initialized = True
        st.success("Compliance Report processed successfully!")

if expense_report_json and st.session_state.vector_store_initialized:
    try:
        expense_data = json.loads(expense_report_json)
        with st.spinner("Analyzing Expenses..."):
            analysis_result = analyze_expenses(compliance_documents, expense_data)
            st.write("### Compliance Analysis Result:")
            st.write(analysis_result)
    except json.JSONDecodeError:
        st.error("Invalid JSON format. Please check your expense report and try again.")
