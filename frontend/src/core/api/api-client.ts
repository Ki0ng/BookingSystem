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
    const status = error.response?.status;

    // Handle global errors here
    if (status === 401) {
      // 🚀 Silent fail for profile checks or expected unauthorized states
      // We don't log to console here to keep it clean
    } else if (status && status >= 500) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔥 Server Error:', error.response?.data || error.message);
      }
    }
    
    return Promise.reject(error);
  }
);


export default apiClient;
