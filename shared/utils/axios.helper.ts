import type { AxiosErrorResponse, ApiErrorResponse } from '@/shared/types/axios.definitions';

/**
 * Extracts error message from axios error response
 * @param error - Axios error object
 * @returns Formatted error message string
 */
export function getErrorMessage(error: AxiosErrorResponse): string {
  if (error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;
    
    // Return custom error message if available
    if (errorData.message) {
      return errorData.message;
    }
    
    // Return error field if available
    if (errorData.error) {
      return errorData.error;
    }
    
    // Handle validation errors
    if (errorData.errors) {
      const errorMessages = Object.values(errorData.errors).flat();
      return errorMessages.join(', ');
    }
  }
  
  // Fallback to axios error message
  if (error.message) {
    return error.message;
  }
  
  // Default error message
  return 'An unexpected error occurred';
}

/**
 * Checks if error is a network error (no response received)
 * @param error - Axios error object
 * @returns True if network error, false otherwise
 */
export function isNetworkError(error: AxiosErrorResponse): boolean {
  return !error.response && error.request;
}

/**
 * Checks if error is a timeout error
 * @param error - Axios error object
 * @returns True if timeout error, false otherwise
 */
export function isTimeoutError(error: AxiosErrorResponse): boolean {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
}

/**
 * Gets HTTP status code from error
 * @param error - Axios error object
 * @returns Status code or null if not available
 */
export function getErrorStatus(error: AxiosErrorResponse): number | null {
  return error.response?.status ?? null;
}

/**
 * Checks if error status is in the 4xx range (client errors)
 * @param error - Axios error object
 * @returns True if client error, false otherwise
 */
export function isClientError(error: AxiosErrorResponse): boolean {
  const status = getErrorStatus(error);
  return status !== null && status >= 400 && status < 500;
}

/**
 * Checks if error status is in the 5xx range (server errors)
 * @param error - Axios error object
 * @returns True if server error, false otherwise
 */
export function isServerError(error: AxiosErrorResponse): boolean {
  const status = getErrorStatus(error);
  return status !== null && status >= 500 && status < 600;
}

