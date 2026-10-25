import apiService from './apiService';

const adminService = {
  // Get admin dashboard
  getDashboard: async () => {
    return apiService.get('/admin/dashboard');
  },

  // Get all users
  getUsers: async (page = 1, limit = 10, role = null, status = null, search = null) => {
    let endpoint = `/admin/users?page=${page}&limit=${limit}`;
    if (role) endpoint += `&role=${role}`;
    if (status) endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${search}`;
    return apiService.get(endpoint);
  },

  // Create new user
  createUser: async (userData) => {
    return apiService.post('/admin/users', userData);
  },

  // Suspend user
  suspendUser: async (userId, reason = '') => {
    return apiService.post(`/admin/users/${userId}/suspend`, { reason });
  },

  // Unsuspend user
  unsuspendUser: async (userId) => {
    return apiService.post(`/admin/users/${userId}/unsuspend`, {});
  },

  // Get maintenance records
  getMaintenance: async (page = 1, limit = 10, status = null, priority = null) => {
    let endpoint = `/admin/maintenance?page=${page}&limit=${limit}`;
    if (status) endpoint += `&status=${status}`;
    if (priority) endpoint += `&priority=${priority}`;
    return apiService.get(endpoint);
  },

  // Create maintenance record
  createMaintenance: async (maintenanceData) => {
    return apiService.post('/admin/maintenance', maintenanceData);
  },

  // Update maintenance record
  updateMaintenance: async (id, maintenanceData) => {
    return apiService.put(`/admin/maintenance/${id}`, maintenanceData);
  },

  // Delete maintenance record
  deleteMaintenance: async (id) => {
    return apiService.delete(`/admin/maintenance/${id}`);
  },
};

export default adminService;
