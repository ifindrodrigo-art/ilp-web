-- =====================================================================
-- Actualización del 28/11/2026: cultos de YouTube en Prédicas, fotos de
-- Teens, Varones y Familia, 64 fotos de Instagram en la galería y fechas
-- de los álbumes. Portada y foto de bienvenida en alta resolución.
--
-- Cómo usarla: Supabase → SQL Editor → New query → pega todo → Run.
-- Se puede correr más de una vez sin duplicar nada.
-- =====================================================================

begin;

-- 1. Cultos (Prédicas)
insert into public.sermons (title, youtube_id, preached_on, published)
select v.title, v.youtube_id, v.preached_on::date, true
from (values
  ('Congreso de Alabanza · Día 1', 'kwKt_vQtxcQ', '2026-11-27'),
  ('Segundo servicio', 'MemLxHpb7Uo', '2026-11-22'),
  ('Campaña evangelística', 'wDQf0ABfyko', '2026-11-22'),
  ('Culto de damas', 'bny5teDruBo', '2026-11-20'),
  ('Congreso de la Familia · Segundo servicio', 'P0-IVLilQp4', '2026-11-15'),
  ('Congreso de la Familia · Día central', 'IF1blcfcvbo', '2026-11-15'),
  ('Congreso de la Familia · Día 1', '0JYljxMQSjY', '2026-11-14'),
  ('Ayuno y Santa Cena', 'VcFoHilHoyk', '2026-11-01'),
  ('Vigilia unida', 'Vab4P9ZS8iI', '2026-10-31'),
  ('Congreso de Intercesión · Día central', '6prJ9LuyO-Y', '2026-10-25'),
  ('Congreso juvenil «Íntimo y Eterno»', 'gLnP8bE9VTA', '2026-10-10'),
  ('Congreso juvenil «Íntimo y Eterno» · Día 1', 'WMMyVtOGkn0', '2026-10-09'),
  ('Día del Pastor', 'VuXSoa8PtIs', '2026-07-07'),
  ('Congreso de Damas «Restauradas»', '_5rENj1-KmU', '2026-05-31'),
  ('Culto juvenil', 'CdZAhotYuqM', '2026-03-01'),
  ('Aniversario 22 «Volviendo a nuestro primer amor» · Día 1', 'pQN5U0gDnCk', '2026-02-17')
) as v(title, youtube_id, preached_on)
where not exists (select 1 from public.sermons s where s.youtube_id = v.youtube_id);

-- 2. Fotos de ministerios que faltaban (solo si no subiste otra desde el panel)
update public.ministries set image_url = '/fotos/ministerios/teens.webp' where slug = 'teens' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/varones.webp' where slug = 'varones' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/familia.webp' where slug = 'familia' and (image_url is null or image_url like '/fotos/%');

-- 3. Portada y bienvenida en alta resolución
update public.settings set hero_image_url = '/fotos/portada-hd.webp' where id = 1 and hero_image_url = '/fotos/portada.webp';
update public.settings set welcome_image_url = '/fotos/familia-abrazo-hd.webp' where id = 1 and welcome_image_url = '/fotos/familia-abrazo.webp';

-- 4. Fechas de los álbumes (ordenan la galería del más reciente al más antiguo)
update public.gallery set taken_on = '2026-10-10' where album = 'Congreso juvenil Íntimo y Eterno 2026' and taken_on is null;
update public.gallery set taken_on = '2026-05-31' where album = 'Congreso de Damas 2026' and taken_on is null;
update public.gallery set taken_on = '2026-06-14' where album = 'Bautismo en aguas 2026' and taken_on is null;
update public.gallery set taken_on = '2026-02-01' where album = 'Dedicación de niños' and taken_on is null;
update public.gallery set taken_on = '2026-11-15' where album = 'Congreso de la Familia 2026' and taken_on is null;
update public.gallery set taken_on = '2026-07-19' where album = 'Gran Mistura' and taken_on is null;

