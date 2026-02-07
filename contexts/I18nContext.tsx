"use client";

import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import en from "@/i18n/messages/en.json";
import gu from "@/i18n/messages/gu.json";
import hi from "@/i18n/messages/hi.json";

type Locale = "gu" | "en" | "hi";

type Messages = Record<string, any>;

const MESSAGES: Record<Locale, Messages> = {
  gu,
  en,
  hi,
};

const DEFAULT_LOCALE: Locale = "gu";
const STORAGE_KEY = "sahyog_locale";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getValueByPath = (obj: Messages, path: string) => {
  return path.split(".").reduce((acc: any, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const formatMessage = (message: string, vars?: Record<string, string | number>) => {
  if (!vars) return message;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }, message);
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Locale | null) : null;
    if (stored && MESSAGES[stored]) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const message = getValueByPath(MESSAGES[locale], key) ?? getValueByPath(MESSAGES[DEFAULT_LOCALE], key) ?? key;
      if (typeof message !== "string") return key;
      return formatMessage(message, vars);
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

export type { Locale };
