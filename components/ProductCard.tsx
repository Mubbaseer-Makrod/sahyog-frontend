"use client";

import { useState } from "react";
import Image from "next/image";
import { FaWhatsapp, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getWhatsAppLink, contactConfig } from "@/config/contact";

type ProductCardProps = {
  title: string;
  description: string;
  images: string[]; // Changed from single image to array
  year: number;
};

export function ProductCard({
  title,
  description,
  images,
  year,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[400px] group">
      {/* Image Carousel */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Next image"
            >
              <FaChevronRight size={16} />
            </button>
          </>
        )}
        
        {/* Image Indicators - Only show if more than 1 image */}
        {images.length > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white w-8 shadow-md' 
                    : 'bg-white/60 hover:bg-white/90 w-2'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Year Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-green-200 z-10">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-green-600" size={14} />
            <span className="text-xs font-bold text-gray-800">{year}</span>
          </div>
        </div>

        {/* WhatsApp Icon Button - Bottom Right */}
        <a
          href={getWhatsAppLink(contactConfig.whatsappMessages.productEnquiry(`${title} (${year})`))}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-green-600 text-white p-2.5 rounded-full hover:bg-green-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
          aria-label="Enquire on WhatsApp"
        >
          <FaWhatsapp size={20} />
        </a>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 z-10">
        {/* Title with accent */}
        <div className="border-l-4 border-white/80 pl-3">
          <h3 className="text-base font-bold text-white leading-tight drop-shadow-lg">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-white/95 leading-snug line-clamp-2 drop-shadow-md">
          {description}
        </p>
      </div>
    </div>
  );
}