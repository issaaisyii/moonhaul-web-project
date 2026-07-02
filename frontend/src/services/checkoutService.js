import api from './api.js';

export const checkoutApi = async () => {
  const response = await api.post('/checkout');
  return response.data;
};
