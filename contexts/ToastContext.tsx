"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((
    type: ToastType,
    message: string,
    title?: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, title, message, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => {
    showToast('success', message, title || 'Success');
  }, [showToast]);

  const error = useCallback((message: string, title?: string) => {
    showToast('error', message, title || 'Error', 6000);
  }, [showToast]);

  const info = useCallback((message: string, title?: string) => {
    showToast('info', message, title || 'Info');
  }, [showToast]);

  const warning = useCallback((message: string, title?: string) => {
    showToast('warning', message, title || 'Warning');
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Individual Toast Item
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = {
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
      progressColor: 'bg-green-500',
    },
    error: {
      icon: FaExclamationCircle,
      bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
      progressColor: 'bg-red-500',
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
      progressColor: 'bg-blue-500',
    },
    warning: {
      icon: FaExclamationCircle,
      bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      messageColor: 'text-yellow-700',
      progressColor: 'bg-yellow-500',
    },
  };

  const style = config[toast.type];
  const Icon = style.icon;

  return (
    <div
      className={`
        ${style.bgColor} ${style.borderColor}
        border-l-4 rounded-lg shadow-lg
        p-4 pointer-events-auto
        animate-slide-in-right
        backdrop-blur-sm
        transition-all duration-300 hover:shadow-xl
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${style.iconColor} mt-0.5 flex-shrink-0`}>
          <Icon size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={`font-semibold ${style.titleColor} mb-1 text-sm`}>
              {toast.title}
            </h4>
          )}
          <p className={`${style.messageColor} text-sm leading-relaxed`}>
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className={`
            ${style.iconColor} hover:opacity-70
            transition-opacity flex-shrink-0
            p-1 rounded-md hover:bg-white/50
          `}
          aria-label="Close"
        >
          <FaTimes size={14} />
        </button>
      </div>

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className={`h-full ${style.progressColor} rounded-full animate-progress`}
            style={{
              animation: `progress ${toast.duration}ms linear`,
            }}
          />
        </div>
      )}
    </div>
  );
}
