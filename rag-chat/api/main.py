from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()
BACKEND_URL = "http://rag-backend-service:8081"  # internal service name

class Query(BaseModel):
    query: str

@app.post("/rag")
def chat(q: Query):
    response = requests.post(f"{BACKEND_URL}/rag", json={"query": q.query})
    return response.json()

