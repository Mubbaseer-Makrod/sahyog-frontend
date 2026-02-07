"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import { useProducts } from "@/contexts/ProductsContext";
import { FaExclamationTriangle } from "react-icons/fa";
import { useI18n } from "@/contexts/I18nContext";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

export default function HomePage() {
  const { t } = useI18n();
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
          title={t('products.title')} 
          subtitle={t('products.subtitle')}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
            <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t('products.errorTitle')}</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingState label={t('products.loading')} className="py-20" />
        ) : publicProducts.length === 0 ? (
          <EmptyState
            title={t('products.emptyTitle')}
            description={t('products.emptySubtitle')}
            icon={<FaExclamationTriangle className="text-gray-400 text-3xl" />}
            className="py-20"
          />
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
                {t('products.showing', {
                  start: ((pagination.page - 1) * pagination.limit) + 1,
                  end: Math.min(pagination.page * pagination.limit, pagination.total),
                  total: pagination.total
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}