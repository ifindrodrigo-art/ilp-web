---
name: Iglesia Los Productores
description: Web clara y editorial, como una revista; fondo rosado muy suave, titulares enormes y livianos, un solo rojo usado como contorno y tinta, y fotos reales de la iglesia a sangre.
basedOn: "Diabla (Refero Styles), adaptado a ILP el 21/11/2026"
theme: light
colors:
  canvas: "#FCF0F3"
  tint: "#F5E2E7"
  ink: "#333333"
  muted: "#5E5558"
  black: "#000000"
  white: "#FFFFFF"
  red: "#ED2E38"
  red-ink: "#C81E2A"
  line: "#D9C7CC"
  border: "#857A7D"
  success: "#15803D"
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
    color: "{colors.red-ink}"
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
    borderColor: "{colors.red}"
    textColor: "{colors.red-ink}"
    rounded: "{rounded.button}"
    height: "46px"
    padding: "0 25px"
  button-secondary:
    backgroundColor: "transparent"
    borderColor: "{colors.black}"
    textColor: "{colors.black}"
    rounded: "{rounded.button}"
  button-on-photo:
    backgroundColor: "transparent"
    borderColor: "{colors.white}"
    textColor: "{colors.white}"
  input:
    backgroundColor: "rgba(255,255,255,0.45)"
    borderColor: "{colors.border}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: "48px"
---

# Iglesia Los Productores

## Overview

La web se lee como una revista: fondo rosado muy suave (nunca blanco puro), titulares enormes en peso liviano con interlineado apretado, mucho aire y un solo color fuerte, el rojo, usado como tinta y contorno. La estructura viene del estilo **Diabla** de Refero Styles; la identidad es de ILP: sus datos, sus fotos y el mensaje *familia*.

Nada de cajas, sombras ni esquinas redondeadas en fotos: los bloques se separan con aire y líneas finas color tinta. Las fotos van a sangre y son las que ponen el color y la calidez.

## Colors

Contraste calculado (WCAG) sobre el fondo `canvas`:

| Uso | Color | Contraste |
|---|---|---|
| Texto principal | `ink` | 11.4:1 |
| Texto secundario | `muted` | 6.5:1 |
| Texto rojo pequeño (etiquetas, menú, botones, links) | `red-ink` | 5.1:1 |
| Rojo de marca (bordes de botón, titulares grandes, fechas, wordmark) | `red` | 3.7:1 (solo texto grande o bordes) |
| Borde de inputs | `border` | 3.7:1 |
| Botón secundario | `black` | 18.9:1 |
| Éxito en formularios | `success` | ≈4.6:1 |

- **Rojo** es el único color: wordmark, menú, etiquetas, contorno de botones, fechas grandes. Nunca como relleno de botón ni de fondo.
- `red` (#ED2E38) solo para bordes y texto grande (24 px o más); para texto pequeño se usa `red-ink` (#C81E2A), que sí pasa 4.5:1.
- **Fondo** `canvas` en toda la web; `tint` solo para fotos que aún no llegan.
- `line` solo para divisores decorativos; las separaciones importantes van con línea `ink`.

## Typography

- **Inter Tight** (peso 300) para titulares, en tamaños grandes con interlineado 0.9 a 1: la versión libre más cercana a la Helvetica Neue Light del estilo de referencia.
- **Inter** (peso 400) para todo lo demás. Un solo peso: la jerarquía sale del tamaño, el color (rojo o tinta) y las mayúsculas.
- Etiquetas y menú en mayúsculas de 13 px con tracking 0.08em, en `red-ink`. Títulos de tarjeta en mayúsculas de 16 px.
- Cuerpo de 17 px (16 px en celular), más grande que el de la referencia (14 px) porque el público incluye adultos mayores.
- Fuentes alojadas en el sitio con `font-display: swap`. Horarios y fechas con cifras tabulares.

## Layout

- Riel de 1200 px, gutter de 24 px (16 px en celular), secciones separadas por 80 px (56 px en celular).
- **Encabezado** fijo de 72 px sobre el fondo: Nosotros, Ministerios y Eventos a la izquierda; wordmark "los productores" (o el logo) al centro; Prédicas, Galería, Contacto y el botón "Visítanos" a la derecha. En celular: wordmark + botón de menú.
- **Inicio**: titular gigante centrado ("Más que una iglesia, una familia") con etiqueta arriba, datos abajo y una flecha roja → horarios en fila con líneas finas → próximo evento entre dos líneas → bienvenida (foto + texto) → ministerios en grilla de 3 → última prédica → galería → cómo llegar → "¿Es tu primera vez?" → pie.
- Cuando se sube la foto principal, el titular pasa a ir en blanco sobre la foto a sangre, con un degradado oscuro medido para que se lea.
- Ministerios, pastores y galería en grilla de 3 columnas iguales (2 en tablet, 1 en celular). Nunca mosaicos irregulares.

## Elevation & Depth

Plano, como papel impreso. Sin sombras. La única excepción es la línea fina bajo el encabezado al bajar.

## Shapes

Botones y chips con radio de 14 px. Fotos, inputs y bloques con esquinas rectas.

## Components

- **Botón principal**: contorno rojo de 1 px, fondo transparente, texto `red-ink` en mayúsculas de 13 px, 46 px de alto. Al pasar el mouse, un velo rojo muy suave.
- **Botón secundario**: el mismo, en negro. Sobre foto: el mismo, en blanco.
- **Horario**: línea fina arriba, día en etiqueta roja, hora grande liviana, nombre de la reunión.
- **Evento**: fecha grande en rojo (o "Pronto" si no está confirmada), título, fecha en texto, lugar. Si tiene flyer, el título, la fecha y el lugar también van como texto real.
- **Ministerio**: foto 4:5 a sangre, etiqueta roja con el público, nombre en mayúsculas, lema u horario, botón "Conoce más".
- **Formularios**: etiquetas en mayúsculas encima, inputs rectos con borde `border`, errores en `red-ink` debajo de cada campo.
- **Íconos**: trazo de 1.75 px, solo los necesarios (flecha, ubicación, menú).

## Motion

Entrada del titular con fundido y subida de 16 px en 600 ms; fotos con un zoom muy leve al pasar el mouse. Con `prefers-reduced-motion`: sin movimiento.

## Imagery

- Fotos reales de la iglesia, horizontales, luminosas y sin filtros pesados: culto, alabanza, gente, familias, fachada e interior del local.
- Retratos de pastores pueden ir en blanco y negro, como los perfiles de la referencia.
- WebP/AVIF responsivas, con ancho y alto declarados y carga diferida fuera de la primera pantalla. Texto alternativo que describa la escena.
- Sin caras de niños sin permiso de los padres.

## Do's and Don'ts

- Do: fondo `canvas` siempre; nunca blanco puro.
- Do: el rojo como tinta y contorno; `red-ink` para texto pequeño.
- Do: titulares grandes y livianos; un solo peso en el texto.
- Do: fotos a sangre, sin esquinas redondeadas.
- Don't: botones rellenos de rojo, sombras, negritas, otros colores de acento.
- Don't: fotos de stock, testimonios o cifras inventadas, carruseles que giran solos, video con sonido automático.
- Don't: flyers como única fuente de información.
