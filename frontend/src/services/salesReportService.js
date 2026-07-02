import api from './api.js';

export const getSalesReportApi = async () => {
  const response = await api.get('/admin/sales-report');
  return response.data;
};
