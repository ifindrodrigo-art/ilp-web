import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Gallery from "@/components/Gallery";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galería",
  description: "Fotos de cultos, congresos, campamentos y eventos de la Iglesia Los Productores.",
  alternates: { canonical: "/galeria" },
};

export default async function Galeria() {
  const { gallery, settings } = await getContent();
  const albums = [...new Set(gallery.map((g) => g.album || "Fotos de la iglesia"))];

  return (
    <>
      <PageHead eyebrow="Galería" title="Así vivimos la fe juntos" intro="Cultos, congresos, campamentos y momentos en familia." />
      <section className="section container">
        {gallery.length === 0 ? (
          <div className="card empty">
            <h2 className="h-md">Pronto subiremos fotos</h2>
            <p className="muted">Mientras tanto, mira nuestras fotos más recientes en Instagram.</p>
            {settings.instagram_url && (
              <a className="btn btn-ghost" href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                Ver Instagram
              </a>
            )}
          </div>
        ) : (
          <div className="stack" style={{ gap: 48 }}>
            {albums.map((a) => (
              <div key={a} className="stack" style={{ gap: 20 }}>
                {albums.length > 1 && <h2 className="h-md">{a}</h2>}
                <Gallery items={gallery.filter((g) => (g.album || "Fotos de la iglesia") === a)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
