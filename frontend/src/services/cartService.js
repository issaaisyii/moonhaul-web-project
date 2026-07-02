import api from './api.js';

export const getCartApi = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addCartItemApi = async (productId, quantity) => {
  const response = await api.post('/cart/items', { productId, quantity });
  return response.data;
};

export const updateCartItemApi = async (cartItemId, quantity) => {
  const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
  return response.data;
};

export const deleteCartItemApi = async (cartItemId) => {
  const response = await api.delete(`/cart/items/${cartItemId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};
