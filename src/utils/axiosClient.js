// src/utils/axiosClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});

// ✅ attach token on every request
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err.response?.data || err.message);
    return Promise.reject(err);
  },
);

export default api;
