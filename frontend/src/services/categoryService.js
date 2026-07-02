import api from './api.js';

export const getCategoriesApi = async () => {
  const response = await api.get('/categories');
  return response.data;
};
