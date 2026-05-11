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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uk");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Locale | null) ?? "uk";
    if (saved === "en" || saved === "uk") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "uk" ? "uk" : "en";
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "uk" ? "uk" : "en";
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
