# Iglesia Los Productores — web

Web oficial de la Iglesia Los Productores (ILP), Ate Vitarte, Lima. Hecha para que una persona nueva sepa en segundos cuándo venir y cómo llegar, y para que el equipo de Comunicaciones la actualice sin tocar código.

Diseño y producto: `DESIGN.md` (estilo Mercury adaptado a ILP) y `PRODUCT.md`.

## Qué tiene

| Página | Qué muestra |
|---|---|
| `/` | Portada: horarios, próximo evento, ministerios, última prédica, galería, cómo llegar |
| `/nosotros` | Quiénes somos, historia desde 2004, pastores (cuando se publiquen), visión y misión (cuando se llenen) |
| `/ministerios` y `/ministerios/<nombre>` | Una página por ministerio |
| `/eventos` | Próximos eventos por mes |
| `/predicas` | Videos de YouTube |
| `/galeria` | Fotos por álbum |
| `/visitanos` | Horarios, mapa y formulario "Soy nuevo" |
| `/contacto` | Petición de oración, WhatsApp y redes |
| `/admin` | **Panel** con login para editar todo lo anterior y ver los formularios |

## Tecnología

- **Next.js 15** + TypeScript (páginas que Google indexa bien)
- **Supabase**: base de datos, login del panel y fotos
- **Vercel**: hosting gratis; cada cambio que se sube a GitHub se publica solo

Sin las variables de Supabase, la web funciona en **modo demostración** con el contenido inicial (sin panel ni formularios).

## Puesta en marcha (una sola vez)

### 1. Supabase
1. Entra a **supabase.com** → crea una cuenta → **New project**. Región: **South America (São Paulo)**. Guarda la contraseña de la base de datos en un lugar seguro.
2. **SQL Editor → New query** → pega todo `supabase/schema.sql` → **Run**. Esto crea las tablas, la seguridad y carga los datos de la iglesia (horarios, ministerios, eventos).
3. **Authentication → Users → Add user → Create new user**: correo y contraseña de quien va a manejar el panel. Marca **Auto Confirm User**.
4. **SQL Editor → New query** → pega `supabase/hacer-admin.sql`, cambia `CORREO@EJEMPLO.COM` por ese correo → **Run**. Repite los pasos 3 y 4 por cada persona del equipo.
5. **Project Settings → API Keys**: copia la **Project URL** y la **Publishable key**.

### 2. Vercel
1. Entra a **vercel.com** → **Sign up with GitHub**.
2. **Add New → Project** → importa **ilp-web**.
3. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = la Project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = la Publishable key
4. **Deploy**. La web queda en `ilp-web.vercel.app` (o el nombre que Vercel le asigne).

### 3. Panel
1. Entra a `tu-web/admin` con el correo del paso 1.3.
2. En **Ajustes** carga el **WhatsApp oficial**, el **logo**, la **foto principal** (horizontal, del culto o la alabanza) y la foto de bienvenida.
3. En **Pastores**, publica a cada pastor solo cuando haya aceptado aparecer.

Lo que se edita en el panel aparece en la web en **alrededor de un minuto**.

### 4. Google (para que salga al buscar la iglesia)
1. **search.google.com/search-console** → **Agregar propiedad → Prefijo de URL** → la dirección de la web.
2. Verificación **Etiqueta HTML**: copia solo el valor de `content="..."` en la variable `NEXT_PUBLIC_GOOGLE_VERIFICATION` de Vercel → vuelve a desplegar → **Verificar**.
3. **Sitemaps** → envía `sitemap.xml`.

### 5. Dominio propio (opcional)
Si la iglesia compra un dominio (por ejemplo `iglesialosproductores.com`), se conecta en Vercel → **Settings → Domains**. Luego pon esa dirección en la variable `NEXT_PUBLIC_SITE_URL` y vuelve a desplegar.

## Actualizaciones de la base de datos

Cuando se agregan columnas o contenido nuevo a una web que ya está en línea, va un archivo aparte en `supabase/` que se corre una vez en Supabase → SQL Editor (no borra nada y se puede repetir):

- `actualizacion-2026-11-22-fotos.sql`: pastores con foto, fotos de ministerios, 43 fotos de galería y la columna para la foto del pastor fundador.
- `actualizacion-2026-11-28-videos-y-fotos.sql`: 16 cultos de YouTube, fotos de Teens, Varones y Familia, 64 fotos de Instagram y fechas de los álbumes.

`schema.sql` es solo para un proyecto nuevo: borra y crea todo.

## Espacio y planes gratuitos

- Las fotos del panel se achican antes de subir (máximo 2000 px, WebP): unos 300 a 600 KB cada una. El 1 GB gratuito de Supabase alcanza para más de 1500 fotos.
- Las fotos optimizadas se guardan 31 días en Vercel (`minimumCacheTTL`), para no gastar el límite mensual de conversiones.
- Vercel llama a `/api/keepalive` una vez al día (`vercel.json`), para que Supabase no pause el proyecto por inactividad.

## Antes de compartirla con la iglesia

- [ ] WhatsApp o teléfono oficial y un correo (Ajustes)
- [ ] Logo en buena calidad (PNG sin fondo)
- [ ] Al menos 10 fotos buenas, una horizontal muy buena para la portada
- [ ] Permiso para mostrar fotos de niños y adolescentes, o la regla de no mostrar sus caras
- [ ] Horarios confirmados con los pastores
- [ ] Quién recibe y responde los formularios

## Reglas de contenido

- Solo datos confirmados: un horario viejo hace que la gente llegue a una reunión que ya no existe.
- Fotos reales de la iglesia, nunca de stock. Sin caras de niños sin permiso.
- No inventar testimonios, cifras, visión ni creencias.
- Los formularios tienen datos personales: solo los ven los administradores; bórralos cuando ya no hagan falta.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # opcional: sin variables corre en modo demostración
npm run dev                  # http://localhost:3000
```

Volver a correr `supabase/schema.sql` **borra todo** lo cargado desde el panel. Úsalo solo para empezar de cero.
