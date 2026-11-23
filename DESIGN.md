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

- **Azul oscuro** es el único color de la interfaz: logo, menú, etiquetas, contorno de botones, fechas grandes. Como fondo, solo en la franja de números de Inicio (texto blanco, 14.8:1).
- **Negro** para titulares y texto; `muted` para datos de apoyo.
- `tint` para el fondo de fotos que aún no llegan (con el logo tenue encima) y para la franja "En memoria" de Nosotros.
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
- **Inicio**: foto de la alabanza a sangre con el titular en blanco abajo a la izquierda (degradado oscuro medido) → horarios en fila con líneas finas → próximo evento → franja azul de números → bienvenida (foto con paralaje + texto, con el fundador) → pastores principales → ministerios en grilla de 3 (primero los que tienen foto) → franja de fotos que avanza sola → prédica → cómo llegar → "¿Es tu primera vez?" → pie.
- **Nosotros**: titular → "En memoria" del pastor fundador → equipo pastoral → historia (foto antigua + línea de tiempo) → archivo de los primeros años → primera visita.
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
- **Pastor**: foto 4:5 a sangre, nombre en mayúsculas y cargo en gris. En Nosotros, con 7 pastores: 3 arriba más grandes y 4 abajo.
- **En memoria** (pastor fundador Macario Mauricio): franja `tint`, foto 4:5 (el logo tenue hasta que se suba su foto desde Ajustes), etiqueta "En memoria", nombre grande, versículo en azul con línea fina arriba. Tono sobrio, sin fechas inventadas.
- **Números**: franja en el azul del logo con cifras grandes livianas en blanco (años, ministerios, reuniones, pastores). Todas salen de los datos, ninguna se escribe a mano.

## Motion

Librería: Motion (`motion/react`), cargada con `LazyMotion` + `domAnimation`. Movimiento sereno, propio de una iglesia: nada rebota ni gira.

- Curva única: `cubic-bezier(0.16, 1, 0.3, 1)` (sale rápido y llega suave). Entradas de 0,6 a 0,9 s; escalonado de 80 a 90 ms entre tarjetas.
- **Portada**: las palabras del título suben desde detrás de una máscara; la foto entra con un acercamiento de 5 s (una sola vez) y baja más lento que la página (paralaje). El resto del texto entra con CSS para no depender de JavaScript.
- **Al bajar**: secciones y tarjetas aparecen con fundido y subida corta, una sola vez. La línea de tiempo dibuja su línea de izquierda a derecha.
- **Números**: cuentan desde 0 cuando aparecen.
- **Franja de fotos**: avanza sola muy despacio; se detiene al pasar el mouse, al enfocar con teclado y con el botón Pausar.
- **Accesibilidad**: con "reducir movimiento" no hay desplazamientos ni franja en movimiento (solo fundidos). Sin JavaScript todo se ve de inmediato. Lo de arriba de la pantalla nunca espera a JavaScript.

## Imagery

- Banco de fotos en `public/fotos` (WebP, máximo 1800 px):
  - `pastores/`: 7 retratos 4:5 recortados de las fotos que reunió Comunicaciones (noviembre de 2026).
  - `ministerios/`: fotos 4:5 de Niños, Jóvenes, Alabanza, Damas, Misiones y Oración.
  - `galeria/`: 43 fotos en álbumes (Vida de iglesia, Alabanza, Congreso juvenil, Congreso de Damas, Bautismo, Evangelismo, Misión Infantil, Dedicación de niños).
  - `historia/`: 11 fotos antiguas del archivo, sin bordes negros y sin enfocar de más (son de baja resolución: se muestran pequeñas).
  - Las 17 primeras, del Instagram de la iglesia, siguen en la raíz de `public/fotos`.
- Logo: versión en azul oscuro sobre transparente (`public/logo.png`), hecha a partir del logo blanco de la iglesia. Si Comunicaciones tiene el archivo original en alta calidad o vectorial, se reemplaza.
- Fotos con niños (Misión Infantil, Dedicación): publicadas por decisión de Comunicaciones; confirmar el permiso de los padres. Teens y Varones todavía no tienen foto.
- Las fotos subidas desde el panel se achican en el navegador (máximo 2000 px, WebP) antes de guardarse en Supabase.
- WebP responsivas, con ancho y alto declarados y carga diferida fuera de la primera pantalla. Texto alternativo que describa la escena.

## Do's and Don'ts

- Do: fondo blanco, texto negro y el azul del logo como único color.
- Do: titulares grandes y livianos; un solo peso en el texto.
- Do: fotos reales de ILP a sangre, sin esquinas redondeadas.
- Don't: botones rellenos, sombras, negritas, otros colores de acento.
- Don't: fotos de stock, testimonios o cifras inventadas, carruseles que giran solos sin botón de pausa, video con sonido automático.
- Don't: flyers como única fuente de información.
