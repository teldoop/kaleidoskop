import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Aplikasi Kaleidoskop", template: "%s | Kaleidoskop" },
  description: "Dokumentasi foto anggota TIF UB'26",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbbf24" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${font.className} min-h-screen bg-amber-50 text-zinc-800 antialiased dark:bg-zinc-950 dark:text-zinc-100`}>
        <NextTopLoader color="#f59e0b" height={3} showSpinner={false} crawlSpeed={200} />
        {children}
      </body>
    </html>
  );
}
