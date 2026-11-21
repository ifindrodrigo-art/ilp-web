---
name: Iglesia Los Productores
description: Web oscura y cinematográfica, como un culto de noche; lienzo casi negro azulado, tarjetas grafito planas, el azul del logo como única acción y fotos reales del culto a pantalla completa.
basedOn: "Mercury (Refero Styles), adaptado a ILP el 21/11/2026"
theme: dark
colors:
  canvas: "#13151F"
  card: "#1B1E2B"
  raised: "#252938"
  ivory: "#EDEDF3"
  ash: "#C3C3CC"
  slate: "#70707D"
  mist: "#E2E3ED"
  white: "#FFFFFF"
  brand: "#3B66D6"
  brand-hover: "#2F5BC9"
  link: "#9DB7F5"
  success: "#4ADE80"
  danger: "#F97066"
typography:
  display:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontStretch: "112%"
    fontSize: "64px"
    fontSizeMobile: "40px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0.01em"
  heading-lg:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontStretch: "112%"
    fontSize: "42px"
    fontSizeMobile: "32px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0.01em"
  heading:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontStretch: "112%"
    fontSize: "32px"
    fontSizeMobile: "26px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0.015em"
  heading-sm:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontStretch: "112%"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.015em"
  script:
    fontFamily: "Dancing Script Variable, cursive"
    fontSize: "1.15em"
    fontWeight: 600
    lineHeight: 1
  body-lg:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontSizeMobile: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.005em"
rounded:
  default: "4px"
  card: "12px"
  pill: "40px"
spacing:
  unit: "4px"
  gutter: "24px"
  gutter-mobile: "16px"
  section: "72px"
  section-mobile: "56px"
  card-padding: "32px"
  card-padding-mobile: "24px"
  element-gap: "12px"
  rail: "1200px"
  header: "72px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    borderColor: "{colors.mist}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ivory}"
    placeholderColor: "{colors.ash}"
    borderColor: "{colors.mist}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 20px"
  chip:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ash}"
    rounded: "{rounded.pill}"
    height: "32px"
---

# Iglesia Los Productores

## Overview

La web se siente como entrar a un culto de noche: un lienzo casi negro con un toque azul, las fotos del culto y la alabanza a pantalla completa, y texto marfil tranquilo encima. La estructura viene del estilo **Mercury** de Refero Styles (lienzo oscuro, tarjetas grafito planas, un solo color de acción, controles en píldora, mucho aire) y la identidad es de ILP: el azul del logo es el único color de acción, las fotos son de la iglesia y el mensaje es *familia*.

Todo es monocromático (marfil, gris y grafito) menos el azul. La calidez la ponen las fotos: las luces cálidas del escenario y la gente contrastan con la interfaz fría y la hacen sentir cercana, no corporativa.

**Valores provisionales**: el azul `brand` está aclarado a partir del azul del logo para que funcione sobre fondo oscuro. Cuando llegue el logo en alta calidad se ajusta el tono y se vuelve a calcular el contraste.

## Colors

Contraste calculado (WCAG):

| Uso | Par | Contraste |
|---|---|---|
| Texto principal | `ivory` sobre `canvas` / `card` | 15.6:1 / 14.2:1 |
| Texto secundario | `ash` sobre `canvas` / `card` | 10.4:1 / 9.5:1 |
| Botón principal | `white` sobre `brand` | 5.2:1 |
| Botón principal (hover) | `white` sobre `brand-hover` | 6.1:1 |
| Botón contra el fondo | `brand` sobre `canvas` | 3.5:1 |
| Links | `link` sobre `canvas` | 9.1:1 |
| Bordes de inputs y botones fantasma | `mist` sobre `canvas` | 14.2:1 |
| Divisores | `slate` sobre `canvas` | 3.7:1 |
| Error / éxito (solo formularios) | `danger` / `success` sobre `card` | 6.0:1 / 9.5:1 |

- **Lienzo** `canvas` para todo el fondo: hero, secciones y pie. **Tarjetas** `card` un paso más claro, sin sombra ni borde. `raised` para chips, botones secundarios rellenos y fondos de inputs al enfocar.
- **Azul** `brand` es el único color: solo para la acción principal de cada sección ("Planea tu visita", "Inscríbete", "Enviar") y el estado activo del menú. Nunca decorativo, nunca en íconos sueltos, nunca dos botones azules juntos.
- **Marfil** `ivory` para texto, íconos y botones fantasma. El blanco puro solo para el titular del hero y el texto de los botones azules.
- `link` (azul claro) para links dentro de párrafos.
- `success` y `danger` solo aparecen en formularios (confirmación y errores), siempre con ícono y texto.
- Los ministerios no tienen colores propios: se distinguen por sus fotos.

## Typography

- **Archivo** (variable, un poco ensanchada al 112%, peso 500) para titulares: la versión libre más cercana a la letra ancha y medida de Mercury. Nunca en negrita de 700; sin mayúsculas sostenidas.
- **Inter** (variable) para texto, menú, botones y formularios: cuerpo de 17 px (16 px en celular), interlineado 1.6; énfasis en 500. Etiquetas de 14 px como mínimo, porque el público incluye adultos mayores.
- **Toque ILP**: una sola palabra en letra manuscrita (Dancing Script, en marfil) en el titular del hero, como en sus flyers: "Más que una iglesia, una *familia*". Solo ahí, nunca en el resto de la página.
- Escala: 14 / 16 / 17 / 18 / 21 / 24 / 32 / 42 / 64. Fuentes alojadas en el sitio con `font-display: swap`.
- Horarios y fechas con cifras tabulares.

