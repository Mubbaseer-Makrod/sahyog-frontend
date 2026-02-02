import { AUTH_TOKEN_KEY, USER_DATA_KEY, API_ENDPOINTS } from './constants';
import { apiClient, ApiError } from './api';
import { User } from '@/types';

/**
 * Login Response from backend
 */
interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Login Credentials
 */
interface LoginCredentials {
  email: string;
  password: string;
}

// Token management
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// User data management
export const setUserData = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
};

export const getUserData = (): User | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const removeUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_DATA_KEY);
  }
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeAuthToken();
  removeUserData();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Login user
 * Calls backend API and stores token + user data
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
    
    // Store token and user data
    setAuthToken(response.token);
    setUserData(response.user);
    
    return response.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Login failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

/**
 * Logout user
 * Calls backend API and clears local storage
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    // Ignore errors on logout, just clear local data
    console.error('Logout error:', error);
  } finally {
    // Always clear local auth data
    clearAuthData();
  }
};

/**
 * Get current user from backend
 * Validates token and fetches fresh user data
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!isAuthenticated()) {
      return null;
    }
    
    const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.ME);
    
    // Update user data in localStorage
    setUserData(response.user);
    
    return response.user;
  } catch (error) {
    // If token is invalid, clear auth data
    clearAuthData();
    return null;
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.REFRESH);
    
    setAuthToken(response.token);
    setUserData(response.user);
    
    return response.token;
  } catch (error) {
    clearAuthData();
    return null;
  }
};
