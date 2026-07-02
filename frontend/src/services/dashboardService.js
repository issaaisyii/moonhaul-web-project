import api from './api.js';

export const getCustomerDashboardApi = async () => {
  const response = await api.get('/dashboard/customer');
  return response.data;
};
