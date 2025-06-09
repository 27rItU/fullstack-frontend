const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dev-key-12345';

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add API key for POST, PUT, DELETE requests
    if (['POST', 'PUT', 'DELETE'].includes(options.method || 'GET')) {
      config.headers = {
        ...config.headers,
        'X-API-Key': this.apiKey,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Get all posts
  async getPosts() {
    return this.request<Post[]>('/api/posts');
  }

  // Get single post
  async getPost(id: string | number) {
    return this.request<Post>(`/api/posts/${id}`);
  }

  // Update post title
  async updatePost(id: string | number, title: string) {
    return this.request<Post>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  // Create new post
  async createPost(title: string, body: string, userId: number = 1) {
    return this.request<Post>('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, body, userId }),
    });
  }

  // Analyze text
  async analyzeText(text: string, postId?: number) {
    return this.request<Analysis>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, postId }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ message: string; timestamp: string }>('/health');
  }
}

// Types
export interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Analysis {
  wordCount: number;
  keywords: string[];
  sentiment: string;
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL, API_KEY);