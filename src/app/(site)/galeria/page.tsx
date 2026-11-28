import type { Metadata } from "next";
import GalleryExplorer from "@/components/GalleryExplorer";
import PageHead from "@/components/PageHead";
import { VelocityText } from "@/components/motion/Effects";
import { getContent } from "@/lib/content";
import { albumsOf } from "@/lib/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galería",
  description: "Fotos de cultos, congresos, campamentos y eventos de la Iglesia Los Productores.",
  alternates: { canonical: "/galeria" },
};

export default async function Galeria() {
  const { gallery, settings } = await getContent();
  const albums = albumsOf(gallery);
  const picks = albums.slice(0, 6).map((a) => a.cover);

  return (
    <>
      <PageHead
        eyebrow="Galería"
        title="Así vivimos la fe juntos"
        intro={`${gallery.length} fotos en ${albums.length} álbumes: cultos, congresos, campamentos, bautismos y momentos en familia.`}
        images={[picks[1], picks[0], picks[3]].filter(Boolean).map((g) => ({ src: g.image_url, alt: g.caption || "Foto de la iglesia" }))}
      />

      <VelocityText items={albums.slice(0, 8).map((a) => a.name)} />

      {gallery.length === 0 ? (
        <section className="section container">
          <div className="card empty">
            <h2 className="h-md">Pronto subiremos fotos</h2>
            <p className="muted">Mientras tanto, mira nuestras fotos más recientes en Instagram.</p>
            {settings.instagram_url && (
              <a className="btn btn-ghost" href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                Ver Instagram
              </a>
            )}
          </div>
        </section>
      ) : (
        <GalleryExplorer albums={albums} />
      )}
    </>
  );
}