## Layout

- Riel de 1200 px, gutter de 24 px (16 px en celular). Secciones separadas por 72 px (56 px en celular). Tarjetas con 32 px de relleno (24 px en celular) y 12 px entre elementos.
- Pensado primero para celular; cortes en 375 / 768 / 1024 / 1440.
- **Encabezado** de 72 px, transparente sobre el hero; al bajar pasa a `canvas` al 80% con desenfoque de 16 px. Logo a la izquierda; Nosotros, Ministerios, Eventos, Prédicas y Galería al centro; "Ver en vivo" (fantasma) y "Visítanos" (azul) a la derecha. En celular: logo + botón de menú de 44 px que abre el menú a pantalla completa.
- **Inicio**, en este orden: Hero a pantalla completa → horarios de la semana (tarjetas) → próximo evento → bienvenida (texto + foto en dos columnas) → ministerios (grilla de tarjetas con foto) → última prédica → galería → cómo llegar → "¿Es tu primera vez?" → pie de página.
- Secciones que alternan texto/foto en dos columnas con grillas de 3 tarjetas, como en Mercury.
- **Panel admin**: mismo tema oscuro, más simple: lista + formulario, una tarea por pantalla.

## Elevation & Depth

Sin sombras. La separación viene solo del paso de `canvas` a `card` a `raised`. La única excepción es el menú abierto en celular, que cubre la pantalla con `canvas` sólido.

## Shapes

Píldora (40 px) para todo lo interactivo: botones, inputs, links del menú, chips. 12 px para tarjetas y fotos dentro de secciones. 4 px solo para elementos estructurales. El logo nunca se deforma ni se recolorea.

## Components

- **Hero**: foto del culto o la alabanza a pantalla completa (100svh), con un degradado de `canvas` del 35% arriba al 85% abajo, medido para que el texto quede por encima de 4.5:1. Contenido centrado de 640 px máximo: titular en blanco, una línea de apoyo en `ash`, botón azul "Planea tu visita" + botón fantasma "Ver en vivo", y debajo "Domingos 10:00 a.m. y 5:00 p.m. · Ate Vitarte". Si se usa video: corto, sin sonido, con botón de pausa, y foto fija si el usuario tiene activada la reducción de movimiento.
- **Tarjeta de horario**: día en `ash`, hora grande en Archivo con cifras tabulares, nombre de la reunión en marfil.
- **Tarjeta de ministerio**: foto con radio de 12 px arriba, nombre, día y hora, y un chip con el público (Niños, Teens, Jóvenes...).
- **Tarjeta de evento**: bloque de fecha (día grande, mes en `ash`), título, lugar y botón. Si tiene flyer, el título, la fecha y el lugar también van como texto real.
- **Prédica**: miniatura de YouTube con botón de reproducir; el video solo se carga al tocarlo.
- **Galería**: grilla con carga diferida y vista ampliada con flechas, teclado y botón de cerrar.
- **Cómo llegar**: dirección como texto, las dos referencias, botón "Abrir en Google Maps" y mapa con carga diferida (con filtro oscuro para que combine).
- **Formularios** (Soy nuevo, Petición de oración): inputs en píldora con borde `mist`, etiquetas visibles encima, errores debajo de cada campo en `danger` con ícono.
- **Íconos**: Lucide, trazo de 1.75 px, en marfil.

## Motion

- Hero: el titular aparece con fundido y sube 16 px en 500 ms (`cubic-bezier(0.16, 1, 0.3, 1)`). Tarjetas con escalonado de 40 ms al entrar en pantalla.
- Encabezado: transición de transparente a desenfocado en 200 ms al bajar.
- Hover y pulsado: 150 ms. Salidas más cortas que las entradas.
- Como máximo un efecto tipo Aceternity, en el hero (por ejemplo un brillo suave que sigue al cursor o el revelado del titular).
- Con `prefers-reduced-motion`: sin desplazamientos ni video, solo fundidos.

## Imagery

- Las fotos son el corazón del estilo: culto con luces del escenario, alabanza, gente, familias, fachada e interior del local nuevo. Horizontales, en alta resolución, con un leve tono frío y oscuro para que se integren al lienzo sin perder la calidez de la gente.
- Banco inicial: fotos y logo de Instagram y Facebook de la iglesia y sus ministerios. Sirven para la primera versión, pero están comprimidas: se reemplazan por las originales en alta calidad.
- Para el hero se necesita al menos una foto horizontal muy buena; es lo que más pesa en cómo se ve la web.
- WebP/AVIF responsivas, con ancho y alto declarados y carga diferida fuera de la primera pantalla. Texto alternativo que describa la escena.

## Do's and Don'ts

- Do: el azul solo para la acción principal de cada sección.
- Do: tarjetas `card` planas sobre `canvas`; separar con valor, no con sombras.
- Do: titulares en peso 500, nunca en negrita.
- Do: controles en píldora; esquinas rectas solo en lo estructural.
- Do: fotos reales de ILP a pantalla completa y con personas.
- Do: horarios y datos confirmados; si algo no está confirmado, no se publica.
- Don't: más colores de acento (nada de cobre, lima, verde o naranja en la interfaz).
- Don't: blanco puro para párrafos; siempre marfil.
- Don't: fotos de stock, caras de niños sin permiso de los padres, testimonios o cifras inventadas.
- Don't: emojis como íconos, texto con degradado, carruseles que giran solos sin pausa, video con sonido automático.
- Don't: flyers como única fuente de información.
