export const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "19:00" → "7:00 p.m." */
export function formatTime(t: string | null | undefined): string {
  if (!t) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  let h = Number(m[1]);
  const min = m[2];
  const suffix = h >= 12 ? "p.m." : "a.m.";
  h = h % 12 || 12;
  return `${h}:${min} ${suffix}`;
}

function parts(date: string) {
  const [y, mo, d] = date.slice(0, 10).split("-").map(Number);
  return { y, mo, d };
}

export function monthName(date: string): string {
  return MONTHS[parts(date).mo - 1] ?? "";
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "2026-12-13" → "13 de diciembre de 2026" */
export function formatDate(date: string, withYear = true): string {
  const { y, mo, d } = parts(date);
  return `${d} de ${MONTHS[mo - 1]}${withYear ? ` de ${y}` : ""}`;
}

export function dayNumber(date: string): number {
  return parts(date).d;
}

export function yearOf(date: string): number {
  return parts(date).y;
}

/** Texto de fecha de un evento, respetando si la fecha está confirmada. */
export function eventDateText(e: { starts_on: string; ends_on: string | null; date_confirmed: boolean }): string {
  if (!e.date_confirmed) {
    return `${capitalize(monthName(e.starts_on))} ${yearOf(e.starts_on)} · fecha por confirmar`;
  }
  if (e.ends_on && e.ends_on !== e.starts_on) {
    const a = parts(e.starts_on);
    const b = parts(e.ends_on);
    if (a.mo === b.mo && a.y === b.y) return `Del ${a.d} al ${b.d} de ${MONTHS[a.mo - 1]} de ${a.y}`;
    return `Del ${formatDate(e.starts_on, a.y !== b.y)} al ${formatDate(e.ends_on)}`;
  }
  return capitalize(formatDate(e.starts_on));
}

/** Fecha de hoy en Lima, "YYYY-MM-DD". */
export function todayInLima(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Extrae el id de un link de YouTube (o devuelve el texto si ya es un id). */
export function youtubeId(input: string): string {
  const s = input.trim();
  const m =
    /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/.exec(s) ||
    /^([A-Za-z0-9_-]{11})$/.exec(s);
  return m ? m[1] : s;
}

/** Número de WhatsApp a link wa.me (Perú por defecto). */
export function whatsappLink(raw: string | null | undefined, text?: string): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 9) digits = `51${digits}`;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}
