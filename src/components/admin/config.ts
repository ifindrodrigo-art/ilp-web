import { DAYS, eventDateText, formatTime } from "@/lib/format";

export type FieldType = "text" | "textarea" | "date" | "time" | "number" | "checkbox" | "select" | "image" | "youtube" | "url";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string | number; label: string }[];
  max?: number;
  /** Solo se puede escribir al crear (por ejemplo, el identificador de un ministerio). */
  createOnly?: boolean;
};

type Row = Record<string, unknown>;

export type TableConfig = {
  table: string;
  pk: "id" | "slug";
  title: string;
  singular: string;
  intro: string;
  order: { column: string; ascending: boolean }[];
  fields: Field[];
  defaults: Row;
  rowTitle: (r: Row) => string;
  rowMeta: (r: Row) => string;
  /** Campo booleano que decide si se ve en la web. */
  visibleKey?: string;
  bulkUpload?: boolean;
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

export const TABLES: TableConfig[] = [
  {
    table: "events",
    pk: "id",
    title: "Eventos",
    singular: "evento",
    intro: "Congresos, campamentos, cultos especiales. Si todavía no hay fecha exacta, desmarca \"Fecha confirmada\" y en la web saldrá solo el mes.",
    order: [{ column: "starts_on", ascending: false }],
    fields: [
      { key: "title", label: "Título", type: "text", required: true, max: 120 },
      { key: "starts_on", label: "Fecha de inicio", type: "date", required: true },
      { key: "ends_on", label: "Fecha de fin", type: "date", help: "Solo si dura más de un día." },
      { key: "date_confirmed", label: "Fecha confirmada", type: "checkbox", help: "Si no está marcada, la web muestra solo el mes y \"fecha por confirmar\"." },
      { key: "time_text", label: "Hora", type: "text", max: 60, help: "Por ejemplo: 7:00 p.m." },
      { key: "location", label: "Lugar", type: "text", max: 160 },
      { key: "description", label: "Descripción", type: "textarea", max: 2000 },
      { key: "image_url", label: "Flyer o foto", type: "image" },
      { key: "ministry_slug", label: "Ministerio", type: "select", options: [] },
      { key: "link_url", label: "Link de inscripción", type: "url", help: "Opcional. Muestra un botón \"Inscríbete\"." },
      { key: "published", label: "Publicado en la web", type: "checkbox" },
    ],
    defaults: { title: "", starts_on: "", ends_on: null, date_confirmed: true, time_text: "", location: "Calle Arequipa 303, Tilda, Ate", description: "", image_url: null, ministry_slug: null, link_url: "", published: true },
    rowTitle: (r) => str(r.title),
    rowMeta: (r) =>
      r.starts_on ? eventDateText({ starts_on: str(r.starts_on), ends_on: (r.ends_on as string) || null, date_confirmed: Boolean(r.date_confirmed) }) : "",
    visibleKey: "published",
  },
  {
    table: "schedules",
    pk: "id",
    title: "Horarios",
    singular: "horario",
    intro: "Las reuniones que se repiten. Las semanales salen como tarjetas; las mensuales, en la franja \"Cada mes\".",
    order: [{ column: "sort", ascending: true }],
    fields: [
      { key: "name", label: "Reunión", type: "text", required: true, max: 80 },
      { key: "day", label: "Día", type: "select", required: true, options: DAYS.map((d, i) => ({ value: i, label: d })) },
      { key: "start_time", label: "Hora de inicio", type: "time", required: true },
      { key: "end_time", label: "Hora de fin", type: "time" },
      {
        key: "recurrence",
        label: "Frecuencia",
        type: "select",
        required: true,
        options: [
          { value: "weekly", label: "Cada semana" },
          { value: "monthly", label: "Una vez al mes" },
        ],
      },
      { key: "note", label: "Nota", type: "text", max: 120, help: "Por ejemplo: Jóvenes, o Primer domingo de cada mes." },
      { key: "sort", label: "Orden", type: "number", help: "Número más bajo = sale primero." },
      { key: "active", label: "Visible en la web", type: "checkbox" },
    ],
    defaults: { name: "", day: 0, start_time: "", end_time: null, recurrence: "weekly", note: "", sort: 10, active: true },
    rowTitle: (r) => str(r.name),
    rowMeta: (r) => `${DAYS[Number(r.day)] ?? ""} ${formatTime(str(r.start_time))} · ${r.recurrence === "monthly" ? "una vez al mes" : "cada semana"}`,
    visibleKey: "active",
  },
  {
    table: "ministries",
    pk: "slug",
    title: "Ministerios",
    singular: "ministerio",
    intro: "Cada ministerio tiene su propia página en la web.",
    order: [{ column: "sort", ascending: true }],
    fields: [
      { key: "name", label: "Nombre", type: "text", required: true, max: 80 },
      { key: "slug", label: "Dirección en la web", type: "text", required: true, createOnly: true, max: 40, help: "Solo minúsculas, números y guiones. Ejemplo: jovenes → /ministerios/jovenes. No se puede cambiar después." },
      { key: "audience", label: "Público", type: "text", required: true, max: 40, help: "Ejemplo: Jóvenes, Damas, Toda la iglesia." },
      { key: "tagline", label: "Lema", type: "text", max: 120 },
      { key: "description", label: "Descripción", type: "textarea", max: 2000 },
      { key: "schedule_text", label: "Cuándo se reúnen", type: "text", max: 120, help: "Ejemplo: Sábados, 7:00 p.m." },
      { key: "instagram", label: "Instagram", type: "text", max: 60, help: "Solo el usuario, sin @." },
      { key: "image_url", label: "Foto", type: "image" },
      { key: "sort", label: "Orden", type: "number" },
      { key: "published", label: "Publicado en la web", type: "checkbox" },
    ],
    defaults: { name: "", slug: "", audience: "", tagline: "", description: "", schedule_text: "", instagram: "", image_url: null, sort: 10, published: true },
    rowTitle: (r) => str(r.name),
    rowMeta: (r) => `${str(r.audience)} · /ministerios/${str(r.slug)}`,
    visibleKey: "published",
  },
  {
    table: "sermons",
    pk: "id",
    title: "Prédicas",
    singular: "prédica",
    intro: "Pega el link del video de YouTube. La más reciente sale en la portada.",
    order: [{ column: "preached_on", ascending: false }],
    fields: [
      { key: "title", label: "Título", type: "text", required: true, max: 160 },
      { key: "youtube_id", label: "Link de YouTube", type: "youtube", required: true },
      { key: "preacher", label: "Predicador", type: "text", max: 80 },
      { key: "preached_on", label: "Fecha", type: "date" },
      { key: "published", label: "Publicado en la web", type: "checkbox" },
    ],
    defaults: { title: "", youtube_id: "", preacher: "", preached_on: null, published: true },
    rowTitle: (r) => str(r.title),
    rowMeta: (r) => [str(r.preacher), str(r.preached_on)].filter(Boolean).join(" · "),
    visibleKey: "published",
  },
  {
    table: "gallery",
    pk: "id",
    title: "Galería",
    singular: "foto",
    intro: "Sube varias fotos a la vez: se achican solas antes de subir. Usa fotos sin filtros. No subas caras de niños sin permiso de sus padres.",
    order: [
      { column: "sort", ascending: true },
      { column: "created_at", ascending: false },
    ],
    fields: [
      { key: "image_url", label: "Foto", type: "image", required: true },
      { key: "caption", label: "Descripción", type: "text", max: 200, help: "Describe la escena; ayuda a quienes usan lector de pantalla." },
      { key: "album", label: "Álbum", type: "text", max: 80, help: "Ejemplo: Congreso de Jóvenes 2026." },
      { key: "taken_on", label: "Fecha", type: "date" },
      { key: "sort", label: "Orden", type: "number" },
      { key: "published", label: "Publicada en la web", type: "checkbox" },
    ],
    defaults: { image_url: null, caption: "", album: "", taken_on: null, sort: 10, published: true },
    rowTitle: (r) => str(r.caption) || "Foto sin descripción",
    rowMeta: (r) => [str(r.album), str(r.taken_on)].filter(Boolean).join(" · "),
    visibleKey: "published",
    bulkUpload: true,
  },
  {
    table: "announcements",
    pk: "id",
    title: "Avisos",
    singular: "aviso",
    intro: "Un aviso corto que sale en una franja arriba de toda la web. Se oculta solo después de la fecha de fin.",
    order: [{ column: "created_at", ascending: false }],
    fields: [
      { key: "text", label: "Texto", type: "text", required: true, max: 160 },
      { key: "link_url", label: "Link", type: "url" },
      { key: "link_label", label: "Texto del link", type: "text", max: 40, help: "Ejemplo: Inscríbete." },
      { key: "ends_on", label: "Mostrar hasta", type: "date" },
      { key: "active", label: "Activo", type: "checkbox" },
    ],
    defaults: { text: "", link_url: "", link_label: "", ends_on: null, active: true },
    rowTitle: (r) => str(r.text),
    rowMeta: (r) => (r.ends_on ? `Hasta el ${str(r.ends_on)}` : "Sin fecha de fin"),
    visibleKey: "active",
  },
  {
    table: "team",
    pk: "id",
    title: "Pastores",
    singular: "pastor o pastora",
    intro: "Equipo pastoral que sale en Nosotros. Publica a cada persona solo cuando haya aceptado aparecer y su cargo esté confirmado.",
    order: [{ column: "sort", ascending: true }],
    fields: [
      { key: "name", label: "Nombre", type: "text", required: true, max: 80 },
      { key: "role", label: "Cargo", type: "text", max: 80 },
      { key: "bio", label: "Breve presentación", type: "textarea", max: 1000 },
      { key: "image_url", label: "Foto", type: "image" },
      { key: "sort", label: "Orden", type: "number" },
      { key: "published", label: "Publicado en la web", type: "checkbox" },
    ],
    defaults: { name: "", role: "", bio: "", image_url: null, sort: 10, published: false },
    rowTitle: (r) => str(r.name),
    rowMeta: (r) => str(r.role),
    visibleKey: "published",
  },
];

export const SETTINGS_FIELDS: Field[] = [
  { key: "whatsapp", label: "WhatsApp oficial", type: "text", max: 30, help: "Número con el que la iglesia responde. Ejemplo: 987654321. Activa los botones de WhatsApp." },
  { key: "email", label: "Correo oficial", type: "text", max: 120 },
  { key: "logo_url", label: "Logo", type: "image", help: "PNG sin fondo, de preferencia horizontal." },
  { key: "hero_image_url", label: "Foto principal de la portada", type: "image", help: "Horizontal y de muy buena calidad: culto o alabanza." },
  { key: "welcome_image_url", label: "Foto de bienvenida", type: "image", help: "Sale en Inicio, junto a Nosotros." },
  { key: "founder_image_url", label: "Foto del pastor fundador", type: "image", help: "Pastor Macario Mauricio. Sale en Nosotros, en la sección En memoria." },
  { key: "live_url", label: "Link de cultos en vivo", type: "url" },
  { key: "youtube_url", label: "YouTube", type: "url" },
  { key: "instagram_url", label: "Instagram", type: "url" },
  { key: "facebook_url", label: "Facebook", type: "url" },
  { key: "tiktok_url", label: "TikTok", type: "url" },
  { key: "address", label: "Dirección", type: "text", required: true },
  { key: "address_reference", label: "Referencia para llegar", type: "text" },
  { key: "maps_url", label: "Link de Google Maps", type: "url" },
  { key: "vision", label: "Visión", type: "textarea", max: 600, help: "Sale en Nosotros cuando la llenes." },
  { key: "mission", label: "Misión", type: "textarea", max: 600 },
  { key: "beliefs", label: "En qué creemos", type: "textarea", max: 4000 },
  { key: "first_visit", label: "Texto de primera visita", type: "textarea", max: 2000, help: "Qué esperar: cuánto dura el culto, estacionamiento, niños, cómo se viste la gente." },
];
