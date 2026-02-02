import { API_BASE_URL, AUTH_TOKEN_KEY } from './constants';

/**
 * Backend API Response Format
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
  code?: string;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Make properties enumerable for proper logging
    Object.defineProperty(this, 'statusCode', { enumerable: true });
    Object.defineProperty(this, 'code', { enumerable: true });
    Object.defineProperty(this, 'details', { enumerable: true });
  }
}

// Get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Handle API response and extract data
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json();
    
    if (!response.ok) {
      // Extract detailed error message from validation errors
      let errorMessage = json.message || 'Request failed';
      
      // Handle rate limiting
      if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }
      // If there are validation details, format them into a readable message
      else if (json.details && typeof json.details === 'object') {
        const detailMessages = Object.entries(json.details)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        errorMessage = detailMessages || errorMessage;
      }
      
      throw new ApiError(
        errorMessage,
        response.status,
        json.code,
        json.details
      );
    }
    
    // For paginated responses, return entire response with data + pagination
    if (json.pagination) {
      return json as T;
    }
    
    // Extract data from backend response format
    return json.data !== undefined ? json.data : json;
  }
  
  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  }
  
  return response.json();
}

// API Client with auth headers
export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build query string from params
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';

    const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
      method: 'GET',
      headers,
      cache: 'no-store', // Ensure fresh data
    });

    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return handleResponse<T>(response);
  },
};
