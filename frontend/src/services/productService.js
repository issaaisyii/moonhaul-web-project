import api from './api.js';

export const getProductsApi = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProductApi = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
