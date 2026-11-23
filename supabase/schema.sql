-- =====================================================================
-- Iglesia Los Productores — esquema completo para Supabase
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO → Run.
--
-- OJO: se puede volver a correr, pero BORRA Y RECREA todo (también lo que
-- hayan cargado desde el panel). Úsalo solo la primera vez o para empezar de cero.
-- =====================================================================

-- ---------- Limpieza (permite re-ejecutar) ----------
drop table if exists public.submissions cascade;
drop table if exists public.team cascade;
drop table if exists public.announcements cascade;
drop table if exists public.gallery cascade;
drop table if exists public.sermons cascade;
drop table if exists public.ministries cascade;
drop table if exists public.events cascade;
drop table if exists public.schedules cascade;
drop table if exists public.settings cascade;
drop function if exists public.is_admin() cascade;
drop table if exists public.admins cascade;

-- ---------- Administradores ----------
-- Quién puede editar desde el panel. Se agregan con supabase/hacer-admin.sql.
create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Tablas de contenido ----------
create table public.settings (
  id                int primary key default 1 check (id = 1),
  whatsapp          text check (char_length(whatsapp) <= 30),
  email             text check (char_length(email) <= 120),
  logo_url          text,
  hero_image_url    text,
  welcome_image_url text,
  founder_image_url text,
  live_url          text,
  youtube_url       text,
  instagram_url     text,
  facebook_url      text,
  tiktok_url        text,
  address           text not null default '',
  address_reference text,
  maps_url          text,
  vision            text check (char_length(vision) <= 600),
  mission           text check (char_length(mission) <= 600),
  beliefs           text check (char_length(beliefs) <= 4000),
  first_visit       text check (char_length(first_visit) <= 2000),
  updated_at        timestamptz not null default now()
);

