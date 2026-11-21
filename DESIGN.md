---
name: Iglesia Los Productores
description: Web blanca y editorial, como una revista; texto negro, el azul oscuro del logo como único color, titulares grandes y livianos, y fotos reales de la iglesia a sangre.
basedOn: "Estructura de Diabla (Refero Styles) con los colores de ILP: blanco, negro y azul oscuro. 21/11/2026"
theme: light
colors:
  canvas: "#FFFFFF"
  tint: "#F2F4F8"
  ink: "#0E0E10"
  muted: "#4F5662"
  accent: "#13264F"
  line: "#E2E5EB"
  border: "#7A8190"
  white: "#FFFFFF"
  success: "#15803D"
  danger: "#B42318"
typography:
  display:
    fontFamily: "Inter Tight Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(52px, 9.4vw, 110px)"
    fontWeight: 300
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Inter Tight Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(36px, 5vw, 64px)"
    fontWeight: 300
    lineHeight: 0.98
  subheading:
    fontFamily: "Inter Tight Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(26px, 3vw, 33px)"
    fontWeight: 300
    lineHeight: 1.13
  card-title:
    fontFamily: "Inter Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    textTransform: uppercase
    letterSpacing: "0.04em"
  eyebrow:
    fontFamily: "Inter Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    textTransform: uppercase
    letterSpacing: "0.08em"
    color: "{colors.accent}"
  body:
    fontFamily: "Inter Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontSizeMobile: "16px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  button: "14px"
  card: "0px"
  input: "0px"
spacing:
  unit: "4px"
  gutter: "24px"
  gutter-mobile: "16px"
  section: "80px"
  section-mobile: "56px"
  rail: "1200px"
  header: "72px"
components:
  button-primary:
    backgroundColor: "transparent"
    borderColor: "{colors.accent}"
    textColor: "{colors.accent}"
    rounded: "{rounded.button}"
    height: "46px"
    padding: "0 25px"
  button-secondary:
    backgroundColor: "transparent"
    borderColor: "{colors.ink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
  button-on-photo:
    backgroundColor: "transparent"
    borderColor: "{colors.white}"
    textColor: "{colors.white}"
  input:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.border}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: "48px"
---

# Iglesia Los Productores

## Overview

La web se lee como una revista: fondo blanco, texto negro, titulares grandes en peso liviano y un solo color, el **azul oscuro del logo** de ILP, usado como tinta y contorno. La estructura (titulares enormes, botones de contorno, grillas de 3, fotos a sangre, nada de sombras) viene del estilo Diabla de Refero Styles; los colores, el logo, las fotos y el mensaje *familia* son de ILP.

Las fotos reales de la iglesia ponen el color y la calidez: alabanza con luces azules, gente orando, familias abrazadas.

## Colors

Contraste calculado (WCAG) sobre blanco:

| Uso | Color | Contraste |
|---|---|---|
| Texto principal | `ink` (#0E0E10) | 19.3:1 |
| Texto secundario | `muted` (#4F5662) | 7.4:1 |
| Azul: etiquetas, menú, botones, links, fechas, logo | `accent` (#13264F) | 14.8:1 |
| Borde de inputs | `border` (#7A8190) | 3.9:1 |
| Errores de formulario | `danger` (#B42318) | 6.6:1 |
| Confirmaciones | `success` (#15803D) | 5.0:1 |

- **Azul oscuro** es el único color de la interfaz: logo, menú, etiquetas, contorno de botones, fechas grandes. Nunca como fondo de bloques.
- **Negro** para titulares y texto; `muted` para datos de apoyo.
- `tint` solo para el fondo de fotos que aún no llegan (con el logo tenue encima).
- `line` solo para divisores decorativos; las separaciones importantes van con línea `ink`.
- Rojo (`danger`) solo en errores de formularios, siempre con ícono y texto.

## Typography

- **Inter Tight** (peso 300) para titulares, grandes y con interlineado 0.9 a 1.
- **Inter** (peso 400) para todo lo demás. Un solo peso: la jerarquía sale del tamaño, el color (azul o negro) y las mayúsculas.
- Etiquetas y menú en mayúsculas de 13 px con tracking 0.08em, en azul. Títulos de tarjeta en mayúsculas de 16 px.
- Cuerpo de 17 px (16 px en celular). Fuentes alojadas en el sitio con `font-display: swap`. Horarios y fechas con cifras tabulares.

## Layout

- Riel de 1200 px, gutter de 24 px (16 px en celular), secciones separadas por 80 px (56 px en celular).
- **Encabezado** blanco fijo de 72 px: Nosotros, Ministerios y Eventos a la izquierda; logo + "Iglesia Los Productores" al centro; Prédicas, Galería, Contacto y "Visítanos" a la derecha. En celular: logo + botón de menú.
- **Inicio**: foto de la alabanza a sangre con el titular en blanco abajo a la izquierda (degradado oscuro medido) → horarios en fila con líneas finas → próximo evento → bienvenida (foto + texto) → ministerios en grilla de 3 (primero los que tienen foto) → prédica → galería → cómo llegar → "¿Es tu primera vez?" → pie.
- **En celular**, la foto principal va arriba y el titular debajo, sobre blanco, para no tapar a las personas.

## Elevation & Depth

Plano, como papel impreso. Sin sombras. La única excepción es la línea fina bajo el encabezado al bajar.

## Shapes

Botones y chips con radio de 14 px. Fotos, inputs y bloques con esquinas rectas.

## Components

- **Botón principal**: contorno azul de 1 px, fondo transparente, texto azul en mayúsculas de 13 px, 46 px de alto. Al pasar el mouse, un velo azul muy suave.
- **Botón secundario**: el mismo, en negro. Sobre foto: el mismo, en blanco.
- **Horario**: línea fina arriba, día en etiqueta azul, hora grande liviana, nombre de la reunión.
- **Evento**: fecha grande en azul (o "Pronto" si no está confirmada), título, fecha en texto y lugar. Si tiene flyer, el título, la fecha y el lugar también van como texto real.
- **Ministerio**: foto 4:5 a sangre (o el logo tenue si no hay foto), etiqueta azul con el público, nombre en mayúsculas, lema u horario, botón "Conoce más".
- **Formularios**: etiquetas en mayúsculas encima, inputs rectos con borde `border`, errores en `danger` debajo de cada campo.

## Imagery

- Banco inicial: 17 fotos del Instagram de la iglesia (Congreso de la Familia 2026, Bautismo en aguas 2026 y Gran Mistura), en `public/fotos`. Se recortaron para quitar las marcas de los posts y se guardaron en WebP.
- Logo: versión en azul oscuro sobre transparente (`public/logo.png`), hecha a partir del logo blanco de la iglesia. Si Comunicaciones tiene el archivo original en alta calidad o vectorial, se reemplaza.
- Sin fotos de niños ni adolescentes con la cara visible hasta tener el permiso de los padres; por eso Niños, Teens, Varones y Misiones todavía no tienen foto.
- WebP responsivas, con ancho y alto declarados y carga diferida fuera de la primera pantalla. Texto alternativo que describa la escena.

## Do's and Don'ts

- Do: fondo blanco, texto negro y el azul del logo como único color.
- Do: titulares grandes y livianos; un solo peso en el texto.
- Do: fotos reales de ILP a sangre, sin esquinas redondeadas.
- Don't: botones rellenos, sombras, negritas, otros colores de acento.
- Don't: fotos de stock, testimonios o cifras inventadas, carruseles que giran solos, video con sonido automático.
- Don't: flyers como única fuente de información.
