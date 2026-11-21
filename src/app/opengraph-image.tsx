import { ImageResponse } from "next/og";

export const alt = "Iglesia Los Productores: ¡Más que una iglesia, una familia!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#FCF0F3",
          color: "#333333",
        }}
      >
        <div style={{ fontSize: 28, color: "#C81E2A", marginBottom: 24, letterSpacing: 3, textTransform: "uppercase" }}>Ate Vitarte, Lima · Asambleas de Dios del Perú</div>
        <div style={{ fontSize: 96, color: "#333333", lineHeight: 0.95, letterSpacing: -3 }}>Iglesia Los Productores</div>
        <div style={{ fontSize: 40, color: "#ED2E38", marginTop: 28 }}>¡Más que una iglesia, una familia!</div>
      </div>
    ),
    size,
  );
}
