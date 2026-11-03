import axios from 'axios';

// Có thể đổi địa chỉ backend bằng VITE_API_URL trong file .env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
  timeout: 10000,
  withCredentials: true, // Trình duyệt tự gửi cookie HttpOnly, JS không đọc cookie này.
});

export default api;

export const authApi = {
  register: (credentials) => api.post('/auth/register', credentials),
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

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
  if (error.response.status === 401) return 'Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại.';
  return 'Yêu cầu không thành công. Vui lòng thử lại.';
}
