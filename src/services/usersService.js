import apiService from './apiService';

const usersService = {
  // Get user profile
  getProfile: async () => {
    return apiService.get('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiService.put('/users/profile', profileData);
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    return apiService.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    return apiService.get('/users/notification-preferences');
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    return apiService.put('/users/notification-preferences', preferences);
  },
};

export default usersService;
