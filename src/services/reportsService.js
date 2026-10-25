import apiService from './apiService';

const reportsService = {
  // Get facility usage report
  getFacilityUsage: async (startDate, endDate) => {
    return apiService.get(`/admin/reports/facility-usage?start_date=${startDate}&end_date=${endDate}`);
  },

  // Get asset borrowing report
  getAssetBorrowing: async (startDate, endDate) => {
    return apiService.get(`/admin/reports/asset-borrowing?start_date=${startDate}&end_date=${endDate}`);
  },

  // Get reservation statistics
  getReservationStats: async (startDate, endDate) => {
    return apiService.get(`/admin/reports/reservation-stats?start_date=${startDate}&end_date=${endDate}`);
  },

  // Get overdue returns
  getOverdueReturns: async () => {
    return apiService.get('/admin/reports/overdue-returns');
  },

  // Get maintenance log
  getMaintenanceLog: async (startDate, endDate) => {
    return apiService.get(`/admin/reports/maintenance-log?start_date=${startDate}&end_date=${endDate}`);
  },

  // Get cancellation report
  getCancellationReport: async (startDate, endDate) => {
    return apiService.get(`/admin/reports/cancellations?start_date=${startDate}&end_date=${endDate}`);
  },

  // Export report
  exportReport: async (reportType, format = 'csv') => {
    return apiService.post('/admin/reports/export', {
      type: reportType,
      format,
    });
  },
};

export default reportsService;
