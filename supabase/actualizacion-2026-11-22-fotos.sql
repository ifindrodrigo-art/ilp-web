-- =====================================================================
-- Actualización del 22/11/2026: pastores con foto, fotos de ministerios,
-- 43 fotos nuevas en la galería y espacio para la foto del pastor fundador.
--
-- Cómo usarla: Supabase → SQL Editor → New query → pega todo → Run.
-- Se puede correr más de una vez sin duplicar nada, y no borra lo que
-- hayas subido desde el panel.
-- =====================================================================

begin;

-- 1. Foto del pastor fundador (se sube luego desde el panel: Ajustes)
alter table public.settings add column if not exists founder_image_url text;

-- 2. Pastores: los que ya existen se actualizan y publican; los que faltan se agregan

update public.team set role = 'Pastor principal', image_url = '/fotos/pastores/ramiro-mauricio.webp', sort = 1, published = true where name = 'Ramiro Mauricio';
update public.team set role = 'Pastora principal', image_url = '/fotos/pastores/july-valenzuela.webp', sort = 2, published = true where name = 'July Valenzuela';
update public.team set role = 'Pastora', image_url = '/fotos/pastores/zenovia-palacin.webp', sort = 3, published = true where name = 'Zenovia Palacin';
update public.team set role = 'Pastor · Xtreme Teens', image_url = '/fotos/pastores/david-mauricio.webp', sort = 4, published = true where name = 'David Mauricio';
update public.team set role = 'Pastora', image_url = '/fotos/pastores/alice-mauricio.webp', sort = 5, published = true where name = 'Alice Mauricio';
update public.team set role = 'Pastor', image_url = '/fotos/pastores/franklin-santamaria.webp', sort = 6, published = true where name = 'Franklin Santamaria';
update public.team set role = 'Pastora', image_url = '/fotos/pastores/marcelina.webp', sort = 7, published = true where name = 'Marcelina';

insert into public.team (name, role, image_url, sort, published)
select v.name, v.role, v.image_url, v.sort, true
from (values
  ('Ramiro Mauricio', 'Pastor principal', '/fotos/pastores/ramiro-mauricio.webp', 1),
  ('July Valenzuela', 'Pastora principal', '/fotos/pastores/july-valenzuela.webp', 2),
  ('Zenovia Palacin', 'Pastora', '/fotos/pastores/zenovia-palacin.webp', 3),
  ('David Mauricio', 'Pastor · Xtreme Teens', '/fotos/pastores/david-mauricio.webp', 4),
  ('Alice Mauricio', 'Pastora', '/fotos/pastores/alice-mauricio.webp', 5),
  ('Franklin Santamaria', 'Pastor', '/fotos/pastores/franklin-santamaria.webp', 6),
  ('Marcelina', 'Pastora', '/fotos/pastores/marcelina.webp', 7)
) as v(name, role, image_url, sort)
where not exists (select 1 from public.team t where t.name = v.name);

-- 3. Fotos de los ministerios (solo si no subiste otra desde el panel)
update public.ministries set image_url = '/fotos/ministerios/ninos.webp' where slug = 'ninos' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/jovenes.webp' where slug = 'jovenes' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/alabanza.webp' where slug = 'alabanza' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/damas.webp' where slug = 'damas' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/misiones.webp' where slug = 'misiones' and (image_url is null or image_url like '/fotos/%');
update public.ministries set image_url = '/fotos/ministerios/oracion.webp' where slug = 'oracion' and (image_url is null or image_url like '/fotos/%');

-- 4. Galería: las fotos anteriores bajan de orden y las nuevas van primero
update public.gallery set sort = sort + 100
where image_url like '/fotos/%' and image_url not like '/fotos/galeria/%' and sort < 100;

