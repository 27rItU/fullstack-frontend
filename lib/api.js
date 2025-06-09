import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postsApi = {
  // Get paginated posts
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?_page=${page}&_limit=${limit}`);
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count'] || '100'),
    };
  },

  // Get single post
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (post) => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  // Update post
  updatePost: async (id, post) => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    await api.delete(`/posts/${id}`);
  },
};