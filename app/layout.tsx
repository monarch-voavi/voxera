import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "@/components/language-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voxera.live"),
  title: {
    default: "Voxera.live | Live global intelligence",
    template: "%s | Voxera.live",
  },
  description: "A real-time AI-powered global news ecosystem with instant updates, deep context, and elegant design.",
  keywords: ["global news", "breaking news", "AI summaries", "world events", "voxera"],
  openGraph: {
    title: "Voxera.live",
    description: "The world, as it happens.",
    type: "website",
    url: "https://voxera.live",
    siteName: "Voxera.live",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voxera.live",
    description: "Live global intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}