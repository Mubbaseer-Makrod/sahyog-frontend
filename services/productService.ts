import { Product, ProductFormData } from '@/types';
import { apiClient, ApiError } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

/**
 * Transform MongoDB product (_id) to frontend Product (id)
 */
const transformProduct = (product: any): Product => ({
  ...product,
  id: product._id || product.id,
});

/**
 * Product Service Layer
 * 
 * This is the API abstraction layer. All components should call these functions.
 * All functions now make real API calls to the backend.
 * Components don't need any changes since the interface remains the same.
 */

/**
 * Product Statistics
 */
export interface ProductStats {
  total: number;
  available: number;
  sold: number;
  recent?: number;
}

/**
 * Paginated Response
 */
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: ProductStats;
}

/**
 * Fetch product statistics
 */
export const fetchProductStats = async (): Promise<ProductStats> => {
  try {
    const response = await apiClient.get<{ stats: ProductStats }>(API_ENDPOINTS.ADMIN_PRODUCTS_STATS);
    return response.stats;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    throw error;
  }
};

/**
 * Fetch all products (admin - with pagination and filters)
 */
export const fetchProducts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<PaginatedProducts> => {
  try {
    // Backend returns { data: Product[], pagination: {...} }
    const response = await apiClient.get<any>(API_ENDPOINTS.ADMIN_PRODUCTS, params);
    
    const rawProducts = response.data || response.products || [];
    const products = rawProducts.map(transformProduct);
    
    return {
      products,
      total: response.pagination?.total || 0,
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 20,
      totalPages: response.pagination?.totalPages || 0,
      stats: response.stats,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch products for public display (only available status, with pagination)
 */
export const fetchPublicProducts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedProducts> => {
  try {
    // Backend returns { data: Product[], pagination: {...} }
    const response = await apiClient.get<any>(API_ENDPOINTS.PUBLIC_PRODUCTS, params);
    
    const rawProducts = response.data || response.products || [];
    const products = rawProducts.map(transformProduct);
    
    return {
      products,
      total: response.pagination?.total || 0,
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 12,
      totalPages: response.pagination?.totalPages || 0,
    };
  } catch (error) {
    console.error('Error fetching public products:', error);
    throw error;
  }
};

/**
 * Fetch single product by ID (public)
 */
export const fetchPublicProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get<{ product: any }>(API_ENDPOINTS.PUBLIC_PRODUCT_BY_ID(id));
    return transformProduct(response.product);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Fetch single product by ID (admin)
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get<{ product: any }>(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id));
    return transformProduct(response.product);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Create new product
 */
export const createProduct = async (data: ProductFormData): Promise<Product> => {
  try {
    const response = await apiClient.post<{ product: any }>(API_ENDPOINTS.ADMIN_PRODUCTS, data);
    return transformProduct(response.product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (id: string, data: Partial<ProductFormData> & {
  newImages?: string[];
  existingImages?: string[];
}): Promise<Product> => {
  try {
    const response = await apiClient.put<{ product: any }>(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id), data);
    return transformProduct(response.product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Toggle product status (available <-> sold)
 */
export const toggleProductStatus = async (id: string, status: 'available' | 'sold'): Promise<Product> => {
  try {
    const response = await apiClient.patch<{ product: any }>(
      API_ENDPOINTS.ADMIN_PRODUCT_STATUS(id),
      { status }
    );
    return transformProduct(response.product);
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
};

/**
 * Delete product (soft delete)
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
