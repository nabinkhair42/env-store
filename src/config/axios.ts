import axios from 'axios';
import { API_TIMEOUT_MS } from './app-data';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: API_TIMEOUT_MS,
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export default api;
