import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { HAS_SUPABASE, SUPABASE_KEY, SUPABASE_URL } from "./site";

export const MEDIA_BUCKET = "media";

/** Cliente de solo lectura para el servidor (sin sesión). */
export function serverClient(): SupabaseClient | null {
  if (!HAS_SUPABASE) return null;
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let browser: SupabaseClient | null = null;

/** Cliente del navegador (formularios y panel admin). */
export function browserClient(): SupabaseClient | null {
  if (!HAS_SUPABASE) return null;
  if (!browser) {
    browser = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return browser;
}

export function translateError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return "Correo o contraseña incorrectos.";
  if (/Email not confirmed/i.test(msg)) return "Ese correo todavía no está confirmado en Supabase.";
  if (/rate limit/i.test(msg)) return "Demasiados intentos. Espera un minuto y vuelve a probar.";
  if (/Failed to fetch|NetworkError|Load failed/i.test(msg)) return "No hay conexión. Revisa tu internet y vuelve a intentar.";
  if (/row-level security|permission denied/i.test(msg)) return "Tu usuario no tiene permiso de administrador.";
  if (/exceeded the maximum allowed size|Payload too large/i.test(msg)) return "La foto pesa demasiado (máximo 5 MB). Prueba con otra.";
  if (/duplicate key/i.test(msg)) return "Ya existe un registro con ese identificador.";
  return msg;
}
