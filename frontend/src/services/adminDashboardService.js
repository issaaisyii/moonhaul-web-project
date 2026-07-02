import api from './api.js';

export const getAdminDashboardApi = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};
