import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import SermonBrowser from "@/components/SermonBrowser";
import VideoEmbed from "@/components/VideoEmbed";
import { Magnetic, SplitHeading, VelocityText } from "@/components/motion/Effects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";
import { formatTime } from "@/lib/format";
import { SPECIAL_VIDEOS } from "@/lib/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Prédicas",
  description: "Mira los cultos y prédicas de la Iglesia Los Productores. Transmitimos en vivo cada domingo.",
  alternates: { canonical: "/predicas" },
};

export default async function Predicas() {
  const { sermons, settings, schedules } = await getContent();
  const sundays = schedules.filter((s) => s.recurrence === "weekly" && s.day === 0).map((s) => formatTime(s.start_time));

  return (
    <>
      <PageHead
        eyebrow="Prédicas"
        title="¿Te perdiste el culto?"
        intro="Cada domingo transmitimos en vivo por Facebook, y los cultos quedan en nuestro canal de YouTube."
        images={[
          { src: "/fotos/predicador.webp", alt: "Predicación en la iglesia" },
          { src: "/fotos/ministerios/alabanza.webp", alt: "Adoración en el culto" },
          { src: "/fotos/galeria/biblia.webp", alt: "Una Biblia abierta" },
        ]}
      >
        <div className="btn-row">
          {settings.live_url && (
            <Magnetic>
              <a className="btn btn-primary" href={settings.live_url} target="_blank" rel="noopener noreferrer">
                <span className="live-dot" aria-hidden="true" />
                Ver en vivo en Facebook
              </a>
            </Magnetic>
          )}
          {settings.youtube_url && (
            <a className="btn btn-ghost" href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              Canal de YouTube
            </a>
          )}
        </div>
      </PageHead>

      <VelocityText items={["En vivo cada domingo", ...sundays, "Martes de oración", "Iglesia Los Productores"]} tone="outline" />

      <section className="section container" aria-label="Cultos">
        {sermons.length === 0 ? (
          <div className="card empty">
            <h2 className="h-md">Muy pronto subiremos las prédicas aquí</h2>
            <p className="muted">Mientras tanto, encuentra todos los cultos en nuestro canal de YouTube.</p>
          </div>
        ) : (
          <SermonBrowser sermons={sermons} />
        )}
      </section>

      <section className="section container" aria-labelledby="t-especiales" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div className="stack">
            <span className="eyebrow">Videos especiales</span>
            <SplitHeading id="t-especiales" className="h-lg" text="Nuestra historia en video" />
          </div>
        </div>
        <RevealGroup className="grid" style={{ ["--min" as string]: "300px", gap: 28 }}>
          {SPECIAL_VIDEOS.slice(0, 3).map((v) => (
            <RevealItem key={v.id} className="stack" style={{ gap: 12 }}>
              <VideoEmbed id={v.id} title={v.title} />
              <span className="h-sm">{v.title}</span>
              {v.note && <span className="muted" style={{ fontSize: 15 }}>{v.note}</span>}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="join-band" aria-labelledby="t-envivo">
        <div className="container join-inner">
          <Reveal className="stack" style={{ gap: 16 }}>
            <span className="eyebrow">En vivo</span>
            <h2 id="t-envivo" className="h-lg">Acompáñanos este domingo{sundays.length ? `, ${sundays.join(" y ")}` : ""}</h2>
            <p>En persona en Calle Arequipa 303, Tilda, Ate, o desde casa por Facebook.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic>
              <Link className="btn btn-light" href="/visitanos">
                Planea tu visita
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
