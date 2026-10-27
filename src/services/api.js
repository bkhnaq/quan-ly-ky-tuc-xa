import axios from 'axios';

// Có thể đổi địa chỉ backend bằng VITE_API_URL trong file .env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

export const roomApi = {
  getAll: (signal) => api.get('/rooms', { signal }),
  getById: (id) => api.get(`/rooms/${encodeURIComponent(id)}`),
  create: (room) => api.post('/rooms', room),
  update: (id, room) => api.put(`/rooms/${encodeURIComponent(id)}`, room),
  remove: (id) => api.delete(`/rooms/${encodeURIComponent(id)}`),
};

export const getStatistics = (signal) => api.get('/statistics', { signal });

export function getApiError(error) {
  if (!error.response) return 'Không kết nối được API. Kiểm tra backend đang chạy ở cổng 5000 và thử lại.';
  const data = error.response.data;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  if (data?.message) return data.message;
  return 'Yêu cầu không thành công. Vui lòng thử lại.';
}
