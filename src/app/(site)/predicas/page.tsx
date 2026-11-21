import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import VideoEmbed from "@/components/VideoEmbed";
import { getContent } from "@/lib/content";
import { capitalize, formatDate } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Prédicas",
  description: "Mira los cultos y prédicas de la Iglesia Los Productores. Transmitimos en vivo cada domingo.",
  alternates: { canonical: "/predicas" },
};

export default async function Predicas() {
  const { sermons, settings } = await getContent();
  const [first, ...rest] = sermons;

  return (
    <>
      <PageHead
        eyebrow="Prédicas"
        title="¿Te perdiste el culto?"
        intro="Cada domingo transmitimos en vivo por Facebook, y los cultos quedan en nuestro canal de YouTube."
      />
      <section className="section container">
        <div className="btn-row" style={{ marginBottom: 32 }}>
          {settings.live_url && (
            <a className="btn btn-primary" href={settings.live_url} target="_blank" rel="noopener noreferrer">
              <span className="live-dot" aria-hidden="true" />
              Ver en vivo en Facebook
            </a>
          )}
          {settings.youtube_url && (
            <a className="btn btn-ghost" href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              Canal de YouTube
            </a>
          )}
        </div>

        {!first ? (
          <div className="card empty">
            <h2 className="h-md">Muy pronto subiremos las prédicas aquí</h2>
            <p className="muted">Mientras tanto, encuentra todos los cultos en nuestro canal de YouTube.</p>
          </div>
        ) : (
          <div className="stack" style={{ gap: 48 }}>
            <article className="split-wide">
              <VideoEmbed id={first.youtube_id} title={first.title} />
              <div className="stack" style={{ gap: 12 }}>
                <span className="eyebrow">Lo más reciente</span>
                <h2 className="h-md">{first.title}</h2>
                <p className="muted">
                  {[first.preacher, first.preached_on ? capitalize(formatDate(first.preached_on)) : null].filter(Boolean).join(" · ")}
                </p>
              </div>
            </article>
            {rest.length > 0 && (
              <div className="grid" style={{ ["--min" as string]: "300px", gap: 24 }}>
                {rest.map((s) => (
                  <article key={s.id} className="stack" style={{ gap: 12 }}>
                    <VideoEmbed id={s.youtube_id} title={s.title} />
                    <h3 className="h-sm">{s.title}</h3>
                    <p className="label">
                      {[s.preacher, s.preached_on ? capitalize(formatDate(s.preached_on)) : null].filter(Boolean).join(" · ")}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
