import type { GalleryItem, Sermon } from "./types";

/* ---------------- Álbumes de la galería ---------------- */

export type Album = {
  name: string;
  slug: string;
  cover: GalleryItem;
  items: GalleryItem[];
  /** Fecha más reciente del álbum ("AAAA-MM-DD"), si se conoce */
  date: string | null;
};

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Agrupa la galería en álbumes. Primero los álbumes sin fecha (los de siempre,
 * como "Vida de iglesia"), luego los que tienen fecha, del más reciente al más antiguo.
 */
export function albumsOf(gallery: GalleryItem[]): Album[] {
  const map = new Map<string, GalleryItem[]>();
  for (const g of gallery) {
    const k = g.album?.trim() || "Más fotos";
    map.set(k, [...(map.get(k) ?? []), g]);
  }
  const albums: Album[] = [...map.entries()].map(([name, items]) => ({
    name,
    slug: slugify(name),
    cover: items[0],
    items,
    date: items.reduce<string | null>((d, g) => (g.taken_on && (!d || g.taken_on > d) ? g.taken_on : d), null),
  }));
  const undated = albums.filter((a) => !a.date);
  const dated = albums.filter((a) => a.date).sort((a, b) => (a.date! < b.date! ? 1 : -1));
  return [...undated, ...dated];
}

/* ---------------- Fotos y videos por ministerio ---------------- */

/** Qué álbumes (o pies de foto) pertenecen a cada ministerio. */
const MINISTRY_MATCH: Record<string, { album?: RegExp; caption?: RegExp }> = {
  ninos: { album: /infantil|festikids|niñ/i },
  teens: { album: /teens/i },
  jovenes: { album: /juvenil|j[oó]venes/i },
  alabanza: { album: /alabanza|ilp music/i, caption: /alabanza|m[uú]sic|guitarra|bajista|teclado|banda|cantantes/i },
  damas: { album: /damas/i },
  varones: { album: /varones/i },
  familia: { album: /familia|dedicaci|matrimonio/i },
  misiones: { album: /evangelismo|misi[oó]n anc|misiones|sembrando/i },
  oracion: { album: /oraci|ayuno|vigilia|intercesi/i, caption: /orando|oraci[oó]n|ora por/i },
};

export function ministryPhotos(slug: string, gallery: GalleryItem[]): GalleryItem[] {
  const rule = MINISTRY_MATCH[slug];
  if (!rule) return [];
  return gallery.filter((g) => (rule.album && rule.album.test(g.album ?? "")) || (rule.caption && rule.caption.test(g.caption ?? "")));
}

export type Video = { id: string; title: string; note?: string };

/** Un video destacado por ministerio (del canal de YouTube de la iglesia). */
export const MINISTRY_VIDEOS: Record<string, Video> = {
  teens: { id: "WkutsEgApn0", title: "Campamento «Intensamente con Jesús»", note: "Resumen del campamento de Xtreme Teens, 2025" },
  alabanza: { id: "AixLnBUfYAg", title: "Dios Fuerte (cover de Barak)", note: "Iglesia Los Productores, 2025" },
  jovenes: { id: "gLnP8bE9VTA", title: "Congreso juvenil «Íntimo y Eterno»", note: "Transmisión del 10 de octubre de 2026" },
  damas: { id: "_5rENj1-KmU", title: "Congreso de Damas «Restauradas»", note: "Transmisión del 31 de mayo de 2026" },
  familia: { id: "IF1blcfcvbo", title: "Congreso de la Familia: día central", note: "Transmisión del 15 de noviembre de 2026" },
  oracion: { id: "6prJ9LuyO-Y", title: "Congreso de Intercesión: día central", note: "Transmisión del 25 de octubre de 2026" },
  misiones: { id: "wDQf0ABfyko", title: "Campaña evangelística", note: "Transmisión del 22 de noviembre de 2026" },
};

/** Videos especiales del canal (no son cultos). */
export const SPECIAL_VIDEOS: Video[] = [
  { id: "1M3vyfrpm_o", title: "Video histórico de la iglesia", note: "2023" },
  { id: "j2Vuw3dxfmw", title: "El Año del Crecimiento", note: "Resumen de 2024" },
  { id: "wsdJNa58-UE", title: "Aniversario 2025, «Año de la Respuesta»", note: "Último día" },
  { id: "AixLnBUfYAg", title: "Dios Fuerte (cover de Barak)", note: "2025" },
  { id: "WkutsEgApn0", title: "Intensamente con Jesús", note: "Campamento de Xtreme Teens, 2025" },
];

/* ---------------- Prédicas ---------------- */

export function sermonCategory(s: Pick<Sermon, "title">): string {
  const t = s.title.toLowerCase();
  if (/damas/.test(t)) return "Damas";
  if (/juvenil|íntimo|intimo|jóvenes|jovenes/.test(t)) return "Jóvenes";
  if (/oraci|vigilia|ayuno|intercesi/.test(t)) return "Oración";
  if (/congreso|aniversario|campaña|seminario|pastor/.test(t)) return "Congresos y eventos";
  return "Cultos";
}
