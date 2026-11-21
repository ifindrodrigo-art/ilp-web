-- Da permiso de administrador (panel /admin) a un usuario.
-- 1) Crea el usuario en Supabase → Authentication → Users → Add user (correo y contraseña).
-- 2) Cambia el correo de abajo, pega esto en SQL Editor y dale Run.
-- Repite con cada persona del equipo de Comunicaciones que vaya a editar.

insert into public.admins (user_id)
select id from auth.users where email = 'CORREO@EJEMPLO.COM'
on conflict (user_id) do nothing;

-- Para ver quiénes son administradores:
-- select u.email from public.admins a join auth.users u on u.id = a.user_id;

-- Para quitarle el permiso a alguien:
-- delete from public.admins where user_id = (select id from auth.users where email = 'CORREO@EJEMPLO.COM');
