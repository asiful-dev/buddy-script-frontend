import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type {
  CustomAxiosRequestConfig,
  ApiResponse,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from '@/shared/types/axios.definitions';
import { getErrorMessage, isNetworkError, isTimeoutError } from '@/shared/utils/axios.helper';

/**
 * Base API URL - can be overridden via environment variable
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with default configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

/**
 * Request interceptor - runs before every request
 */
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Get auth token from localStorage (or your auth store)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Add auth token to headers if available and not skipped
  const customConfig = config as CustomAxiosRequestConfig;
  if (token && !customConfig.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add any custom headers here
  // config.headers['X-Custom-Header'] = 'value';
  
  return config;
};

/**
 * Response interceptor - runs after every response
 */
const responseInterceptor = (response: AxiosResponse<ApiResponse>) => {
  // You can transform the response here if needed
  return response;
};

/**
 * Error interceptor - handles errors globally
 */
const errorInterceptor = (error: unknown) => {
  // Type guard to check if it's an axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as import('@/shared/types/axios.definitions').AxiosErrorResponse;
    const customConfig = axiosError.config as CustomAxiosRequestConfig;
    
    // Skip error handling if explicitly requested
    if (customConfig?.skipErrorHandling) {
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (isNetworkError(axiosError)) {
      console.error('Network Error: Please check your internet connection');
      // You can show a toast notification here
      return Promise.reject(new Error('Network Error: Please check your internet connection'));
    }
    
    // Handle timeout errors
    if (isTimeoutError(axiosError)) {
      console.error('Request Timeout: The request took too long to complete');
      // You can show a toast notification here
      return Promise.reject(new Error('Request Timeout: The request took too long to complete'));
    }
    
    // Handle HTTP errors
    if (axiosError.response) {
      const errorMessage = getErrorMessage(axiosError);
      const status = axiosError.response.status;
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            // window.location.href = '/login';
          }
          console.error('Unauthorized: Please login again');
          break;
        case 403:
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          console.error('Not Found: The requested resource was not found');
          break;
        case 500:
          console.error('Server Error: Something went wrong on the server');
          break;
        default:
          console.error(`Error ${status}: ${errorMessage}`);
      }
      
      return Promise.reject(new Error(errorMessage));
    }
  }
  
  // Handle non-axios errors
  console.error('Unexpected Error:', error);
  return Promise.reject(error);
};

// Apply interceptors
axiosInstance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);

/**
 * Configure request interceptor
 * @param config - Interceptor configuration
 */
export function configureRequestInterceptor(config: RequestInterceptorConfig): void {
  if (config.onFulfilled) {
    axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const result = config.onFulfilled!(requestConfig as CustomAxiosRequestConfig);
        // Ensure we return InternalAxiosRequestConfig
        return result as InternalAxiosRequestConfig;
      },
      config.onRejected
    );
  }
}

/**
 * Configure response interceptor
 * @param config - Interceptor configuration
 */
export function configureResponseInterceptor(config: ResponseInterceptorConfig): void {
  if (config.onFulfilled || config.onRejected) {
    axiosInstance.interceptors.response.use(
      config.onFulfilled,
      config.onRejected
    );
  }
}

/**
 * Set authentication token
 * @param token - Authentication token
 */
export function setAuthToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
      // Also set cookie for middleware
      document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
    } else {
      localStorage.removeItem('token');
      // Remove cookie
      document.cookie = 'accessToken=; path=/; max-age=0';
    }
  }
}

/**
 * Get authentication token
 * @returns Authentication token or null
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Update base URL
 * @param url - New base URL
 */
export function setBaseURL(url: string): void {
  axiosInstance.defaults.baseURL = url;
}

// Export the configured axios instance
export default axiosInstance;

// Export axios for direct use if needed
export { axios };

