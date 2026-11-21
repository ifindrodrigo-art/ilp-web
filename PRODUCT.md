# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (sin app instalable / PWA, decidido el 21/11/2026)

## Users

- **Visitante nuevo**: vecino de Ate Vitarte y Lima Este, o alguien invitado por un miembro ("Ven y trae un invitado"). Llega desde Google, un link de WhatsApp o Instagram. Quiere saber en 10 segundos cuándo son los cultos, cómo llegar y qué esperar en su primera visita.
- **Miembros y familias de la iglesia**: buscan el próximo evento o congreso, la prédica del domingo, las fotos del último evento y cómo inscribirse.
- **Jóvenes, adolescentes y padres de niños**: entran a la página de su ministerio (Misión Juvenil, Xtreme Teens, Misión Infantil) para ver horarios y actividades.
- **Equipo de Comunicaciones (administradores)**: publica eventos, avisos, horarios y fotos desde un panel con login, sin tocar código.
- **Pastores y líderes**: reciben los formularios de "Soy nuevo" y "Petición de oración".

## Product Purpose

La web oficial de la Iglesia Los Productores (ILP): la puerta de entrada para quien no conoce la iglesia y el lugar donde los miembros encuentran todo lo que hoy está repartido entre Facebook, Instagram, YouTube y TikTok. Éxito: un visitante nuevo sabe cuándo venir y cómo llegar sin tener que escribir por privado, y el equipo de Comunicaciones actualiza eventos y avisos en minutos.

## Positioning

"¡Más que una iglesia, una familia!" La palabra que más usa la iglesia es *familia*, y es el hilo de toda la web: fotos reales de la gente, tono cálido y cercano, y los ministerios presentados como partes de una misma familia (niños, teens, jóvenes, damas, varones, familia).

## Operating Context

- Se usa sobre todo en celular, muchas veces con datos móviles; también se comparte por WhatsApp e Instagram.
- Los cultos en vivo se transmiten por Facebook; las prédicas quedan en YouTube (@IglesiaLosProductores).
- Hay un evento grande casi cada mes (aniversario en febrero, congresos de Damas, Varones, Jóvenes, Intercesión y Familia, bautismos, Festi Kids), así que la sección de eventos cambia constantemente y la mantiene el equipo de Comunicaciones.

## Capabilities and Constraints

- **Stack** (mismo esquema que OfiMatch): Next.js 15 + TypeScript (páginas estáticas para Google), Supabase (Postgres, Auth, Row Level Security, Storage para fotos), hosting en Vercel con despliegue automático desde GitHub.
- **Páginas**: Inicio, Nosotros (historia y pastores), Horarios y ubicación, Ministerios (una página por ministerio), Eventos, Prédicas, Galería, Contacto (con "Soy nuevo" y "Petición de oración") y Panel admin.
- **Base de datos propia (Supabase)**: eventos, horarios, avisos, ministerios, galería, prédicas destacadas y respuestas de formularios. El panel admin edita todo esto; la web pública solo lee.
- **Google**: sitemap, robots, datos estructurados de iglesia (dirección, horarios, redes) y Search Console, para aparecer al buscar "iglesia en Ate" o "Iglesia Los Productores".
- **YouTube**: el último culto o prédica se muestra con carga diferida (solo se carga el video al tocarlo).
- **Formularios**: los datos personales (nombre, teléfono, pedido de oración) solo los ven los administradores autorizados; nunca son públicos.
- **No construido / fuera de alcance por ahora**: app instalable, ofrendas en línea, transmisión en vivo propia, cuentas para miembros.

## Brand Commitments

- Nombre: Iglesia Los Productores (ILP). Asambleas de Dios del Perú, Región Lima Este, Sector 1. Fundada el 27 de febrero de 2004.
- Lema principal: "¡Más que una iglesia, una familia!". Frase secundaria: "Transmitir vida a través de nuestra vida".
- Logo: casita con personas dentro, sobre fondo azul (pendiente la versión en alta calidad).
- Voz: español peruano, cálido y familiar, con un versículo cuando aporta. Frases propias de la iglesia: "Ven y trae un invitado", "No te pierdas la bendición", "Familia Los Productores".
- Estilo de sus flyers: letra manuscrita elegante con títulos gruesos condensados, fotos con tonos cálidos (cobre, marrón) o azules.

## Evidence on Hand

- Perfil recopilado de Instagram y Facebook el 15/11/2026 (doc "Iglesia Los Productores — Info para la página web"): identidad, horarios, dirección, historia desde 2012, calendario anual de eventos y datos de 9 ministerios.
- Dirección: Calle Arequipa 303, Tilda, Ate Vitarte (a espaldas del grifo Petroperú / al lado de la nueva SUNAT).
- Horarios publicados: martes 7 p.m. oración · sábado 3 p.m. Xtreme Teens · sábado 7 p.m. Misión Juvenil · domingo 10 a.m. y 5 p.m. culto central · primer domingo del mes, ayuno y Santa Cena de 8 a.m. a 7 p.m.
- Redes: IG @iglesialosproductores, FB iglesiaproductores (en vivo), YouTube @IglesiaLosProductores, TikTok @iglesialosproductores. Ministerios con cuenta propia: @mjproductores, @xtreme_teens_lp, @mininfantil_productores, @ilp.music.
- **No existen todavía**: contacto oficial (WhatsApp, teléfono o correo), visión, misión y declaración de fe, fotos de pastores, logo y fotos en alta calidad, líderes de cada ministerio. No inventarlos: se muestran como pendientes o la sección no se publica hasta tenerlos.

## Product Principles

1. Lo primero que ve un visitante nuevo: cuándo venir, dónde queda y cómo es la primera visita.
2. Fotos reales de la iglesia, nunca fotos de stock.
3. Solo datos confirmados: un horario viejo hace que la gente llegue a una reunión que ya no existe.
4. Cada ministerio tiene su espacio, pero todo se siente como una sola familia.
5. Que el equipo de Comunicaciones pueda mantenerla sin un programador.

## Accessibility & Inclusion

Público de todas las edades, desde adolescentes hasta adultos mayores, con celulares de gama media y conexión irregular: texto de 16 px o más, contraste alto, botones grandes, páginas livianas e imágenes optimizadas. No se muestran caras de niños sin permiso de los padres.

## Open Questions

- Contacto oficial (WhatsApp o teléfono y correo) para el botón "Escríbenos".
- Quién recibe y responde los formularios de "Soy nuevo" y "Petición de oración".
- Permiso para publicar fotos de niños y adolescentes, o regla de no mostrar sus caras.
- Dominio propio (por ejemplo iglesialosproductores.com) y quién lo paga cada año.
- Horarios vigentes confirmados (varios datos de ministerios son de 2021 a 2024).
- Quiénes del equipo tendrán acceso al panel admin.
