// src/services/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://35.231.22.67:8081";

// The request shape must match backend expectation
export interface ChatRequest {
  query: string;        // ✅ backend expects "query"
  user_email?: string;  // optional
}

export interface ChatResponse {
  answer: string;
  latency?: number;
}

// API service class
class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // ✅ Always send { query: "..."}
  async sendMessage(input: string, user_email?: string): Promise<ChatResponse> {
    const request: ChatRequest = { query: input, user_email };
    console.log("Sending request to backend:", request);

    return this.makeRequest<ChatResponse>("/rag", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService();



// // API service for communicating with RAG backend
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// export interface ChatRequest {
//   message: string
//   user_email?: string
//   conversation_id?: string
// }

// export interface ChatResponse {
//   response: string
//   conversation_id?: string
//   sources?: string[]
//   timestamp: string
// }

// class ApiService {
//   private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${API_BASE_URL}${endpoint}`

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       ...options,
//     })

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.status} ${response.statusText}`)
//     }

//     return response.json()
//   }

//   async sendMessage(request: ChatRequest): Promise<ChatResponse> {
//     return this.makeRequest<ChatResponse>("/chat", {
//       method: "POST",
//       body: JSON.stringify(request),
//     })
//   }

//   async uploadDocument(file: File): Promise<{ message: string; document_id: string }> {
//     const formData = new FormData()
//     formData.append("file", file)

//     return this.makeRequest("/upload", {
//       method: "POST",
//       body: formData,
//       headers: {}, // Let browser set Content-Type for FormData
//     })
//   }

//   async healthCheck(): Promise<{ status: string }> {
//     return this.makeRequest("/health")
//   }
// }

// export const apiService = new ApiService()
