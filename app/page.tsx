"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const allProducts = [
    {
      title: "Mahindra 575 DI",
      description: "Reliable tractor for everyday farming needs.",
      images: [
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        "https://images.unsplash.com/photo-1589889527408-2e6f10cb3c28?w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
      ],
      year: 2020,
    },
    {
      title: "Swaraj 744 FE",
      description: "Fuel efficient and powerful performance.",
      images: [
        "https://images.unsplash.com/photo-1589889527408-2e6f10cb3c28?w=800&q=80",
        "https://images.unsplash.com/photo-1530267981375-f0c84e630aa3?w=800&q=80"
      ],
      year: 2019,
    },
    {
      title: "John Deere 5310",
      description: "Advanced features with smooth driving experience.",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        "https://images.unsplash.com/photo-1596406473219-d27c86284c37?w=800&q=80",
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80",
        "https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=800&q=80"
      ],
      year: 2021,
    },
    {
      title: "Massey Ferguson 5610",
      description: "Powerful engine with excellent fuel economy.",
      images: [
        "https://images.unsplash.com/photo-1530267981375-f0c84e630aa3?w=800&q=80",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
      ],
      year: 2018,
    },
    {
      title: "New Holland 3630",
      description: "Perfect for small to medium farms.",
      images: [
        "https://images.unsplash.com/photo-1596406473219-d27c86284c37?w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        "https://images.unsplash.com/photo-1589889527408-2e6f10cb3c28?w=800&q=80"
      ],
      year: 2022,
    },
    {
      title: "Kubota L3901",
      description: "Compact yet powerful for versatile tasks.",
      images: [
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80"
      ],
      year: 2020,
    },
    {
      title: "Case IH Farmall 75C",
      description: "Advanced hydraulics and comfortable cabin.",
      images: [
        "https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=800&q=80",
        "https://images.unsplash.com/photo-1530267981375-f0c84e630aa3?w=800&q=80",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
      ],
      year: 2019,
    },
    {
      title: "Sonalika DI 745 III",
      description: "Robust build with modern features.",
      images: [
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        "https://images.unsplash.com/photo-1596406473219-d27c86284c37?w=800&q=80"
      ],
      year: 2021,
    },
    {
      title: "Farmtrac 60 Classic",
      description: "Economical choice for regular farming.",
      images: [
        "https://images.unsplash.com/photo-1589889527408-2e6f10cb3c28?w=800&q=80",
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80",
        "https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=800&q=80"
      ],
      year: 2023,
    },
    {
      title: "Eicher 380",
      description: "Trusted brand with great resale value.",
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        "https://images.unsplash.com/photo-1589889527408-2e6f10cb3c28?w=800&q=80"
      ],
      year: 2022,
    },
    {
      title: "Mahindra Arjun 605",
      description: "High performance for intensive farming.",
      images: [
        "https://images.unsplash.com/photo-1530267981375-f0c84e630aa3?w=800&q=80",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
      ],
      year: 2020,
    },
    {
      title: "Swaraj 855 FE",
      description: "Fuel efficient with low maintenance.",
      images: [
        "https://images.unsplash.com/photo-1596406473219-d27c86284c37?w=800&q=80",
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80"
      ],
      year: 2021,
    },
    {
      title: "John Deere 5405",
      description: "Premium features and reliability.",
      images: [
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80",
        "https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=800&q=80",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        "https://images.unsplash.com/photo-1589889527408-2e6f10cb3c28?w=800&q=80"
      ],
      year: 2019,
    },
    {
      title: "New Holland TD5.110",
      description: "Power-packed performance for large fields.",
      images: [
        "https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=800&q=80",
        "https://images.unsplash.com/photo-1530267981375-f0c84e630aa3?w=800&q=80"
      ],
      year: 2023,
    },
    {
      title: "Massey Ferguson 1035",
      description: "Versatile tractor for multiple applications.",
      images: [
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        "https://images.unsplash.com/photo-1596406473219-d27c86284c37?w=800&q=80"
      ],
      year: 2022,
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {currentProducts.map((product, index) => (
            <ProductCard
              key={`${currentPage}-${index}`}
              title={product.title}
              description={product.description}
              images={product.images}
              year={product.year}
            />
          ))}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Results Info */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, allProducts.length)} of {allProducts.length} tractors
        </div>
      </main>

      <Footer />
    </>
  );
}