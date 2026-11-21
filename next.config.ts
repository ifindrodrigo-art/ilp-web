import type { NextConfig } from "next";

// En Vercel, VERCEL_PROJECT_PRODUCTION_URL trae el dominio real de producción.
const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PROD_URL: prod ? `https://${prod}` : "",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
