/**
 * Authentication Service
 * - Enforces backend authentication logic
 * - Handles token lifecycle with validation
 * - Provides secure user session management
 */

import apiService, { AuthenticationError, ValidationError } from './apiService';

const tokenStorage = {
  store: null,

  init() {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      this.store = sessionStorage;
    } catch (e) {
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

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateUsername = (username) => {
  // Alphanumeric and underscore, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const authService = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.username - Username
   * @param {string} userData.password - Password
   * @param {string} userData.role - User role (student, faculty, staff, admin)
   * @returns {Promise<Object>} User data and token
   */
  register: async (userData) => {
    const { email, username, password, role = 'student' } = userData;

    // Validate inputs
    if (!email || !username || !password) {
      throw new ValidationError('Email, username, and password are required');
    }

    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!validateUsername(username)) {
      throw new ValidationError(
        'Username must be 3-20 characters, alphanumeric and underscores only'
      );
    }

    if (!validatePassword(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters with uppercase, lowercase, and numbers'
      );
    }

    const validRoles = ['student', 'faculty', 'staff', 'admin'];
    if (!validRoles.includes(role)) {
      throw new ValidationError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    try {
      const response = await apiService.post('/auth/register', {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        password,
        role: role.toLowerCase(),
      });

      // Registration does not create a session. The user must log in next.
      return response.data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof AuthenticationError) {
        throw new ValidationError(error.message, error.details);
      }
      throw error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    const { email, password } = credentials;

    // Validate inputs
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!password || password.length < 1) {
      throw new ValidationError('Password is required');
    }

    try {
      const response = await apiService.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });

      const authData = response?.data?.token
        ? response.data
        : response?.data?.data || response?.data || response;
      if (!authData?.token) {
        throw new AuthenticationError('No token received from server');
      }

      apiService.setToken(authData.token);
      if (authData.user) {
        tokenStorage.set('user', JSON.stringify(authData.user));
      }

      return authData;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        error.message || 'Login failed. Please check your credentials.'
      );
    }
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Attempt server logout to invalidate session
      if (apiService.getToken()) {
        await apiService.post('/auth/logout', {});
      }
    } catch (error) {
      // Continue logout even if server call fails
      console.error('Server logout failed:', error.message);
    } finally {
      // Clear local auth state
      apiService.clearAuthTokens();
      tokenStorage.remove('user');
    }
  },

  clearAuthState: () => {
    apiService.clearAuthTokens();
    tokenStorage.remove('user');
  },

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token data
   */
  refreshToken: async () => {
    try {
      const response = await apiService.post('/auth/refresh', {});
      const authData = response?.data?.token
        ? response.data
        : response?.data?.data || response?.data || response;

      if (!authData?.token) {
        throw new AuthenticationError('No token received from server');
      }

      apiService.setToken(authData.token);

      if (authData.user) {
        tokenStorage.set('user', JSON.stringify(authData.user));
      }

      return authData;
    } catch (error) {
      // If refresh fails, clear auth and require re-login
      apiService.clearAuthTokens();
      tokenStorage.remove('user');
      throw error;
    }
  },

  /**
   * Get current authenticated user
   * @returns {Object|null} User object or null if not authenticated
   */
  getCurrentUser: () => {
    const userStr = tokenStorage.get('user');
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      // Validate user object has required fields
      if (user && user.id && user.email) {
        return user;
      }
      return null;
    } catch (e) {
      tokenStorage.remove('user');
      return null;
    }
  },

  getToken: () => apiService.getToken(),

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = apiService.getToken();
    const user = authService.getCurrentUser();
    const isExpired = apiService.isTokenExpired();

    return !!token && !!user && !isExpired;
  },

  /**
   * Check if user has specific role
   * @param {string|string[]} requiredRoles - Role(s) to check
   * @returns {boolean}
   */
  hasRole: (requiredRoles) => {
    const user = authService.getCurrentUser();
    if (!user || !user.role) return false;

    if (typeof requiredRoles === 'string') {
      return user.role === requiredRoles;
    }

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }

    return false;
  },

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  hasPermission: (permission) => {
    const user = authService.getCurrentUser();
    if (!user || !user.permissions) return false;

    if (!Array.isArray(user.permissions)) return false;

    return user.permissions.includes(permission);
  },

  /**
   * Get token expiration time in seconds
   * @returns {number|null} Seconds until expiration or null
   */
  getTokenExpiresIn: () => {
    return apiService.getTokenExpiresIn();
  },

  /**
   * Check if token is expired
   * @returns {boolean}
   */
  isTokenExpired: () => {
    return apiService.isTokenExpired();
  },
};

export default authService;
