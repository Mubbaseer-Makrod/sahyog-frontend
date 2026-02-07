"use client";

import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";
import { contactConfig, getWhatsAppLink } from "@/config/contact";
import { useI18n } from "@/contexts/I18nContext";

export default function Footer() {
  const { t } = useI18n();
  const fullAddress = `${contactConfig.address.street}, ${contactConfig.address.city}, ${contactConfig.address.state} ${contactConfig.address.pincode}`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

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
              {t('footer.description')}
            </p>
            <div className="flex gap-4 mt-6">
              <span className="bg-white border-2 border-gray-200 p-3 rounded-full text-gray-400 shadow-sm cursor-default">
                <FaFacebook size={18} />
              </span>
              <span className="bg-white border-2 border-gray-200 p-3 rounded-full text-gray-400 shadow-sm cursor-default">
                <FaInstagram size={18} />
              </span>
              <span className="bg-white border-2 border-gray-200 p-3 rounded-full text-gray-400 shadow-sm cursor-default">
                <FaTwitter size={18} />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-600 mb-4 pb-3 border-b-2 border-gray-200">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-500 text-sm flex items-center gap-2 cursor-default">
                <span className="text-gray-400">›</span> 
                <span>{t('footer.home')}</span>
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2 cursor-default">
                <span className="text-gray-400">›</span> 
                <span>{t('footer.catalog')}</span>
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2 cursor-default">
                <span className="text-gray-400">›</span> 
                <span>{t('footer.about')}</span>
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2 cursor-default">
                <span className="text-gray-400">›</span> 
                <span>{t('footer.services')}</span>
              </li>
              <li className="text-gray-500 text-sm flex items-center gap-2 cursor-default">
                <span className="text-gray-400">›</span> 
                <span>{t('footer.contact')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-600 mb-4 pb-3 border-b-2 border-gray-200">
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-green-600 mt-1 flex-shrink-0" size={18} />
                <a 
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors hover:underline leading-relaxed cursor-pointer"
                >
                  {contactConfig.address.street}, {contactConfig.address.city},<br />
                  {contactConfig.address.state} {contactConfig.address.pincode}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaPhone className="text-green-600 flex-shrink-0" size={18} />
                <a 
                  href={`tel:${contactConfig.phone.replace(/\s+/g, '')}`}
                  className="text-gray-600 hover:text-green-600 transition-colors hover:underline"
                >
                  {contactConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-green-600 flex-shrink-0" size={18} />
                <a 
                  href={`mailto:${contactConfig.email}`}
                  className="text-gray-600 hover:text-green-600 transition-colors hover:underline"
                >
                  {contactConfig.email}
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-600 mb-4 pb-3 border-b-2 border-gray-200">
              {t('footer.getInTouch')}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('footer.whatsappCta')}
            </p>
            <a
              href={getWhatsAppLink(contactConfig.whatsappMessages.contactRequest)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-emerald-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <FaWhatsapp size={24} />
              <span>{t('footer.whatsappButton')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} SahyogFarm. {t('footer.rights')}
            </p>
            <div className="flex gap-6">
              <span className="text-gray-500 cursor-default">
                {t('footer.privacy')}
              </span>
              <span className="text-gray-500 cursor-default">
                {t('footer.terms')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}