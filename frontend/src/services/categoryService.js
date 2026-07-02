import api from './api.js';

export const getCategoriesApi = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategoryApi = async (name) => {
  const response = await api.post('/categories', { name });
  return response.data;
};

export const updateCategoryApi = async (id, name) => {
  const response = await api.put(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
