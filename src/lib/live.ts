import type { Schedule } from "./types";

export type LiveSlot = { day: number; start: string; end: string | null };

/** Horarios que se transmiten: los marcados en el panel o, si la base aún no tiene esa columna, domingos y martes. */
export function liveSlots(schedules: Schedule[]): LiveSlot[] {
  return schedules
    .filter((s) => s.active !== false && s.recurrence === "weekly" && (s.streamed ?? (s.day === 0 || s.day === 2)))
    .map((s) => ({ day: s.day, start: s.start_time, end: s.end_time }));
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** ¿Estamos en horario de transmisión? (hora de Lima; desde 5 min antes hasta el fin, o 2 h si no tiene hora de fin) */
export function isLiveNow(slots: LiveSlot[], date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Lima", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = DAYS.indexOf(get("weekday"));
  const now = Number(get("hour")) * 60 + Number(get("minute"));
  return slots.some((s) => {
    if (s.day !== day) return false;
    const start = toMin(s.start) - 5;
    const end = s.end ? toMin(s.end) : toMin(s.start) + 120;
    return now >= start && now <= end;
  });
}
