"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { FaBox, FaCheckCircle, FaTimesCircle, FaPlus, FaClock } from 'react-icons/fa';
import { useProducts } from '@/contexts/ProductsContext';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminDashboard() {
  const { stats, products, fetchProducts, fetchStats, isLoading, error } = useProducts();
  const { t } = useI18n();
  
  // Fetch products and stats on mount
  useEffect(() => {
    fetchStats();
    fetchProducts({ limit: 5 }); // Fetch first 5 products for recent list
  }, []);

  // Get recent products (first 5 from sorted list)
  const recentProducts = products.slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title={t('admin.dashboard')}
        subtitle={t('admin.dashboardPage.welcome')}
        className="mb-6"
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
        {/* Total Products */}
        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-blue-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                {isLoading ? '...' : stats.total}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">{t('admin.dashboardPage.total')}</h3>
          </CardContent>
        </Card>

        {/* Available */}
        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                {isLoading ? '...' : stats.available}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">{t('admin.dashboardPage.available')}</h3>
          </CardContent>
        </Card>

        {/* Sold */}
        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="text-orange-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                {isLoading ? '...' : stats.sold}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">{t('admin.dashboardPage.soldOut')}</h3>
          </CardContent>
        </Card>

        {/* Recently Added */}
        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-purple-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                {isLoading ? '...' : (stats.recent || 0)}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">{t('admin.dashboardPage.recent')}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('admin.dashboardPage.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 sm:px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
            >
              <FaPlus />
              {t('admin.dashboardPage.addNew')}
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-center gap-2 bg-white text-gray-700 px-3 sm:px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base border-2 border-gray-300 hover:border-green-600 hover:text-green-600 transition-all"
            >
              <FaBox />
              {t('admin.dashboardPage.viewAll')}
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboardPage.recentProducts')}</CardTitle>
        </CardHeader>
        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {recentProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              {t('admin.dashboardPage.table.empty')}
            </div>
          ) : (
            recentProducts.map((product) => (
              <Card key={product.id} className="rounded-xl">
                <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{product.title}</p>
                    <p className="text-xs text-gray-500">{t('admin.dashboardPage.table.year')}: {product.year}</p>
                  </div>
                    <StatusBadge
                      status={product.status}
                      label={product.status === 'available'
                        ? t('admin.dashboardPage.table.available')
                        : t('admin.dashboardPage.table.sold')}
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {t('admin.dashboardPage.table.dateAdded')}: {new Date(product.createdAt).toLocaleDateString()}
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
                  {t('admin.dashboardPage.table.product')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.dashboardPage.table.year')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.dashboardPage.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('admin.dashboardPage.table.dateAdded')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {t('admin.dashboardPage.table.empty')}
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {product.title}
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
                        {product.status === 'available'
                          ? t('admin.dashboardPage.table.available')
                          : t('admin.dashboardPage.table.sold')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
