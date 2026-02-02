"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, ProductFormData } from '@/types';
import * as productService from '@/services/productService';
import { ProductStats, PaginatedProducts } from '@/services/productService';

/**
 * Products Context Type
 */
interface ProductsContextType {
  // State
  products: Product[];
  publicProducts: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  
  // Statistics
  stats: ProductStats;
  
  // Actions
  fetchProducts: (params?: { page?: number; limit?: number; status?: string; search?: string }) => Promise<void>;
  fetchPublicProducts: (params?: { page?: number; limit?: number }) => Promise<void>;
  fetchStats: () => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormData> & { newImages?: string[]; existingImages?: string[] }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string, status: 'available' | 'sold') => Promise<Product>;
  getProductById: (id: string) => Product | undefined;
  clearError: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

/**
 * Products Provider Component
 * 
 * Provides global product state management with real API integration.
 * All components can access and modify products through this context.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [publicProducts, setPublicProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    available: 0,
    sold: 0,
    recent: 0,
  });
  
  // Track last fetch params to maintain pagination state
  const [lastFetchParams, setLastFetchParams] = useState<{
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }>({});

  // Fetch product statistics
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await productService.fetchProductStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      // Don't show error to user for stats failure
    }
  }, []);

  // Fetch all products (for admin with pagination)
  const fetchProducts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use provided params or last fetch params (for refresh after CRUD)
      const fetchParams = params || lastFetchParams;
      
      const response: PaginatedProducts = await productService.fetchProducts(fetchParams);
      
      setProducts(response.products || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || 0,
      });
      
      // Save params for future refreshes
      if (params) {
        setLastFetchParams(fetchParams);
      }
      
      // Update stats if included in response
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchParams]);

  // Fetch public products (for homepage - only available)
  const fetchPublicProducts = useCallback(async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: PaginatedProducts = await productService.fetchPublicProducts(params);
      
      setPublicProducts(response.products || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 12,
        totalPages: response.totalPages || 0,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching public products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new product
  const createProduct = async (data: ProductFormData): Promise<Product> => {
    try {
      setError(null);
      const newProduct = await productService.createProduct(data);
      
      // Refresh products list and stats
      await fetchProducts();
      await fetchStats();
      
      return newProduct;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create product';
      setError(errorMessage);
      throw err; // Re-throw original error
    }
  };

  // Update existing product
  const updateProduct = async (
    id: string,
    data: Partial<ProductFormData> & {
      newImages?: string[];
      existingImages?: string[];
    }
  ): Promise<Product> => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(id, data);
      
      // Refresh products list
      await fetchProducts();
      await fetchStats();
      
      return updatedProduct;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update product';
      setError(errorMessage);
      throw err; // Re-throw original error
    }
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setError(null);
      await productService.deleteProduct(id);
      
      // Refresh products list and stats
      await fetchProducts();
      await fetchStats();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete product';
      setError(errorMessage);
      throw err; // Re-throw original error
    }
  };

  // Toggle product status
  const toggleProductStatus = async (id: string, status: 'available' | 'sold'): Promise<Product> => {
    try {
      setError(null);
      const updatedProduct = await productService.toggleProductStatus(id, status);
      
      // Refresh products list and stats
      await fetchProducts();
      await fetchStats();
      
      return updatedProduct;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to toggle product status';
      setError(errorMessage);
      throw err; // Re-throw the original error to preserve error details
    }
  };

  // Get product by ID from current state
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id) || publicProducts.find(p => p.id === id);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: ProductsContextType = {
    products,
    publicProducts,
    isLoading,
    error,
    pagination,
    stats,
    fetchProducts,
    fetchPublicProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getProductById,
    clearError,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

/**
 * Hook to use Products Context
 */
export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
