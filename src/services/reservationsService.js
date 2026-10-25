import apiService from './apiService';

const reservationsService = {
  // Get user reservations
  getAll: async (page = 1, limit = 10, status = null) => {
    let endpoint = `/reservations?page=${page}&limit=${limit}`;
    if (status) endpoint += `&status=${status}`;
    return apiService.get(endpoint);
  },

  // Get reservation by ID
  getById: async (id) => {
    return apiService.get(`/reservations/${id}`);
  },

  // Create new reservation
  create: async (reservationData) => {
    return apiService.post('/reservations', reservationData);
  },

  // Cancel reservation
  cancel: async (id) => {
    return apiService.post(`/reservations/${id}/cancel`, {});
  },

  // Admin: Get all reservations
  getAllAdmin: async (page = 1, limit = 10, status = null) => {
    let endpoint = `/admin/reservations?page=${page}&limit=${limit}`;
    if (status) endpoint += `&status=${status}`;
    return apiService.get(endpoint);
  },

  // Admin: Approve reservation
  approve: async (id) => {
    return apiService.post(`/admin/reservations/${id}/approve`, {});
  },

  // Admin: Reject reservation
  reject: async (id, remarks = '') => {
    return apiService.post(`/admin/reservations/${id}/reject`, { remarks });
  },
};

export default reservationsService;
