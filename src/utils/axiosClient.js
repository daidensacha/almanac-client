// src/utils/axiosClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API, // e.g. http://localhost:8000/api
  withCredentials: true, // fine to keep on; header auth will carry the token
});

// Read token from localStorage and attach Authorization automatically
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export default api;
