import api from './api.js';

export const getOrdersApi = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderDetailApi = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAdminOrdersApi = async (params) => {
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const updateOrderStatusApi = async (id, status) => {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};
