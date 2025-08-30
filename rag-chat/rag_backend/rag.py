
from fastapi import FastAPI
from pydantic import BaseModel
import time, logging

from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI

logging.basicConfig(level=logging.INFO)
app = FastAPI()

# Load your actual PDFs (✅ matches your files)
pdf_loader1 = PyPDFLoader("rag_backend/data/test-bank.pdf")
pdf_loader2 = PyPDFLoader("rag_backend/data/test-bank-ans.pdf")
docs = pdf_loader1.load() + pdf_loader2.load()

# Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = splitter.split_documents(docs)

# Embed + store
embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(chunks, embeddings, persist_directory="./chroma_store")

# Retrieval + LLM
retriever = vectordb.as_retriever()
llm = ChatOpenAI(model="gpt-4o-mini")
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

class Query(BaseModel):
    query: str

@app.post("/rag")
def rag(q: Query):
    start = time.time()
    try:
        answer = qa_chain.run(q.query)
        latency = time.time() - start
        logging.info(f"metric=rag_latency value={latency}")
        return {"answer": answer, "latency": latency}
    except Exception as e:
        return {"error": str(e)}
