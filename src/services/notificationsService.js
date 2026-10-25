import apiService from './apiService';

const notificationsService = {
  // Get all notifications
  getAll: async (page = 1, limit = 20, isRead = null) => {
    let endpoint = `/notifications?page=${page}&limit=${limit}`;
    if (isRead !== null) endpoint += `&is_read=${isRead}`;
    return apiService.get(endpoint);
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return apiService.post(`/notifications/${id}/read`, {});
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiService.post('/notifications/read-all', {});
  },

  // Delete notification
  delete: async (id) => {
    return apiService.delete(`/notifications/${id}`);
  },

  // Get unread count
  getUnreadCount: async () => {
    return apiService.get('/notifications/unread-count');
  },
};

export default notificationsService;
