import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type {
  CustomAxiosRequestConfig,
  ApiResponse,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from '@/shared/types/axios.definitions';
import { getErrorMessage, isNetworkError, isTimeoutError } from '@/shared/utils/axios.helper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const customConfig = config as CustomAxiosRequestConfig;
  if (token && !customConfig.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    delete config.headers['content-type'];
  }
  
  return config;
};

const responseInterceptor = (response: AxiosResponse<ApiResponse>) => {
  return response;
};

const errorInterceptor = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as import('@/shared/types/axios.definitions').AxiosErrorResponse;
    const customConfig = axiosError.config as CustomAxiosRequestConfig;
    
    if (customConfig?.skipErrorHandling) {
      return Promise.reject(error);
    }
    
    if (isNetworkError(axiosError)) {
      console.error('Network Error: Please check your internet connection');
      return Promise.reject(new Error('Network Error: Please check your internet connection'));
    }
    
    if (isTimeoutError(axiosError)) {
      console.error('Request Timeout: The request took too long to complete');
      return Promise.reject(new Error('Request Timeout: The request took too long to complete'));
    }
    
    if (axiosError.response) {
      const errorMessage = getErrorMessage(axiosError);
      const status = axiosError.response.status;
      
      switch (status) {
        case 401:
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          console.error('Unauthorized: Please login again');
          break;
        case 403:
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          console.error('Not Found: The requested resource was not found');
          break;
        case 413:
          console.error('File too large: The uploaded file exceeds the maximum allowed size');
          break;
        case 415:
          console.error('Unsupported media type: The file format is not supported');
          break;
        case 500:
          console.error('Server Error: Something went wrong on the server');
          if (axiosError.config?.data instanceof FormData) {
            console.error('💡 Hint: This might be a file upload issue. Check file size, format, or backend configuration.');
          }
          break;
        default:
          console.error(`Error ${status}: ${errorMessage}`);
      }
      
      return Promise.reject(new Error(errorMessage));
    }
  }
  
  console.error('Unexpected Error:', error);
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);

export function configureRequestInterceptor(config: RequestInterceptorConfig): void {
  if (config.onFulfilled) {
    axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const result = config.onFulfilled!(requestConfig as CustomAxiosRequestConfig);
        return result as InternalAxiosRequestConfig;
      },
      config.onRejected
    );
  }
}

export function configureResponseInterceptor(config: ResponseInterceptorConfig): void {
  if (config.onFulfilled || config.onRejected) {
    axiosInstance.interceptors.response.use(
      config.onFulfilled,
      config.onRejected
    );
  }
}

export function setAuthToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
      document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
    } else {
      localStorage.removeItem('token');
      document.cookie = 'accessToken=; path=/; max-age=0';
    }
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function setBaseURL(url: string): void {
  axiosInstance.defaults.baseURL = url;
}

export default axiosInstance;

export { axios };

