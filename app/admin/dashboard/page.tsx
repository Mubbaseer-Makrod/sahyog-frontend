"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { FaBox, FaCheckCircle, FaTimesCircle, FaPlus, FaClock } from 'react-icons/fa';
import { useProducts } from '@/contexts/ProductsContext';

export default function AdminDashboard() {
  const { stats, products, fetchProducts, fetchStats, isLoading, error } = useProducts();
  
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBox className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.total}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Products</h3>
        </div>

        {/* Available */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.available}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Available</h3>
        </div>

        {/* Sold */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaTimesCircle className="text-orange-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.sold}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Sold Out</h3>
        </div>

        {/* Recently Added */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-purple-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : (stats.recent || 0)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Recent (7 days)</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
          >
            <FaPlus />
            Add New Product
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-green-600 hover:text-green-600 transition-all"
          >
            <FaBox />
            View All Products
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
        </div>
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
                  Date Added
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No recent products
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
                        {product.status === 'available' ? 'Available' : 'Sold'}
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
      </div>
    </div>
  );
}
