"use client";

import { useI18n } from "@/components/language-provider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-14 border-t border-white/10 py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 text-sm text-zinc-400 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-lg font-semibold text-white">Voxera.live</p>
          <p className="mt-2">{t("footerTagline")}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-200">{t("footerDesks")}</p>
          <p className="mt-2">{t("footerDesksBody")}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-200">{t("footerNewsletter")}</p>
          <p className="mt-2">{t("footerNewsletterBody")}</p>
        </div>
      </div>
    </footer>
  );
}
