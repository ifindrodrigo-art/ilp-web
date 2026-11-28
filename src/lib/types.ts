export type Schedule = {
  id: string;
  /** 0 = domingo … 6 = sábado */
  day: number;
  /** "19:00" */
  start_time: string;
  /** "19:00" o null */
  end_time: string | null;
  name: string;
  /** "weekly" = cada semana; "monthly" = una vez al mes (la nota dice cuándo) */
  recurrence: "weekly" | "monthly";
  note: string | null;
  sort: number;
  active: boolean;
  /** Se transmite en vivo (el botón "Cultos en vivo" se pone rojo a esa hora) */
  streamed?: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  /** "2026-12-13" */
  starts_on: string;
  ends_on: string | null;
  /** Si es false, solo se muestra el mes y "fecha por confirmar" */
  date_confirmed: boolean;
  time_text: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  ministry_slug: string | null;
  link_url: string | null;
  published: boolean;
};

export type Ministry = {
  slug: string;
  name: string;
  audience: string;
  tagline: string | null;
  description: string | null;
  schedule_text: string | null;
  instagram: string | null;
  image_url: string | null;
  sort: number;
  published: boolean;
};

export type Sermon = {
  id: string;
  title: string;
  youtube_id: string;
  preacher: string | null;
  preached_on: string | null;
  published: boolean;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
  album: string | null;
  taken_on: string | null;
  sort: number;
  published: boolean;
};

export type Announcement = {
  id: string;
  text: string;
  link_url: string | null;
  link_label: string | null;
  ends_on: string | null;
  active: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  sort: number;
  published: boolean;
};

export type Settings = {
  whatsapp: string | null;
  email: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  welcome_image_url: string | null;
  /** Foto del pastor fundador (sección En memoria de Nosotros) */
  founder_image_url: string | null;
  live_url: string | null;
  youtube_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  address: string;
  address_reference: string | null;
  maps_url: string | null;
  vision: string | null;
  mission: string | null;
  beliefs: string | null;
  first_visit: string | null;
};

export type SiteContent = {
  settings: Settings;
  schedules: Schedule[];
  events: EventItem[];
  ministries: Ministry[];
  sermons: Sermon[];
  gallery: GalleryItem[];
  announcements: Announcement[];
  team: TeamMember[];
};

export type SubmissionKind = "nuevo" | "oracion";

export type Submission = {
  id: string;
  kind: SubmissionKind;
  name: string | null;
  phone: string | null;
  email: string | null;
  visit_when: string | null;
  message: string | null;
  wants_contact: boolean;
  status: "nuevo" | "atendido";
  created_at: string;
};
