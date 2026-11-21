function clean(url: string) {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = clean(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_PROD_URL ||
    "http://localhost:3000",
);

export const SITE_NAME = "Iglesia Los Productores";
export const SITE_SHORT = "Los Productores";
export const MOTTO = "¡Más que una iglesia, una familia!";
export const PHRASE = "Transmitir vida a través de nuestra vida";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/** Sin las variables de Supabase la web muestra el contenido inicial (modo demostración). */
export const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const NAV = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/eventos", label: "Eventos" },
  { href: "/predicas", label: "Prédicas" },
  { href: "/galeria", label: "Galería" },
  { href: "/contacto", label: "Contacto" },
];
