import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
};

export default function SectionHeader({ 
  title, 
  subtitle, 
  alignment = "left" 
}: SectionHeaderProps) {
  const centerClass = alignment === "center" ? "mx-auto text-center" : "";
  
  return (
    <div className={`mb-12 ${centerClass}`}>
      {/* Top decorative line and badge */}
      <div className={`flex items-center gap-4 mb-6 ${alignment === "center" ? "justify-center" : ""}`}>
        <div className="h-[2px] w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-100 blur-sm rounded-full"></div>
          <span className="relative px-4 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-full text-green-700 font-bold text-xs uppercase tracking-widest shadow-sm">
            Featured Collection
          </span>
        </div>
        <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
        <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>

      {/* Subtitle with icon */}
      {subtitle && (
        <div className={`flex items-start gap-3 ${alignment === "center" ? "justify-center" : ""}`}>
          <div className="mt-1 flex-shrink-0">
            <svg 
              className="w-5 h-5 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <p className={`text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl ${alignment === "center" ? "text-center" : ""}`}>
            {subtitle}
          </p>
        </div>
      )}

      {/* Bottom decorative border */}
      <div className={`mt-8 flex items-center gap-2 ${alignment === "center" ? "justify-center" : ""}`}>
        <div className="h-1 w-8 bg-green-600 rounded-full"></div>
        <div className="h-1 w-16 bg-green-500 rounded-full"></div>
        <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
      </div>
    </div>
  );
}