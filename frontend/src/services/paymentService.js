import api from './api.js';

export const uploadPaymentProofApi = async (formData, onUploadProgress) => {
  const response = await api.post('/payments/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress
  });
  return response.data;
};

export const getMyPaymentsApi = async () => {
  const response = await api.get('/payments/my');
  return response.data;
};

export const getPaymentsApi = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const approvePaymentApi = async (id) => {
  const response = await api.put(`/payments/${id}/approve`);
  return response.data;
};

export const rejectPaymentApi = async (id, notes) => {
  const response = await api.put(`/payments/${id}/reject`, { notes });
  return response.data;
};
