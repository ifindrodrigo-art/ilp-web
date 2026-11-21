import { cache } from "react";
import { SEED } from "./seed";
import { serverClient } from "./supabase";
import { todayInLima } from "./format";
import type { EventItem, SiteContent } from "./types";

/**
 * Lee el contenido publicado. Sin Supabase devuelve el contenido inicial.
 * Las páginas se regeneran cada 60 segundos, así que lo que se edita en el panel
 * aparece en la web en alrededor de un minuto.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const sb = serverClient();
  if (!sb) return SEED;

  const [settings, schedules, events, ministries, sermons, gallery, announcements, team] = await Promise.all([
    sb.from("settings").select("*").eq("id", 1).maybeSingle(),
    sb.from("schedules").select("*").eq("active", true).order("sort"),
    sb.from("events").select("*").eq("published", true).order("starts_on"),
    sb.from("ministries").select("*").eq("published", true).order("sort"),
    sb.from("sermons").select("*").eq("published", true).order("preached_on", { ascending: false, nullsFirst: false }),
    sb.from("gallery").select("*").eq("published", true).order("sort").order("taken_on", { ascending: false }),
    sb.from("announcements").select("*").eq("active", true),
    sb.from("team").select("*").eq("published", true).order("sort"),
  ]);

  for (const r of [settings, schedules, events, ministries, sermons, gallery, announcements, team]) {
    if (r.error) console.error("[contenido]", r.error.message);
  }

  const today = todayInLima();
  return {
    settings: { ...SEED.settings, ...(settings.data ?? {}) },
    schedules: schedules.data ?? [],
    events: events.data ?? [],
    ministries: ministries.data ?? [],
    sermons: sermons.data ?? [],
    gallery: gallery.data ?? [],
    announcements: (announcements.data ?? []).filter((a) => !a.ends_on || a.ends_on >= today),
    team: team.data ?? [],
  };
});

/** Eventos que todavía no terminan, del más cercano al más lejano. */
export function upcomingEvents(events: EventItem[]): EventItem[] {
  const today = todayInLima();
  return events
    .filter((e) => (e.ends_on ?? e.starts_on) >= today || (!e.date_confirmed && e.starts_on.slice(0, 7) >= today.slice(0, 7)))
    .sort((a, b) => a.starts_on.localeCompare(b.starts_on));
}
