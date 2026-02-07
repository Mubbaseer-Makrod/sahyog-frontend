"use client";

import { ReactNode } from 'react';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { I18nProvider } from '@/contexts/I18nContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ToastProvider>
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
