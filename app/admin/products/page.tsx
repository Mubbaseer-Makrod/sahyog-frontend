"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSpinner } from 'react-icons/fa';
import { useProducts } from '@/contexts/ProductsContext';
import { useToast } from '@/contexts/ToastContext';
import Pagination from '@/components/Pagination';

export default function ProductsListPage() {
  const { products, pagination, fetchProducts, isLoading, deleteProduct, toggleProductStatus } = useProducts();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 products per page

  // Fetch products when page or filters change
  useEffect(() => {
    const params: any = { 
      page: currentPage, 
      limit: itemsPerPage 
    };
    
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    fetchProducts(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, searchQuery]); // fetchProducts is stable from useCallback

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleStatusFilterChange = (status: 'all' | 'available' | 'sold') => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  const handleToggleStatus = async (id: string, currentStatus: 'available' | 'sold') => {
    try {
      setActionLoading(id);
      const newStatus = currentStatus === 'available' ? 'sold' : 'available';
      await toggleProductStatus(id, newStatus);
      toast.success(
        `Product marked as ${newStatus === 'available' ? 'available' : 'sold'}`
      );
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error(error.message || 'Failed to toggle status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      setActionLoading(id);
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">{/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
        >
          <FaPlus />
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusFilterChange('all')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilterChange('available')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                statusFilter === 'available'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => handleStatusFilterChange('sold')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                statusFilter === 'sold'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sold
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FaSpinner className="animate-spin text-green-600 text-3xl mx-auto mb-2" />
                    <p className="text-gray-500">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No products found matching your filters.' 
                      : 'No products yet. Create your first product!'}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{product.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {product.status === 'available' ? 'Available' : 'Sold'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-800">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(product.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          disabled={actionLoading === product.id}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50"
                          title="Toggle Status"
                        >
                          {actionLoading === product.id ? (
                            <FaSpinner className="animate-spin" size={16} />
                          ) : product.status === 'available' ? (
                            <FaToggleOn size={16} />
                          ) : (
                            <FaToggleOff size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          disabled={actionLoading === product.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {actionLoading === product.id ? (
                            <FaSpinner className="animate-spin" size={16} />
                          ) : (
                            <FaTrash size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination 
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Results Count */}
      {!isLoading && pagination && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTrash className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  પ્રોડક્ટ ડિલીટ કરો?
                </h3>
                <p className="text-gray-600">
                  શું તમે ખરેખર આ પ્રોડક્ટ ડિલીટ કરવા માંગો છો? આ ક્રિયા પાછી ફેરવી શકાશે નહીં.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={!!actionLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                રદ કરો
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                disabled={!!actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirm ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    <span>ડિલીટ થઈ રહ્યું છે...</span>
                  </>
                ) : (
                  'હા, ડિલીટ કરો'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
