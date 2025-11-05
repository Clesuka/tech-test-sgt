import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  try {
    // Lazy import firebase auth only on client to avoid importing firebase on server
    if (typeof window !== 'undefined') {
      const mod = await import('./firebase/auth');
      const token = await mod.getIdToken();
      if (token) {
        if (!config.headers) config.headers = {} as any;
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore token errors
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;