FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy backend code
COPY rag_backend/ ./rag_backend/

# ✅ Copy data folder explicitly
COPY rag_backend/data ./rag_backend/data

# Run backend
CMD ["uvicorn", "rag_backend.rag:app", "--host", "0.0.0.0", "--port", "8081"]

