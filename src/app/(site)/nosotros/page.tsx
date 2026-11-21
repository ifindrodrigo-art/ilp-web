import type { Metadata } from "next";
import Photo from "@/components/Photo";
import PageHead from "@/components/PageHead";
import { FirstVisit } from "@/components/Sections";
import { getContent } from "@/lib/content";
import { HISTORY } from "@/lib/seed";
import { MOTTO } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Iglesia de las Asambleas de Dios del Perú en Ate Vitarte desde 2004. Nuestra historia y nuestro equipo pastoral.",
  alternates: { canonical: "/nosotros" },
};

export default async function Nosotros() {
  const { settings, team } = await getContent();
  const beliefs = [
    { title: "Visión", text: settings.vision },
    { title: "Misión", text: settings.mission },
  ].filter((b) => b.text);

  return (
    <>
      <PageHead
        eyebrow="Nosotros"
        title={MOTTO}
        intro="Somos la Iglesia Los Productores, una iglesia de las Asambleas de Dios del Perú (Región Lima Este) en Ate Vitarte. Desde el 27 de febrero de 2004 buscamos transmitir vida a través de nuestra vida."
      />

      {beliefs.length > 0 && (
        <section className="section container" aria-label="Visión y misión">
          <div className="grid" style={{ ["--min" as string]: "320px" }}>
            {beliefs.map((b) => (
              <div key={b.title} className="card stack" style={{ gap: 12 }}>
                <h2 className="h-md">{b.title}</h2>
                <p className="muted" style={{ whiteSpace: "pre-line" }}>{b.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {settings.beliefs && (
        <section className="section container" aria-labelledby="t-creemos">
          <h2 id="t-creemos" className="h-lg" style={{ marginBottom: 24 }}>En qué creemos</h2>
          <p className="prose">{settings.beliefs}</p>
        </section>
      )}

      {team.length > 0 && (
        <section className="section container" aria-labelledby="t-pastores">
          <h2 id="t-pastores" className="h-lg" style={{ marginBottom: 32 }}>Nuestros pastores</h2>
          <div className="grid" style={{ ["--min" as string]: "260px" }}>
            {team.map((p) => (
              <div key={p.id} className="card-link">
                <Photo src={p.image_url} alt={p.name} ratio="4 / 5" sizes="(max-width: 900px) 100vw, 33vw" />
                <div className="ministry-body">
                  {p.role && <span className="eyebrow">{p.role}</span>}
                  <span className="h-sm">{p.name}</span>
                  {p.bio && <p className="muted" style={{ fontSize: 15 }}>{p.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section container" aria-labelledby="t-historia">
        <div className="split" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 20, position: "sticky", top: "calc(var(--header) + 24px)" }}>
            <h2 id="t-historia" className="h-lg">Nuestra historia</h2>
            <p className="muted">
              Más de veinte años creciendo como familia: congresos, campamentos, viajes misioneros y, en 2024, la dedicación de nuestro nuevo local.
            </p>
            <Photo src={settings.welcome_image_url} alt="El local de la iglesia" />
          </div>
          <ol className="timeline">
            {HISTORY.map((h) => (
              <li key={h.year}>
                <span className="timeline-year">{h.year}</span>
                <ul>
                  {h.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section container" aria-label="Primera visita" style={{ paddingTop: 0 }}>
        <FirstVisit settings={settings} />
      </section>
    </>
  );
}
