// src/services/api.ts
// API service for communicating with RAG backend

// ✅ Replace with your backend public IP + port
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://35.231.22.67:8081";

export interface ChatRequest {
  query: string;          // ✅ backend expects { "query": "..." }
  user_email?: string;
  conversation_id?: string;
}

export interface ChatResponse {
  answer: string;         // ✅ backend returns { "answer": "..." }
  latency?: number;
  sources?: string[];
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>("/rag", {   // ✅ use /rag not /chat
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService();
