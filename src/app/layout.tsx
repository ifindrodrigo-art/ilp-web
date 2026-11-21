import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/inter";
import "./globals.css";
import { MOTTO, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Iglesia evangélica de las Asambleas de Dios del Perú en Ate Vitarte, Lima. Cultos los domingos a las 10:00 a.m. y 5:00 p.m. ¡Más que una iglesia, una familia!";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Ate Vitarte, Lima`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "Iglesia Los Productores",
    "iglesia en Ate",
    "iglesia en Ate Vitarte",
    "iglesia cristiana Lima Este",
    "Asambleas de Dios del Perú",
    "iglesia evangélica Ate",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME}: ${MOTTO}`,
    description,
  },
  twitter: { card: "summary_large_image" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body>{children}</body>
    </html>
  );
}
