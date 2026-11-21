import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenido" className="container" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="empty">
        <span className="label">Error 404</span>
        <h1 className="h-lg">Esta página no existe</h1>
        <p className="muted">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn btn-primary" href="/">
            Volver al inicio
          </Link>
          <Link className="btn btn-ghost" href="/visitanos">
            Horarios y cómo llegar
          </Link>
        </div>
      </div>
    </main>
  );
}
