"use client";

import Image from "next/image";
import { FaWhatsapp, FaCalendarAlt } from "react-icons/fa";
import { getWhatsAppLink, contactConfig } from "@/config/contact";

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  year: number;
};

export function ProductCard({
  title,
  description,
  image,
  year,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
      {/* Image with overlay gradient */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Year Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-green-200">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-green-600" size={14} />
            <span className="text-xs font-bold text-gray-800">{year}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex flex-col flex-grow">
        {/* Title with accent */}
        <div className="border-l-4 border-green-600 pl-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Year: {year}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed min-h-[40px] flex-grow">
          {description}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100"></div>

        {/* WhatsApp Button */}
        <a
          href={getWhatsAppLink(contactConfig.whatsappMessages.productEnquiry(`${title} (${year})`))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-green-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FaWhatsapp size={22} className="flex-shrink-0" />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}