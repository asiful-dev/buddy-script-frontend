import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Custom API response structure
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
  error?: string;
}

/**
 * Extended Axios request config with custom properties
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean; // Skip adding auth token to request
  skipErrorHandling?: boolean; // Skip global error handling
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Type guard to check if error is an Axios error
 */
export type AxiosErrorResponse = AxiosError<ApiErrorResponse>;

/**
 * Request interceptor config
 */
export interface RequestInterceptorConfig {
  onFulfilled?: (config: CustomAxiosRequestConfig) => CustomAxiosRequestConfig | Promise<CustomAxiosRequestConfig>;
  onRejected?: (error: unknown) => unknown;
}

/**
 * Response interceptor config
 */
export interface ResponseInterceptorConfig {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: AxiosErrorResponse) => unknown;
}

