// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  year: number;
  price?: number;
  status: 'available' | 'sold';
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  images: string[];
  year: number;
  price?: number;
  status: 'available' | 'sold';
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
