// API Configuration and Base Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

const apiService = {
  // Set auth token
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },

  // Get auth token
  getToken: () => localStorage.getItem('auth_token'),

  // Get request headers
  getHeaders: () => {
    const token = apiService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  },

  // Make API request
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: apiService.getHeaders(),
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // GET request
  get: (endpoint) => apiService.request(endpoint, { method: 'GET' }),

  // POST request
  post: (endpoint, body) => apiService.request(endpoint, { method: 'POST', body }),

  // PUT request
  put: (endpoint, body) => apiService.request(endpoint, { method: 'PUT', body }),

  // DELETE request
  delete: (endpoint) => apiService.request(endpoint, { method: 'DELETE' }),
};

export default apiService;
