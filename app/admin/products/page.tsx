"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useProducts } from '@/contexts/ProductsContext';
import { useToast } from '@/contexts/ToastContext';
import Pagination from '@/components/Pagination';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ProductsListPage() {
  const { products, pagination, fetchProducts, isLoading, deleteProduct, toggleProductStatus } = useProducts();
  const toast = useToast();
  const { t } = useI18n();
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
        t('admin.productsPage.toast.status', {
          status: newStatus === 'available'
            ? t('admin.productsPage.table.available')
            : t('admin.productsPage.table.sold')
        })
      );
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error(error.message || t('admin.productsPage.toast.toggleFail'));
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
      toast.success(t('admin.productsPage.toast.deleted'));
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || t('admin.productsPage.toast.deleteFail'));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">{/* Header */}
      <PageHeader
        title={t('admin.productsPage.title')}
        subtitle={t('admin.productsPage.subtitle')}
        actions={(
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <FaPlus />
            {t('admin.dashboardPage.addNew')}
          </Link>
        )}
        className="mb-6"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.productsPage.search')}
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
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.productsPage.filters.all')}
            </button>
            <button
              onClick={() => handleStatusFilterChange('available')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.productsPage.filters.available')}
            </button>
            <button
              onClick={() => handleStatusFilterChange('sold')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                statusFilter === 'sold'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.productsPage.filters.sold')}
            </button>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {isLoading ? (
            <LoadingState label={t('admin.productsPage.table.loading')} />
          ) : products.length === 0 ? (
            <EmptyState
              title={searchQuery || statusFilter !== 'all'
                ? t('admin.productsPage.table.emptyFiltered')
                : t('admin.productsPage.table.empty')}
              icon={<FaExclamationTriangle className="text-gray-400 text-2xl" />}
            />
          ) : (
            products.map((product) => (
              <Card key={product.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{product.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    <StatusBadge
                      status={product.status}
                      label={product.status === 'available'
                        ? t('admin.productsPage.table.available')
                        : t('admin.productsPage.table.sold')}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="block text-[10px] uppercase tracking-wide text-gray-500">
                        {t('admin.productsPage.table.year')}
                      </span>
                      <span className="font-semibold text-gray-700">{product.year}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="block text-[10px] uppercase tracking-wide text-gray-500">
                        {t('admin.productsPage.table.images')}
                      </span>
                      <span className="font-semibold text-gray-700">{product.images.length}</span>
                    </div>
                    <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="block text-[10px] uppercase tracking-wide text-gray-500">
                        {t('admin.productsPage.table.created')}
                      </span>
                      <span className="font-semibold text-gray-700">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all text-xs font-semibold"
                      title={t('admin.productsPage.table.edit')}
                    >
                      <FaEdit size={12} />
                      {t('admin.productsPage.table.edit')}
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      disabled={actionLoading === product.id}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all text-xs font-semibold disabled:opacity-50"
                      title={t('admin.productsPage.table.status')}
                    >
                      {actionLoading === product.id ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaToggleOn size={12} />
                      )}
                      {t('admin.productsPage.table.status')}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      disabled={actionLoading === product.id}
                      className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-all text-xs font-semibold disabled:opacity-50"
                      title={t('admin.productsPage.table.delete')}
                    >
                      {actionLoading === product.id ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaTrash size={12} />
                      )}
                      {t('admin.productsPage.table.delete')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.productsPage.table.product')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.productsPage.table.year')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.productsPage.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.productsPage.table.created')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.productsPage.table.images')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.productsPage.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FaSpinner className="animate-spin text-green-600 text-3xl mx-auto mb-2" />
                    <p className="text-gray-500">{t('admin.productsPage.table.loading')}</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || statusFilter !== 'all' 
                      ? t('admin.productsPage.table.emptyFiltered')
                      : t('admin.productsPage.table.empty')}
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
                      <StatusBadge
                        status={product.status}
                        label={product.status === 'available'
                          ? t('admin.productsPage.table.available')
                          : t('admin.productsPage.table.sold')}
                      />
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
                      {product.images.length} {product.images.length === 1 ? t('admin.productsPage.table.imageSingle') : t('admin.productsPage.table.imagePlural')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title={t('admin.productsPage.table.edit')}
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          disabled={actionLoading === product.id}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50"
                          title={t('admin.productsPage.table.status')}
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
                          title={t('admin.productsPage.table.delete')}
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
      </Card>

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
          {t('admin.productsPage.showing', {
            start: ((pagination.page - 1) * pagination.limit) + 1,
            end: Math.min(pagination.page * pagination.limit, pagination.total),
            total: pagination.total
          })}
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
                  {t('admin.productsPage.deleteModal.title')}
                </h3>
                <p className="text-gray-600">
                  {t('admin.productsPage.deleteModal.description')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={!!actionLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {t('admin.productsPage.deleteModal.cancel')}
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                disabled={!!actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirm ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    <span>{t('admin.productsPage.deleteModal.deleting')}</span>
                  </>
                ) : (
                  t('admin.productsPage.deleteModal.confirm')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