-- 5. Fotos de Instagram de la iglesia y de Xtreme Teens
insert into public.gallery (image_url, caption, album, taken_on, sort, published)
select v.image_url, v.caption, v.album, v.taken_on::date, v.sort, true
from (values
  ('/fotos/ig/ayuno-santa-cena-2026/01.webp', 'Hermanos orando juntos en el ayuno', 'Ayuno y Santa Cena 2026', '2026-09-07', 200),
  ('/fotos/ig/ayuno-santa-cena-2026/02.webp', 'Una hermana adorando con las manos abiertas', 'Ayuno y Santa Cena 2026', '2026-09-07', 201),
  ('/fotos/ig/ayuno-santa-cena-2026/03.webp', 'Adoración durante el ayuno', 'Ayuno y Santa Cena 2026', '2026-09-07', 202),
  ('/fotos/ig/ayuno-santa-cena-2026/04.webp', 'Una hermana adora en el culto', 'Ayuno y Santa Cena 2026', '2026-09-07', 203),
  ('/fotos/ig/ayuno-santa-cena-2026/05.webp', 'La Santa Cena servida para la iglesia', 'Ayuno y Santa Cena 2026', '2026-09-07', 204),
  ('/fotos/ig/martes-de-oracion/01.webp', 'Hermanas orando en el martes de oración', 'Martes de oración', '2026-09-22', 205),
  ('/fotos/ig/martes-de-oracion/02.webp', 'Una hermana en oración', 'Martes de oración', '2026-09-22', 206),
  ('/fotos/ig/martes-de-oracion/03.webp', 'Clamor en el martes de oración', 'Martes de oración', '2026-09-22', 207),
  ('/fotos/ig/festikids-2026/01.webp', 'Una maestra anima a los niños en el FestiKids', 'FestiKids 2026', '2026-08-30', 208),
  ('/fotos/ig/festikids-2026/02.webp', 'Maestras de Misión Infantil en el escenario', 'FestiKids 2026', '2026-08-30', 209),
  ('/fotos/ig/festikids-2026/03.webp', 'Los niños reunidos en el FestiKids', 'FestiKids 2026', '2026-08-30', 210),
  ('/fotos/ig/festikids-2026/04.webp', 'Niños atentos en el FestiKids', 'FestiKids 2026', '2026-08-30', 211),
  ('/fotos/ig/festikids-2026/05.webp', 'Juegos en el FestiKids', 'FestiKids 2026', '2026-08-30', 212),
  ('/fotos/ig/festikids-2026/06.webp', 'Niños con sus regalos', 'FestiKids 2026', '2026-08-30', 213),
  ('/fotos/ig/festikids-2026/07.webp', 'El escenario del FestiKids', 'FestiKids 2026', '2026-08-30', 214),
  ('/fotos/ig/festikids-2026/08.webp', 'Niños del FestiKids', 'FestiKids 2026', '2026-08-30', 215),
  ('/fotos/ig/fiestas-patrias-2026/01.webp', 'La iglesia con la camiseta del Perú', 'Fiestas Patrias 2026', '2026-07-26', 216),
  ('/fotos/ig/fiestas-patrias-2026/02.webp', 'Un abrazo entre hermanos', 'Fiestas Patrias 2026', '2026-07-26', 217),
  ('/fotos/ig/fiestas-patrias-2026/03.webp', 'Oración por el Perú', 'Fiestas Patrias 2026', '2026-07-26', 218),
  ('/fotos/ig/bautismo-2026/01.webp', 'Los bautizados con sus túnicas blancas', 'Bautismo en aguas 2026', '2026-06-14', 219),
  ('/fotos/ig/bautismo-2026/02.webp', 'Foto grupal del bautismo', 'Bautismo en aguas 2026', '2026-06-14', 220),
  ('/fotos/ig/bautismo-2026/03.webp', 'Testimonio antes del bautismo', 'Bautismo en aguas 2026', '2026-06-14', 221),
  ('/fotos/ig/dedicacion-2026/01.webp', 'Una familia con el certificado de dedicación', 'Dedicación de niños', '2026-02-01', 222),
  ('/fotos/ig/dedicacion-2026/02.webp', 'Oración por un niño en la dedicación', 'Dedicación de niños', '2026-02-01', 223),
  ('/fotos/ig/bautismo-2025/01.webp', 'Bautismo en el río', 'Bautismo en aguas 2025', '2025-11-09', 224),
  ('/fotos/ig/bautismo-2025/02.webp', 'Un hermano desciende a las aguas', 'Bautismo en aguas 2025', '2025-11-09', 225),
  ('/fotos/ig/bautismo-2025/03.webp', 'Bautismo en aguas', 'Bautismo en aguas 2025', '2025-11-09', 226),
  ('/fotos/ig/bautismo-2025/04.webp', 'Alegría después del bautismo', 'Bautismo en aguas 2025', '2025-11-09', 227),
  ('/fotos/ig/bautismo-2025/05.webp', 'Bienvenido a tu nueva vida', 'Bautismo en aguas 2025', '2025-11-09', 228),
  ('/fotos/ig/bautismo-2025/06.webp', 'Los bautizados reunidos en el campo', 'Bautismo en aguas 2025', '2025-11-09', 229),
  ('/fotos/ig/bautismo-2025/07.webp', 'Una hermana recibe su certificado de bautismo', 'Bautismo en aguas 2025', '2025-11-09', 230),
  ('/fotos/ig/mision-ancon-2025/01.webp', 'Adoración en el primer culto en Ancón', 'Misión Ancón 2025', '2025-04-27', 231),
  ('/fotos/ig/mision-ancon-2025/02.webp', 'Hermanos reunidos en Ancón', 'Misión Ancón 2025', '2025-04-27', 232),
  ('/fotos/ig/mision-ancon-2025/03.webp', 'Predicación en el anexo de Ancón', 'Misión Ancón 2025', '2025-04-27', 233),
  ('/fotos/ig/mision-ancon-2025/04.webp', 'El local del anexo de Ancón', 'Misión Ancón 2025', '2025-04-27', 234),
  ('/fotos/ig/mision-ancon-2025/05.webp', 'Compartiendo con los vecinos de Ancón', 'Misión Ancón 2025', '2025-04-27', 235),
  ('/fotos/ig/mision-ancon-2025/06.webp', 'Oración en Ancón', 'Misión Ancón 2025', '2025-04-27', 236),
  ('/fotos/ig/mision-ancon-2025/07.webp', 'Sirviendo en Ancón', 'Misión Ancón 2025', '2025-04-27', 237),
  ('/fotos/ig/mision-ancon-2025/08.webp', 'Hermanos sirviendo en la misión', 'Misión Ancón 2025', '2025-04-27', 238),
  ('/fotos/ig/seminario-intercesion-2025/01.webp', 'El bajista de la alabanza', 'Seminario de Intercesión 2025', '2025-10-26', 239),
  ('/fotos/ig/seminario-intercesion-2025/02.webp', 'Guitarra en la alabanza', 'Seminario de Intercesión 2025', '2025-10-26', 240),
  ('/fotos/ig/aniversario-22/01.webp', 'El escenario del aniversario', 'Aniversario 22', '2026-02-17', 241),
  ('/fotos/ig/aniversario-22/02.webp', 'Alabanza en el aniversario', 'Aniversario 22', '2026-02-17', 242),
  ('/fotos/ig/aniversario-22/03.webp', 'Guitarra acústica en el aniversario', 'Aniversario 22', '2026-02-17', 243),
  ('/fotos/ig/aniversario-22/04.webp', 'La iglesia orando en el aniversario', 'Aniversario 22', '2026-02-17', 244),
  ('/fotos/ig/aniversario-22/05.webp', 'Un hermano adora con las manos en alto', 'Aniversario 22', '2026-02-17', 245),
  ('/fotos/ig/aniversario-22/06.webp', 'Adoración en el aniversario', 'Aniversario 22', '2026-02-17', 246),
  ('/fotos/ig/aniversario-22/07.webp', 'La congregación en el aniversario', 'Aniversario 22', '2026-02-17', 247),
  ('/fotos/ig/aniversario-22/08.webp', 'Hermanas adorando', 'Aniversario 22', '2026-02-17', 248),
  ('/fotos/ig/aniversario-22/09.webp', 'Un abrazo en el aniversario', 'Aniversario 22', '2026-02-17', 249),
  ('/fotos/ig/varones-2026/01.webp', 'Varones orando en el campamento', 'Campamento de varones', '2026-06-07', 250),
  ('/fotos/ig/xtreme-teens-2026/01.webp', 'Equipo naranja del campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 251),
  ('/fotos/ig/xtreme-teens-2026/02.webp', 'Equipo rojo del campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 252),
  ('/fotos/ig/xtreme-teens-2026/03.webp', 'Equipo azul del campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 253),
  ('/fotos/ig/xtreme-teens-2026/04.webp', 'Equipo verde del campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 254),
  ('/fotos/ig/xtreme-teens-2026/05.webp', 'Los teens del campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 255),
  ('/fotos/ig/xtreme-teens-2026/06.webp', 'Juegos en el campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 256),
  ('/fotos/ig/xtreme-teens-2026/07.webp', 'Competencias del campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 257),
  ('/fotos/ig/xtreme-teens-2026/08.webp', 'Juegos por equipos', 'Campamento Xtreme Teens 2026', '2026-02-14', 258),
  ('/fotos/ig/xtreme-teens-2026/09.webp', 'Teens en el campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 259),
  ('/fotos/ig/xtreme-teens-2026/10.webp', 'Juegos al aire libre', 'Campamento Xtreme Teens 2026', '2026-02-14', 260),
  ('/fotos/ig/xtreme-teens-2026/11.webp', 'Premiación en el campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 261),
  ('/fotos/ig/xtreme-teens-2026/12.webp', 'Atardecer en el campamento', 'Campamento Xtreme Teens 2026', '2026-02-14', 262),
  ('/fotos/ig/xtreme-teens-2026/13.webp', 'Los teens en el escenario', 'Campamento Xtreme Teens 2026', '2026-02-14', 263)
) as v(image_url, caption, album, taken_on, sort)
where not exists (select 1 from public.gallery g where g.image_url = v.image_url);

commit;

-- Para revisar
select (select count(*) from public.sermons) as cultos, (select count(*) from public.gallery) as fotos;
