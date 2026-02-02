// API Base URL - Update this when backend is ready
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Local Storage Keys
export const AUTH_TOKEN_KEY = 'sahyog_admin_token';
export const USER_DATA_KEY = 'sahyog_admin_user';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  
  // Products (Admin)
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_BY_ID: (id: string) => `/admin/products/${id}`,
  ADMIN_PRODUCT_STATUS: (id: string) => `/admin/products/${id}/status`,
  
  // Products (Public)
  PUBLIC_PRODUCTS: '/products',
  PUBLIC_PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  
  // Upload
  UPLOAD_IMAGE: '/admin/upload',
  DELETE_IMAGE: (id: string) => `/admin/upload/${id}`,
};

// Product Status
export const PRODUCT_STATUS = {
  AVAILABLE: 'available' as const,
  SOLD: 'sold' as const,
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const ADMIN_PAGE_SIZE = 20;
