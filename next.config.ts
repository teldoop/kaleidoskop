import type { NextConfig } from "next";

// next/image hanya mengizinkan host yang terdaftar: foto disimpan di Supabase Storage (bucket publik "photos")
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : undefined;

const config: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/photos/**" }]
      : [],
  },
};

export default config;