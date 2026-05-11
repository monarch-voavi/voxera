"use client";

import { useI18n } from "@/components/language-provider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="flex rounded-xl border border-white/15 bg-white/[0.04] p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => setLocale("uk")}
        className={`rounded-lg px-2.5 py-1.5 transition ${locale === "uk" ? "bg-violet-500/40 text-white" : "text-zinc-400 hover:text-white"}`}
        aria-pressed={locale === "uk"}
      >
        {t("langUk")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-lg px-2.5 py-1.5 transition ${locale === "en" ? "bg-violet-500/40 text-white" : "text-zinc-400 hover:text-white"}`}
        aria-pressed={locale === "en"}
      >
        {t("langEn")}
      </button>
    </div>
  );
}
