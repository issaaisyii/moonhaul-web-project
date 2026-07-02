import api from './api.js';

export const getCustomersApi = async (params) => {
  const response = await api.get('/admin/customers', { params });
  return response.data;
};
