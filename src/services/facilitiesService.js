import apiService from './apiService';

const facilitiesService = {
  // Get all facilities
  getAll: async (page = 1, limit = 12, category = null, search = null) => {
    let endpoint = `/facilities?page=${page}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (search) endpoint += `&search=${search}`;
    return apiService.get(endpoint);
  },

  // Get facility by ID
  getById: async (id) => {
    return apiService.get(`/facilities/${id}`);
  },

  // Get facility availability
  getAvailability: async (id, startDate, endDate) => {
    return apiService.get(`/facilities/${id}/availability?start_date=${startDate}&end_date=${endDate}`);
  },

  // Get facility categories
  getCategories: async () => {
    return apiService.get('/facilities/categories');
  },

  // Admin: Create facility
  create: async (facilityData) => {
    return apiService.post('/admin/facilities', facilityData);
  },

  // Admin: Update facility
  update: async (id, facilityData) => {
    return apiService.put(`/admin/facilities/${id}`, facilityData);
  },

  // Admin: Delete facility
  delete: async (id) => {
    return apiService.delete(`/admin/facilities/${id}`);
  },
};

export default facilitiesService;
