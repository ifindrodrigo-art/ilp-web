import type { NextConfig } from "next";

// En Vercel, VERCEL_PROJECT_PRODUCTION_URL trae el dominio real de producción.
const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PROD_URL: prod ? `https://${prod}` : "",
  },
  images: {
    // Las fotos optimizadas se guardan 31 días: menos conversiones en el plan gratuito de Vercel.
    minimumCacheTTL: 2678400,
    // Menos tamaños = menos versiones de cada foto.
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [96, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
