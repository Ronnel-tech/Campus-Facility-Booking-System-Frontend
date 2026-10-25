import apiService from './apiService';

const assetsService = {
  // Get all assets
  getAll: async (page = 1, limit = 12, category = null, search = null, status = null) => {
    let endpoint = `/assets?page=${page}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (search) endpoint += `&search=${search}`;
    if (status) endpoint += `&status=${status}`;
    return apiService.get(endpoint);
  },

  // Get asset by ID
  getById: async (id) => {
    return apiService.get(`/assets/${id}`);
  },

  // Get asset categories
  getCategories: async () => {
    return apiService.get('/assets/categories');
  },

  // Admin: Create asset
  create: async (assetData) => {
    return apiService.post('/admin/assets', assetData);
  },

  // Admin: Update asset
  update: async (id, assetData) => {
    return apiService.put(`/admin/assets/${id}`, assetData);
  },

  // Admin: Delete asset
  delete: async (id) => {
    return apiService.delete(`/admin/assets/${id}`);
  },

  // Admin: Get inventory
  getInventory: async () => {
    return apiService.get('/admin/assets/inventory');
  },
};

export default assetsService;
