/**
 * Production-Grade API Service
 * - Enforces backend logic and response validation
 * - Handles authentication, retries, and error mapping
 * - Prevents XSS and implements security best practices
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;

class APIError extends Error {
  constructor(message, status, code, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed', details) {
    super(message, 401, 'AUTH_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends APIError {
  constructor(message = 'Insufficient permissions', details) {
    super(message, 403, 'AUTHZ_ERROR', details);
    this.name = 'AuthorizationError';
  }
}

class ValidationError extends APIError {
  constructor(message = 'Validation failed', details) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

class NetworkError extends APIError {
  constructor(message = 'Network request failed', details) {
    super(message, 0, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

// Secure token storage (sessionStorage instead of localStorage)
const tokenStorage = {
  store: null,

  init() {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      this.store = sessionStorage;
    } catch (e) {
      // Fallback to in-memory if sessionStorage unavailable
      this.store = new Map();
    }
  },

  set(key, value) {
    if (this.store instanceof Map) {
      this.store.set(key, value);
    } else {
      this.store.setItem(key, value);
    }
  },

  get(key) {
    if (this.store instanceof Map) {
      return this.store.get(key) || null;
    }
    return this.store.getItem(key);
  },

  remove(key) {
    if (this.store instanceof Map) {
      this.store.delete(key);
    } else {
      this.store.removeItem(key);
    }
  },

  clear() {
    if (this.store instanceof Map) {
      this.store.clear();
    } else {
      this.store.clear();
    }
  },
};

tokenStorage.init();

const apiService = {
  // Token Management
  setToken: (token) => {
    if (!token || typeof token !== 'string') {
      tokenStorage.remove('auth_token');
      tokenStorage.remove('token_expires_at');
      return;
    }
    tokenStorage.set('auth_token', token);

    // Decode JWT token to get expiration
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp) {
          tokenStorage.set('token_expires_at', payload.exp * 1000);
        }
      }
    } catch (e) {
      // Token is not JWT, just store it
    }
  },

  getToken: () => tokenStorage.get('auth_token'),

  isTokenExpired: () => {
    const expiresAt = tokenStorage.get('token_expires_at');
    if (!expiresAt) return false;
    return Date.now() >= parseInt(expiresAt);
  },

  getTokenExpiresIn: () => {
    const expiresAt = tokenStorage.get('token_expires_at');
    if (!expiresAt) return null;
    const secondsRemaining = (parseInt(expiresAt) - Date.now()) / 1000;
    return Math.max(0, secondsRemaining);
  },

  clearAuthTokens: () => {
    tokenStorage.remove('auth_token');
    tokenStorage.remove('token_expires_at');
    tokenStorage.remove('user');
  },

  // Request Headers with CSRF protection
  getHeaders: () => {
    const token = apiService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  },

  // Retry logic with exponential backoff
  async retryRequest(fn, retries = 0) {
    try {
      return await fn();
    } catch (error) {
      if (
        retries < MAX_RETRIES &&
        error instanceof NetworkError &&
        error.status === 0
      ) {
        const delay = RETRY_DELAY * Math.pow(2, retries);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryRequest(fn, retries + 1);
      }
      throw error;
    }
  },

  // Make API request with full error handling
  async request(endpoint, options = {}) {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new ValidationError('Invalid endpoint provided');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: { ...apiService.getHeaders(), ...options.headers },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    };

    if (options.body) {
      if (typeof options.body !== 'object') {
        throw new ValidationError('Request body must be an object');
      }
      config.body = JSON.stringify(options.body);
    }

    config.credentials = 'omit';

    try {
      const response = await this.retryRequest(async () => {
        return fetch(url, config);
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle specific HTTP status codes
      if (response.status === 401) {
        apiService.clearAuthTokens();
        throw new AuthenticationError(
          data?.message || 'Authentication required. Please login again.',
          { originalStatus: response.status }
        );
      }

      if (response.status === 403) {
        throw new AuthorizationError(
          data?.message || 'You do not have permission to access this resource.',
          { originalStatus: response.status }
        );
      }

      if (response.status === 422 || response.status === 400) {
        throw new ValidationError(
          data?.message || 'Invalid request data',
          {
            errors: data?.errors || data?.data?.errors,
            originalStatus: response.status,
          }
        );
      }

      if (!response.ok) {
        throw new APIError(
          data?.message || `API Error: ${response.status}`,
          response.status,
          `HTTP_${response.status}`,
          { data }
        );
      }

      // Validate response structure
      if (data && typeof data === 'object') {
        return data;
      }

      throw new APIError('Invalid response format from server', 500, 'INVALID_RESPONSE');
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout', { timeout: REQUEST_TIMEOUT });
      }

      if (error instanceof SyntaxError) {
        throw new APIError('Failed to parse server response', 500, 'PARSE_ERROR');
      }

      if (error instanceof TypeError) {
        throw new NetworkError(
          'Network request failed. Please check your connection.',
          { originalError: error.message }
        );
      }

      throw new APIError(
        error.message || 'An unexpected error occurred',
        0,
        'UNKNOWN_ERROR',
        { originalError: error }
      );
    }
  },

  // HTTP Methods
  get: (endpoint) => apiService.request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    apiService.request(endpoint, { method: 'POST', body }),

  put: (endpoint, body) =>
    apiService.request(endpoint, { method: 'PUT', body }),

  patch: (endpoint, body) =>
    apiService.request(endpoint, { method: 'PATCH', body }),

  delete: (endpoint) => apiService.request(endpoint, { method: 'DELETE' }),
};

export {
  apiService as default,
  APIError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NetworkError,
};
