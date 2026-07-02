import api from './api.js';

export const loginApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const updateProfileApi = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};