insert into public.gallery (image_url, caption, album, sort, published)
select v.image_url, v.caption, v.album, v.sort, true
from (values
  ('/fotos/galeria/culto-interior.webp', 'Un domingo de culto en el local de la iglesia', 'Vida de iglesia', 20),
  ('/fotos/galeria/adoracion-hermanas.webp', 'Hermanas adorando durante el culto', 'Vida de iglesia', 21),
  ('/fotos/galeria/biblia.webp', 'Una Biblia abierta durante la prédica', 'Vida de iglesia', 22),
  ('/fotos/galeria/oracion-pastor.webp', 'Un pastor ora por un hermano', 'Vida de iglesia', 23),
  ('/fotos/galeria/musica-escenario.webp', 'Músicos en el escenario', 'Vida de iglesia', 24),
  ('/fotos/galeria/dia-del-pastor.webp', 'Celebración del Día del Pastor', 'Vida de iglesia', 25),
  ('/fotos/galeria/alabanza-equipo.webp', 'El equipo de alabanza en pleno', 'Alabanza', 26),
  ('/fotos/galeria/alabanza-cielo.webp', 'Adoración con la mano en alto', 'Alabanza', 27),
  ('/fotos/galeria/alabanza-teclado-2.webp', 'Teclado en la alabanza', 'Alabanza', 28),
  ('/fotos/galeria/alabanza-bajo-2.webp', 'Bajista del equipo de alabanza', 'Alabanza', 29),
  ('/fotos/galeria/alabanza-coros.webp', 'Voces de la alabanza', 'Alabanza', 30),
  ('/fotos/galeria/alabanza-voces.webp', 'Cantantes del equipo de alabanza', 'Alabanza', 31),
  ('/fotos/galeria/alabanza-banda.webp', 'La banda tocando en el culto', 'Alabanza', 32),
  ('/fotos/galeria/juvenil-grupo.webp', 'Los jóvenes en el congreso Íntimo y Eterno', 'Congreso juvenil Íntimo y Eterno 2026', 33),
  ('/fotos/galeria/juvenil-adoracion.webp', 'Jóvenes adorando con las manos en alto', 'Congreso juvenil Íntimo y Eterno 2026', 34),
  ('/fotos/galeria/juvenil-polos.webp', 'Jóvenes con los polos del congreso', 'Congreso juvenil Íntimo y Eterno 2026', 35),
  ('/fotos/galeria/juvenil-canto.webp', 'Jóvenes cantando', 'Congreso juvenil Íntimo y Eterno 2026', 36),
  ('/fotos/galeria/juvenil-escenario.webp', 'Adoración en el congreso juvenil', 'Congreso juvenil Íntimo y Eterno 2026', 37),
  ('/fotos/galeria/juvenil-foto.webp', 'Foto grupal del congreso', 'Congreso juvenil Íntimo y Eterno 2026', 38),
  ('/fotos/galeria/juvenil-hermanas.webp', 'Las jóvenes del congreso', 'Congreso juvenil Íntimo y Eterno 2026', 39),
  ('/fotos/galeria/juvenil-torta.webp', 'Celebración del congreso juvenil', 'Congreso juvenil Íntimo y Eterno 2026', 40),
  ('/fotos/galeria/juvenil-lideres.webp', 'Líderes del ministerio juvenil', 'Congreso juvenil Íntimo y Eterno 2026', 41),
  ('/fotos/galeria/damas-congreso.webp', '16.° Congreso de Damas', 'Congreso de Damas 2026', 42),
  ('/fotos/galeria/damas-adoracion.webp', 'Hermanas adorando en el congreso', 'Congreso de Damas 2026', 43),
  ('/fotos/galeria/damas-grupo-1.webp', 'Grupo 1: Mujeres valientes', 'Congreso de Damas 2026', 44),
  ('/fotos/galeria/damas-grupo-2.webp', 'Grupo 2 del Ministerio con Damas', 'Congreso de Damas 2026', 45),
  ('/fotos/galeria/damas-grupo-3.webp', 'Grupo 3 del Ministerio con Damas', 'Congreso de Damas 2026', 46),
  ('/fotos/galeria/damas-grupo-6.webp', 'Grupo 6 del Ministerio con Damas', 'Congreso de Damas 2026', 47),
  ('/fotos/galeria/damas-invitados.webp', 'Hermanas con el invitado del congreso', 'Congreso de Damas 2026', 48),
  ('/fotos/galeria/bautismo-rio.webp', 'Bautismo en el río', 'Bautismo en aguas 2026', 49),
  ('/fotos/galeria/bautismo-grupo.webp', 'Los bautizados con sus carteles', 'Bautismo en aguas 2026', 50),
  ('/fotos/galeria/bautismo-grupo-2.webp', 'Foto grupal del bautismo', 'Bautismo en aguas 2026', 51),
  ('/fotos/galeria/evangelismo-oracion.webp', 'Orando con un vecino en el evangelismo', 'Evangelismo', 52),
  ('/fotos/galeria/evangelismo-folleto.webp', 'Compartiendo el mensaje en la calle', 'Evangelismo', 53),
  ('/fotos/galeria/evangelismo-pan.webp', 'Hermanas compartiendo pan', 'Evangelismo', 54),
  ('/fotos/galeria/evangelismo-guitarra.webp', 'Música en el parque durante el evangelismo', 'Evangelismo', 55),
  ('/fotos/galeria/evangelismo-cajon.webp', 'Cajón y guitarra en el evangelismo', 'Evangelismo', 56),
  ('/fotos/galeria/infantil-maestra.webp', 'Una maestra de Misión Infantil', 'Misión Infantil', 57),
  ('/fotos/galeria/infantil-clase.webp', 'Clase de Misión Infantil', 'Misión Infantil', 58),
  ('/fotos/galeria/infantil-maestra-2.webp', 'Enseñanza para los niños', 'Misión Infantil', 59),
  ('/fotos/galeria/infantil-maestro.webp', 'Un maestro enseñando a los niños', 'Misión Infantil', 60),
  ('/fotos/galeria/dedicacion-familia.webp', 'Una familia en la dedicación de su bebé', 'Dedicación de niños', 61),
  ('/fotos/galeria/dedicacion-oracion.webp', 'Oración por las familias en la dedicación', 'Dedicación de niños', 62)
) as v(image_url, caption, album, sort)
where not exists (select 1 from public.gallery g where g.image_url = v.image_url);

commit;

-- Para revisar: debería mostrar 7 pastores publicados
select name, role, published from public.team order by sort;
