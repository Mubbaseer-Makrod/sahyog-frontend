"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import { useProducts } from "@/contexts/ProductsContext";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Match backend default
  
  // Get products from global context
  const { publicProducts, pagination, fetchPublicProducts, isLoading, error } = useProducts();

  // Fetch products on mount and when page changes
  useEffect(() => {
    fetchPublicProducts({ page: currentPage, limit: itemsPerPage });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <Hero />

      {/* Products Section */}
      <main id="products" className="px-4 py-12 sm:py-16 max-w-7xl mx-auto">
        <SectionHeader 
          title="Available Tractors" 
          subtitle="Browse our premium collection of tractors from top brands. Tap on any tractor to enquire instantly via WhatsApp."
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
            <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error loading products</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-green-600 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Loading tractors...</p>
            </div>
          </div>
        ) : publicProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FaExclamationTriangle className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-600 text-lg">No tractors available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
              {publicProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  description={product.description}
                  images={product.images}
                  year={product.year}
                />
              ))}
            </section>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Results Info */}
            {pagination && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tractors
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}