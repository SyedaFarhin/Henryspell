import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: BASE });

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);
    const status = err.response?.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post(`${BASE}/api/auth/refresh`, { refreshToken }, { headers: { 'Content-Type': 'application/json' } });
        const newAccess = res.data.accessToken;
        localStorage.setItem('accessToken', newAccess);
        onRefreshed(newAccess);
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // failed to refresh
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        onRefreshed(null);
        window.location.href = '/signin';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
