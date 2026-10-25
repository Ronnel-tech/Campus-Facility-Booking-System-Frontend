import apiService from './apiService';

const authService = {
  // Register new user
  register: async (email, username, password, role = 'student') => {
    const response = await apiService.post('/auth/register', {
      email,
      username,
      password,
      role,
    });
    if (response.data?.token) {
      apiService.setToken(response.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await apiService.post('/auth/login', {
      email,
      password,
    });
    if (response.data?.token) {
      apiService.setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    apiService.setToken(null);
    localStorage.removeItem('user');
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiService.post('/auth/refresh', {});
    if (response.data?.token) {
      apiService.setToken(response.data.token);
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!apiService.getToken() && !!authService.getCurrentUser();
  },
};

export default authService;
