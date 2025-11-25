import type { AxiosErrorResponse, ApiErrorResponse } from '@/shared/types/axios.definitions';

/**
 * Extracts error message from axios error response
 * @param error - Axios error object
 * @returns Human-friendly error message string
 */
export function getErrorMessage(error: AxiosErrorResponse): string {
  const status = error.response?.status;
  
  // Handle specific status codes with friendly messages
  if (status === 413) {
    return 'The file you\'re trying to upload is too large. Please choose a smaller image.';
  }
  
  if (status === 415) {
    return 'The file type is not supported. Please upload an image file (JPG, PNG, GIF, etc.).';
  }
  
  if (status === 400) {
    // Check for specific validation errors
    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorResponse;
      
      // Handle validation errors
      if (errorData.errors) {
        const errorMessages = Object.values(errorData.errors).flat();
        return `Please check your input: ${errorMessages.join(', ')}`;
      }
      
      if (errorData.message) {
        // Make common backend messages more user-friendly
        const message = errorData.message.toLowerCase();
        if (message.includes('image') || message.includes('file')) {
          return 'There was an issue with the image. Please try a different file or check if it\'s a valid image.';
        }
        if (message.includes('size') || message.includes('large')) {
          return 'The image file is too large. Please choose a smaller file (max 5MB recommended).';
        }
        if (message.includes('format') || message.includes('type')) {
          return 'Invalid image format. Please use JPG, PNG, or GIF.';
        }
        return errorData.message;
      }
      
      if (errorData.error) {
        return errorData.error;
      }
    }
    return 'Invalid request. Please check your input and try again.';
  }
  
  if (status === 500) {
    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorResponse;
      if (errorData.message && errorData.message.toLowerCase().includes('image')) {
        return 'There was a problem processing your image. Please try again with a different file.';
      }
      return 'Oops! Something went wrong on our end. Please try again in a moment.';
    }
    return 'Server error occurred. Please try again later.';
  }
  
  // Generic error handling
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
      return `Validation error: ${errorMessages.join(', ')}`;
    }
  }
  
  // Network-related errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  if (!error.response && error.request) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Fallback to axios error message (make it friendlier)
  if (error.message) {
    // Make technical messages more user-friendly
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection.';
    }
    return `Error: ${error.message}`;
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again.';
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


