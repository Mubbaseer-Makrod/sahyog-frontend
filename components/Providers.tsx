"use client";

import { ReactNode } from 'react';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { ToastProvider } from '@/contexts/ToastContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </ToastProvider>
  );
}
