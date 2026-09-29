import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aplikasi Kaleidoskop",
    short_name: "Kaleidoskop",
    description: "Dokumentasi foto anggota TIF UB'26",
    lang: "id",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffbeb",
    theme_color: "#fbbf24",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