create table public.schedules (
  id         uuid primary key default gen_random_uuid(),
  day        smallint not null check (day between 0 and 6),
  start_time text not null check (start_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  end_time   text check (end_time is null or end_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  name       text not null check (char_length(name) between 2 and 80),
  recurrence text not null default 'weekly' check (recurrence in ('weekly', 'monthly')),
  note       text check (char_length(note) <= 120),
  sort       int not null default 0,
  active     boolean not null default true
);

create table public.events (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(title) between 2 and 120),
  starts_on      date not null,
  ends_on        date check (ends_on is null or ends_on >= starts_on),
  date_confirmed boolean not null default true,
  time_text      text check (char_length(time_text) <= 60),
  location       text check (char_length(location) <= 160),
  description    text check (char_length(description) <= 2000),
  image_url      text,
  ministry_slug  text,
  link_url       text,
  published      boolean not null default true,
  created_at     timestamptz not null default now()
);

create table public.ministries (
  slug          text primary key check (slug ~ '^[a-z0-9-]{2,40}$'),
  name          text not null check (char_length(name) between 2 and 80),
  audience      text not null check (char_length(audience) between 2 and 40),
  tagline       text check (char_length(tagline) <= 120),
  description   text check (char_length(description) <= 2000),
  schedule_text text check (char_length(schedule_text) <= 120),
  instagram     text check (char_length(instagram) <= 60),
  image_url     text,
  sort          int not null default 0,
  published     boolean not null default true
);

create table public.sermons (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 2 and 160),
  youtube_id  text not null check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  preacher    text check (char_length(preacher) <= 80),
  preached_on date,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.gallery (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  caption    text check (char_length(caption) <= 200),
  album      text check (char_length(album) <= 80),
  taken_on   date,
  sort       int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id         uuid primary key default gen_random_uuid(),
  text       text not null check (char_length(text) between 2 and 160),
  link_url   text,
  link_label text check (char_length(link_label) <= 40),
  ends_on    date,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.team (
  id        uuid primary key default gen_random_uuid(),
  name      text not null check (char_length(name) between 2 and 80),
  role      text check (char_length(role) <= 80),
  bio       text check (char_length(bio) <= 1000),
  image_url text,
  sort      int not null default 0,
  published boolean not null default false
);

-- Formularios "Soy nuevo" y "Petición de oración". Solo los administradores los leen.
create table public.submissions (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null check (kind in ('nuevo', 'oracion')),
  name          text check (char_length(name) <= 80),
  phone         text check (char_length(phone) <= 30),
  email         text check (char_length(email) <= 120),
  visit_when    text check (char_length(visit_when) <= 60),
  message       text check (char_length(message) <= 2000),
  wants_contact boolean not null default false,
  consent       boolean not null check (consent),
  status        text not null default 'nuevo' check (status in ('nuevo', 'atendido')),
  created_at    timestamptz not null default now()
);
create index submissions_created_idx on public.submissions (created_at desc);

-- ---------- Seguridad (Row Level Security) ----------
alter table public.admins        enable row level security;
alter table public.settings      enable row level security;
alter table public.schedules     enable row level security;
alter table public.events        enable row level security;
alter table public.ministries    enable row level security;
alter table public.sermons       enable row level security;
alter table public.gallery       enable row level security;
alter table public.announcements enable row level security;
alter table public.team          enable row level security;
alter table public.submissions   enable row level security;

-- Cada usuario solo ve si él mismo es administrador.
create policy "ver mi rol" on public.admins for select to authenticated using (user_id = auth.uid());

-- Ajustes: todos leen, solo administradores editan.
create policy "lectura publica" on public.settings for select using (true);
create policy "admin edita" on public.settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Contenido: el público lee lo publicado; los administradores leen y editan todo.
create policy "lectura publica" on public.schedules     for select using (active or public.is_admin());
create policy "lectura publica" on public.events        for select using (published or public.is_admin());
create policy "lectura publica" on public.ministries    for select using (published or public.is_admin());
create policy "lectura publica" on public.sermons       for select using (published or public.is_admin());
create policy "lectura publica" on public.gallery       for select using (published or public.is_admin());
create policy "lectura publica" on public.announcements for select using (active or public.is_admin());
create policy "lectura publica" on public.team          for select using (published or public.is_admin());

create policy "admin inserta" on public.schedules     for insert to authenticated with check (public.is_admin());
create policy "admin inserta" on public.events        for insert to authenticated with check (public.is_admin());
create policy "admin inserta" on public.ministries    for insert to authenticated with check (public.is_admin());
create policy "admin inserta" on public.sermons       for insert to authenticated with check (public.is_admin());
create policy "admin inserta" on public.gallery       for insert to authenticated with check (public.is_admin());
create policy "admin inserta" on public.announcements for insert to authenticated with check (public.is_admin());
create policy "admin inserta" on public.team          for insert to authenticated with check (public.is_admin());

create policy "admin edita" on public.schedules     for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin edita" on public.events        for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin edita" on public.ministries    for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin edita" on public.sermons       for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin edita" on public.gallery       for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin edita" on public.announcements for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin edita" on public.team          for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin borra" on public.schedules     for delete to authenticated using (public.is_admin());
create policy "admin borra" on public.events        for delete to authenticated using (public.is_admin());
create policy "admin borra" on public.ministries    for delete to authenticated using (public.is_admin());
create policy "admin borra" on public.sermons       for delete to authenticated using (public.is_admin());
create policy "admin borra" on public.gallery       for delete to authenticated using (public.is_admin());
create policy "admin borra" on public.announcements for delete to authenticated using (public.is_admin());
create policy "admin borra" on public.team          for delete to authenticated using (public.is_admin());

-- Formularios: cualquiera puede enviar; solo administradores leen, marcan y borran.
create policy "cualquiera envia" on public.submissions for insert to anon, authenticated
  with check (status = 'nuevo' and consent and (kind = 'oracion' or name is not null));
create policy "admin lee" on public.submissions for select to authenticated using (public.is_admin());
create policy "admin marca" on public.submissions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin borra" on public.submissions for delete to authenticated using (public.is_admin());

-- ---------- Fotos (Storage) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media: admin ve" on storage.objects;
drop policy if exists "media: admin sube" on storage.objects;
drop policy if exists "media: admin cambia" on storage.objects;
drop policy if exists "media: admin borra" on storage.objects;
create policy "media: admin ve" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy "media: admin sube" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "media: admin cambia" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "media: admin borra" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------- Contenido inicial (datos públicos de la iglesia y fotos del Ministerio de Comunicaciones, 22/11/2026) ----------
insert into public.settings (id, whatsapp, email, logo_url, hero_image_url, welcome_image_url, founder_image_url, live_url, youtube_url, instagram_url, facebook_url, tiktok_url, address, address_reference, maps_url, vision, mission, beliefs, first_visit) values (1, null, null, '/logo.png', '/fotos/portada.webp', '/fotos/familia-abrazo.webp', null, 'https://www.facebook.com/iglesiaproductores', 'https://www.youtube.com/@IglesiaLosProductores', 'https://www.instagram.com/iglesialosproductores', 'https://www.facebook.com/iglesiaproductores', 'https://www.tiktok.com/@iglesialosproductores', 'Calle Arequipa 303, Tilda, Ate Vitarte, Lima', 'A espaldas del grifo Petroperú, al lado de la nueva SUNAT.', 'https://maps.app.goo.gl/thrET51JXLkCqAsK6', null, null, null, null);

insert into public.schedules (day, start_time, end_time, name, recurrence, note, sort, active) values
  (2, '19:00', null, 'Culto de oración', 'weekly', null, 1, true),
  (6, '15:00', null, 'Xtreme Teens', 'weekly', 'Adolescentes', 2, true),
  (6, '19:00', null, 'Misión Juvenil', 'weekly', 'Jóvenes', 3, true),
  (0, '10:00', null, 'Culto central', 'weekly', 'Primer servicio', 4, true),
  (0, '17:00', null, 'Culto central', 'weekly', 'Segundo servicio', 5, true),
  (0, '08:00', '19:00', 'Ayuno y Santa Cena', 'monthly', 'Primer domingo de cada mes', 6, true);

insert into public.events (title, starts_on, ends_on, date_confirmed, time_text, location, description, image_url, ministry_slug, link_url, published) values
  ('Culto de Acción de Gracias y fin de año', '2026-12-15', null, false, null, 'Calle Arequipa 303, Tilda, Ate', 'Cerramos el año dando gracias a Dios, como familia.', null, null, null, true),
  ('Aniversario de la iglesia', '2027-02-15', null, false, null, 'Calle Arequipa 303, Tilda, Ate', 'Cada febrero celebramos un año más de la iglesia, con expositores nacionales e internacionales.', null, null, null, true),
  ('Campamento Xtreme Teens', '2027-02-20', null, false, null, null, 'El campamento de los adolescentes, que hacemos cada febrero.', null, 'teens', null, true);

insert into public.ministries (slug, name, audience, tagline, description, schedule_text, instagram, image_url, sort, published) values
  ('ninos', 'Misión Infantil', 'Niños', 'Encaminando una nueva generación', 'El ministerio de los niños de la iglesia. Cada verano tenemos la Escuela Bíblica de Vacaciones (EBDV); en agosto o septiembre, el Festi Kids; y durante el año, la dedicación de niños y el Escuadrón de Oración infantil.', null, 'mininfantil_productores', '/fotos/ministerios/ninos.webp', 1, true),
  ('teens', 'Xtreme Teens', 'Adolescentes', null, 'El ministerio de adolescentes, desde 2021, a cargo del pastor David. Estudiamos personajes de la Biblia, tenemos un campamento cada febrero y un congreso cada año. Al crecer, los teens pasan a Jóvenes.', 'Sábados, 3:00 p.m.', 'xtreme_teens_lp', null, 2, true),
  ('jovenes', 'Misión Juvenil', 'Jóvenes', 'Hay un lugar para ti', 'Los jóvenes de la iglesia. Nos reunimos cada sábado, salimos a evangelizar por la zona y cada octubre hacemos nuestro congreso juvenil, además de la adoración pública ¡Que Resuene!', 'Sábados, 7:00 p.m.', 'mjproductores', '/fotos/ministerios/jovenes.webp', 3, true),
  ('alabanza', 'ILP Music', 'Alabanza', null, 'La banda de alabanza de la iglesia, lanzada en diciembre de 2025. Toca en los congresos de la iglesia.', null, 'ilp.music', '/fotos/ministerios/alabanza.webp', 4, true),
  ('damas', 'Ministerio con Damas', 'Damas', null, 'Las mujeres de la iglesia, organizadas en grupos. Cada mayo realizamos el Congreso de Damas, que en 2026 llegó a su edición número 16.', null, null, '/fotos/ministerios/damas.webp', 5, true),
  ('varones', 'Hombres inquebrantables', 'Varones', 'Al servicio de Dios', 'El ministerio de varones nació en 2022. Cada año tenemos un congreso de varones, y en 2026 hicimos nuestro primer campamento.', null, null, null, 6, true),
  ('familia', 'Ministerio de la Familia', 'Familias', null, 'Charlas para padres, cena matrimonial y, cada noviembre desde 2019, el Congreso de la Familia.', null, null, '/fotos/familia-pareja.webp', 7, true),
  ('misiones', 'Sembrando Esperanza', 'Misiones', null, 'El ministerio de misiones: viajes misioneros, campañas de ayuda social y salidas a evangelizar por las calles un martes al mes.', null, null, '/fotos/ministerios/misiones.webp', 8, true),
  ('oracion', 'Oración e intercesión', 'Toda la iglesia', null, 'Cada martes nos reunimos a orar. En octubre realizamos el Congreso de Intercesión, además de vigilias y noches de clamor durante el año.', 'Martes, 7:00 p.m.', null, '/fotos/ministerios/oracion.webp', 9, true);

insert into public.team (name, role, bio, image_url, sort, published) values
  ('Ramiro Mauricio', 'Pastor principal', null, '/fotos/pastores/ramiro-mauricio.webp', 1, true),
  ('July Valenzuela', 'Pastora principal', null, '/fotos/pastores/july-valenzuela.webp', 2, true),
  ('Zenovia Palacin', 'Pastora', null, '/fotos/pastores/zenovia-palacin.webp', 3, true),
  ('David Mauricio', 'Pastor · Xtreme Teens', null, '/fotos/pastores/david-mauricio.webp', 4, true),
  ('Alice Mauricio', 'Pastora', null, '/fotos/pastores/alice-mauricio.webp', 5, true),
  ('Franklin Santamaria', 'Pastor', null, '/fotos/pastores/franklin-santamaria.webp', 6, true),
  ('Marcelina', 'Pastora', null, '/fotos/pastores/marcelina.webp', 7, true);

insert into public.gallery (image_url, caption, album, taken_on, sort, published) values
  ('/fotos/galeria/culto-interior.webp', 'Un domingo de culto en el local de la iglesia', 'Vida de iglesia', null, 20, true),
  ('/fotos/galeria/adoracion-hermanas.webp', 'Hermanas adorando durante el culto', 'Vida de iglesia', null, 21, true),
  ('/fotos/galeria/biblia.webp', 'Una Biblia abierta durante la prédica', 'Vida de iglesia', null, 22, true),
  ('/fotos/galeria/oracion-pastor.webp', 'Un pastor ora por un hermano', 'Vida de iglesia', null, 23, true),
  ('/fotos/galeria/musica-escenario.webp', 'Músicos en el escenario', 'Vida de iglesia', null, 24, true),
  ('/fotos/galeria/dia-del-pastor.webp', 'Celebración del Día del Pastor', 'Vida de iglesia', null, 25, true),
  ('/fotos/galeria/alabanza-equipo.webp', 'El equipo de alabanza en pleno', 'Alabanza', null, 26, true),
  ('/fotos/galeria/alabanza-cielo.webp', 'Adoración con la mano en alto', 'Alabanza', null, 27, true),
  ('/fotos/galeria/alabanza-teclado-2.webp', 'Teclado en la alabanza', 'Alabanza', null, 28, true),
  ('/fotos/galeria/alabanza-bajo-2.webp', 'Bajista del equipo de alabanza', 'Alabanza', null, 29, true),
  ('/fotos/galeria/alabanza-coros.webp', 'Voces de la alabanza', 'Alabanza', null, 30, true),
  ('/fotos/galeria/alabanza-voces.webp', 'Cantantes del equipo de alabanza', 'Alabanza', null, 31, true),
  ('/fotos/galeria/alabanza-banda.webp', 'La banda tocando en el culto', 'Alabanza', null, 32, true),
  ('/fotos/galeria/juvenil-grupo.webp', 'Los jóvenes en el congreso Íntimo y Eterno', 'Congreso juvenil Íntimo y Eterno 2026', null, 33, true),
  ('/fotos/galeria/juvenil-adoracion.webp', 'Jóvenes adorando con las manos en alto', 'Congreso juvenil Íntimo y Eterno 2026', null, 34, true),
  ('/fotos/galeria/juvenil-polos.webp', 'Jóvenes con los polos del congreso', 'Congreso juvenil Íntimo y Eterno 2026', null, 35, true),
  ('/fotos/galeria/juvenil-canto.webp', 'Jóvenes cantando', 'Congreso juvenil Íntimo y Eterno 2026', null, 36, true),
  ('/fotos/galeria/juvenil-escenario.webp', 'Adoración en el congreso juvenil', 'Congreso juvenil Íntimo y Eterno 2026', null, 37, true),
  ('/fotos/galeria/juvenil-foto.webp', 'Foto grupal del congreso', 'Congreso juvenil Íntimo y Eterno 2026', null, 38, true),
  ('/fotos/galeria/juvenil-hermanas.webp', 'Las jóvenes del congreso', 'Congreso juvenil Íntimo y Eterno 2026', null, 39, true),
  ('/fotos/galeria/juvenil-torta.webp', 'Celebración del congreso juvenil', 'Congreso juvenil Íntimo y Eterno 2026', null, 40, true),
  ('/fotos/galeria/juvenil-lideres.webp', 'Líderes del ministerio juvenil', 'Congreso juvenil Íntimo y Eterno 2026', null, 41, true),
  ('/fotos/galeria/damas-congreso.webp', '16.° Congreso de Damas', 'Congreso de Damas 2026', null, 42, true),
  ('/fotos/galeria/damas-adoracion.webp', 'Hermanas adorando en el congreso', 'Congreso de Damas 2026', null, 43, true),
  ('/fotos/galeria/damas-grupo-1.webp', 'Grupo 1: Mujeres valientes', 'Congreso de Damas 2026', null, 44, true),
  ('/fotos/galeria/damas-grupo-2.webp', 'Grupo 2 del Ministerio con Damas', 'Congreso de Damas 2026', null, 45, true),
  ('/fotos/galeria/damas-grupo-3.webp', 'Grupo 3 del Ministerio con Damas', 'Congreso de Damas 2026', null, 46, true),
  ('/fotos/galeria/damas-grupo-6.webp', 'Grupo 6 del Ministerio con Damas', 'Congreso de Damas 2026', null, 47, true),
  ('/fotos/galeria/damas-invitados.webp', 'Hermanas con el invitado del congreso', 'Congreso de Damas 2026', null, 48, true),
  ('/fotos/galeria/bautismo-rio.webp', 'Bautismo en el río', 'Bautismo en aguas 2026', null, 49, true),
  ('/fotos/galeria/bautismo-grupo.webp', 'Los bautizados con sus carteles', 'Bautismo en aguas 2026', null, 50, true),
  ('/fotos/galeria/bautismo-grupo-2.webp', 'Foto grupal del bautismo', 'Bautismo en aguas 2026', null, 51, true),
  ('/fotos/galeria/evangelismo-oracion.webp', 'Orando con un vecino en el evangelismo', 'Evangelismo', null, 52, true),
  ('/fotos/galeria/evangelismo-folleto.webp', 'Compartiendo el mensaje en la calle', 'Evangelismo', null, 53, true),
  ('/fotos/galeria/evangelismo-pan.webp', 'Hermanas compartiendo pan', 'Evangelismo', null, 54, true),
  ('/fotos/galeria/evangelismo-guitarra.webp', 'Música en el parque durante el evangelismo', 'Evangelismo', null, 55, true),
  ('/fotos/galeria/evangelismo-cajon.webp', 'Cajón y guitarra en el evangelismo', 'Evangelismo', null, 56, true),
  ('/fotos/galeria/infantil-maestra.webp', 'Una maestra de Misión Infantil', 'Misión Infantil', null, 57, true),
  ('/fotos/galeria/infantil-clase.webp', 'Clase de Misión Infantil', 'Misión Infantil', null, 58, true),
  ('/fotos/galeria/infantil-maestra-2.webp', 'Enseñanza para los niños', 'Misión Infantil', null, 59, true),
  ('/fotos/galeria/infantil-maestro.webp', 'Un maestro enseñando a los niños', 'Misión Infantil', null, 60, true),
  ('/fotos/galeria/dedicacion-familia.webp', 'Una familia en la dedicación de su bebé', 'Dedicación de niños', null, 61, true),
  ('/fotos/galeria/dedicacion-oracion.webp', 'Oración por las familias en la dedicación', 'Dedicación de niños', null, 62, true),
  ('/fotos/alabanza-voz.webp', 'Alabanza en el Congreso de la Familia', 'Congreso de la Familia 2026', null, 101, true),
  ('/fotos/familia-abrazo.webp', 'Abrazo durante el congreso, con el lema "Yo y mi casa serviremos al Señor"', 'Congreso de la Familia 2026', null, 102, true),
  ('/fotos/oracion-congregacion.webp', 'La congregación en oración', 'Congreso de la Familia 2026', null, 103, true),
  ('/fotos/alabanza-bajo.webp', 'Bajista del equipo de alabanza', 'Congreso de la Familia 2026', null, 104, true),
  ('/fotos/predicador.webp', 'Predicación en el congreso', 'Congreso de la Familia 2026', null, 105, true),
  ('/fotos/familia-pareja.webp', 'Una pareja abrazada durante el culto', 'Congreso de la Familia 2026', null, 106, true),
  ('/fotos/adoracion-congregacion.webp', 'Adoración con las manos en alto frente al escenario', 'Congreso de la Familia 2026', null, 107, true),
  ('/fotos/alabanza-teclado.webp', 'Teclado y batería en la alabanza', 'Congreso de la Familia 2026', null, 108, true),
  ('/fotos/oracion-hermana.webp', 'Una hermana orando', 'Congreso de la Familia 2026', null, 109, true),
  ('/fotos/adoracion-voz.webp', 'Voz principal de la alabanza', 'Congreso de la Familia 2026', null, 110, true),
  ('/fotos/jovenes-oracion.webp', 'Un joven en oración', 'Congreso de la Familia 2026', null, 111, true),
  ('/fotos/oracion-abrazo.webp', 'Hermanos abrazados orando juntos', 'Congreso de la Familia 2026', null, 112, true),
  ('/fotos/damas.webp', 'Hermanas de la iglesia', 'Congreso de la Familia 2026', null, 113, true),
  ('/fotos/bautismo-familias.webp', 'Bautizados junto a sus familias', 'Bautismo en aguas 2026', null, 114, true),
  ('/fotos/bautismo-abrazo.webp', 'Abrazo después del bautismo', 'Bautismo en aguas 2026', null, 115, true),
  ('/fotos/mistura.webp', 'Preparando la comida en la Gran Mistura', 'Gran Mistura', null, 116, true);
