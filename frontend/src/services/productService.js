import api from './api.js';

export const getProductsApi = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
