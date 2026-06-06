import axios from 'axios';
import { BASE_URL } from '../constants/Config';
import { getToken, saveToken, removeToken } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Inject bearer token from Keychain
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Manage token refresh and extract payloads
apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.success) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          const { accessToken } = response.data.data;
          await saveToken(accessToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        await removeToken();
        
        // Dynamically import store to avoid circular dependency
        const { store } = require('../redux/store');
        const { logout } = require('../redux/slices/authSlice');
        store.dispatch(logout());
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || `Error ${status || 'Network'}: ${url || 'Unknown'} - Something went wrong`;
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
