import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const getBaseURL = () => {
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (publicApiUrl) return publicApiUrl;
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  return ''; 
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle global errors here (e.g. 401 Unauthorized)
    if (error.response?.status === 401) {
      // Logic logout hoặc refresh token
    }
    return Promise.reject(error);
  }
);

export default apiClient;
