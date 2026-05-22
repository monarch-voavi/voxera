"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { dictionary, type Locale } from "@/lib/strings";

type Ctx = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof (typeof dictionary)["en"]) => string;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "voxera-locale";

function readSavedLocale(): Locale {
  if (typeof window === "undefined") return "uk";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "uk" ? saved : "uk";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readSavedLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: keyof (typeof dictionary)["en"]) => {
      return dictionary[locale][key] ?? dictionary.en[key];
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
