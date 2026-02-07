"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useI18n } from "@/contexts/I18nContext";

type ImageLightboxProps = {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ImageLightboxProps) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && images.length > 1) prevImage();
    if (e.key === 'ArrowRight' && images.length > 1) nextImage();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 z-50 backdrop-blur-md"
        aria-label={t('lightbox.close')}
      >
        <FaTimes size={24} />
      </button>

      {/* Title */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full z-50">
        <h3 className="text-white font-bold text-sm sm:text-base">{title}</h3>
      </div>

      {/* Image Container */}
      <div 
        className="flex items-center justify-center w-full h-full p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt={`${title} - ${t('lightbox.goTo', { index: currentIndex + 1 })}`}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-md z-50"
            aria-label={t('lightbox.previous')}
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-md z-50"
            aria-label={t('lightbox.next')}
          >
            <FaChevronRight size={24} />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50">
        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="flex gap-2 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-10 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/80 w-2.5'
                }`}
                aria-label={t('lightbox.goTo', { index: index + 1 })}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="bg-black/60 backdrop-blur-md px-5 py-2 rounded-full">
            <span className="text-white text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Swipe Hint for Mobile */}
      {images.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full sm:hidden animate-pulse">
          <span className="text-white/80 text-xs">{t('lightbox.swipe')}</span>
        </div>
      )}
    </div>
  );
}
