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
          background: "#FFFFFF",
          color: "#0E0E10",
        }}
      >
        <div style={{ fontSize: 28, color: "#13264F", marginBottom: 24, letterSpacing: 3, textTransform: "uppercase" }}>Ate Vitarte, Lima · Asambleas de Dios del Perú</div>
        <div style={{ fontSize: 96, color: "#0E0E10", lineHeight: 0.95, letterSpacing: -3 }}>Iglesia Los Productores</div>
        <div style={{ fontSize: 40, color: "#13264F", marginTop: 28 }}>¡Más que una iglesia, una familia!</div>
      </div>
    ),
    size,
  );
}
