"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaSignOutAlt, 
  FaBars,
  FaTimes 
} from 'react-icons/fa';
import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  const menuItems = [
    {
      name: t('admin.dashboard'),
      icon: FaTachometerAlt,
      path: '/admin/dashboard',
    },
    {
      name: t('admin.products'),
      icon: FaBox,
      path: '/admin/products',
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? <FaTimes size={20} className="text-gray-700" /> : <FaBars size={20} className="text-gray-700" />}
          </button>
          <h1 className="text-xl font-bold">
            <span className="text-green-600">Sahyog</span>
            <span className="text-gray-800">Farm</span>
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[57px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-[57px] lg:top-0 left-0 h-[calc(100vh-57px)] lg:h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-green-600">Sahyog</span>
              <span className="text-gray-800">Farm</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{t('admin.panel')}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t('admin.language')}
              </span>
              <div className="h-1 w-10 bg-green-500 rounded-full" />
            </div>
            <LanguageSwitcher className="w-full" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-green-50 text-green-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <FaSignOutAlt size={18} />
            <span className="font-medium">{t('admin.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
