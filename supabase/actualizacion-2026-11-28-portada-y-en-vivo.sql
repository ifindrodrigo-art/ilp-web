-- =====================================================================
-- Actualización del 28/11/2026 (2): portada en alta resolución y botón
-- "Cultos en vivo" que se pone rojo en horario de transmisión.
--
-- Cómo usarla: Supabase → SQL Editor → New query → pega todo → Run.
-- Se puede correr más de una vez.
-- =====================================================================

begin;

-- 1. Portada: la misma foto del local, pero desde el archivo original (4032 px)
update public.settings set hero_image_url = '/fotos/portada-interior.webp' where id = 1;

-- 2. Qué reuniones se transmiten en vivo (se cambia en el panel: Horarios → "Se transmite en vivo")
alter table public.schedules add column if not exists streamed boolean not null default false;
update public.schedules set streamed = true where recurrence = 'weekly' and day in (0, 2);

commit;

-- Para revisar
select name, day, start_time, streamed from public.schedules order by sort;
