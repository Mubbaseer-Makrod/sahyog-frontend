"use client";

import React from "react";
import Link from "next/link";
import { 
  FaWhatsapp, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 mt-20 relative z-10">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-5">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="text-green-600">Sahyog</span>
              <span className="text-gray-800">Farm</span>
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted partner for quality tractors and farm equipment. 
              Empowering farmers with reliable machinery since 2020.
            </p>
            <div className="flex gap-4 mt-6">
              <a 
                href="#" 
                className="bg-white border-2 border-gray-200 p-3 rounded-full hover:bg-green-600 hover:text-white hover:border-green-600 text-gray-600 transition-all duration-300 transform hover:scale-110 shadow-sm" 
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="#" 
                className="bg-white border-2 border-gray-200 p-3 rounded-full hover:bg-green-600 hover:text-white hover:border-green-600 text-gray-600 transition-all duration-300 transform hover:scale-110 shadow-sm" 
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="#" 
                className="bg-white border-2 border-gray-200 p-3 rounded-full hover:bg-green-600 hover:text-white hover:border-green-600 text-gray-600 transition-all duration-300 transform hover:scale-110 shadow-sm" 
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-600 mb-4 pb-3 border-b-2 border-gray-200">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-600 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/catalog" 
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-600 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Our Catalog</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-600 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-600 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Services</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-600 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-600 mb-4 pb-3 border-b-2 border-gray-200">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-green-600 mt-1 flex-shrink-0" size={18} />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=123+Farm+Road+Agriculture+District+Your+City+State+123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors hover:underline leading-relaxed cursor-pointer"
                >
                  123 Farm Road, Agriculture District,<br />Your City, State 123456
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaPhone className="text-green-600 flex-shrink-0" size={18} />
                <a 
                  href="tel:+91XXXXXXXXXX" 
                  className="text-gray-600 hover:text-green-600 transition-colors hover:underline"
                >
                  +91 XXXX-XXX-XXX
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-green-600 flex-shrink-0" size={18} />
                <a 
                  href="mailto:info@sahyogfarm.com" 
                  className="text-gray-600 hover:text-green-600 transition-colors hover:underline"
                >
                  info@sahyogfarm.com
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-600 mb-4 pb-3 border-b-2 border-gray-200">
              Get in Touch
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Have questions? Chat with us directly on WhatsApp for instant support!
            </p>
            <a
              href="https://wa.me/91XXXXXXXXXX?text=Hello%20I%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <FaWhatsapp size={24} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} SahyogFarm. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}