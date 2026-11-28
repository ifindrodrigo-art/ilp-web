import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import Photo from "@/components/Photo";
import PageHead from "@/components/PageHead";
import { FirstVisit } from "@/components/Sections";
import { RevealPhoto } from "@/components/motion/Effects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Timeline from "@/components/motion/Timeline";
import { getContent } from "@/lib/content";
import { FOUNDER, HISTORY, HISTORY_PHOTOS } from "@/lib/seed";
import { MOTTO } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Iglesia de las Asambleas de Dios del Perú en Ate Vitarte, fundada en 2004 por el pastor Macario Mauricio. Nuestra historia y nuestro equipo pastoral.",
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
        images={[
          { src: "/fotos/galeria/culto-interior.webp", alt: "Un domingo de culto en la iglesia" },
          { src: "/fotos/historia/antigua-02.webp", alt: "La congregación en el primer local" },
          { src: "/fotos/ig/aniversario-22/07.webp", alt: "La congregación en el aniversario 22" },
        ]}
      />

      {/* En memoria del pastor fundador */}
      <section className="memorial" aria-labelledby="t-fundador">
        <div className="container memorial-inner">
          <Reveal className="memorial-photo">
            <RevealPhoto
              src={settings.founder_image_url ?? FOUNDER.photo}
              alt={`El pastor ${FOUNDER.name} junto a la pastora ${FOUNDER.wife}`}
              ratio="4 / 5"
              sizes="(max-width: 900px) 80vw, 380px"
            />
          </Reveal>
          <Reveal className="stack memorial-text" delay={0.15}>
            <span className="eyebrow">En memoria</span>
            <h2 id="t-fundador" className="h-lg">Pastor {FOUNDER.name}</h2>
            <p className="label">Fundador de la Iglesia Los Productores</p>
            <p className="lead">
              El pastor {FOUNDER.name} inició la Iglesia Los Productores en 2004, como anexo de la {FOUNDER.mother_church}. Junto a su esposa,
              la pastora {FOUNDER.wife}, sembró en Ate Vitarte la obra que hoy es nuestra familia.
            </p>
            <p className="muted">
              Ya partió a la presencia del Señor. Su legado sigue vivo en su familia, en sus hijos, los pastores {FOUNDER.sons}, y en cada vida
              que fue tocada por esta obra.
            </p>
            <blockquote className="memorial-verse">
              <p>“{FOUNDER.verse.text}”</p>
              <cite>{FOUNDER.verse.ref}</cite>
            </blockquote>
            <div className="stack" style={{ gap: 12, marginTop: 8 }}>
              <span className="label">Recuerdos</span>
              <Gallery items={FOUNDER.memories} className="memorial-gallery" />
            </div>
          </Reveal>
        </div>
      </section>

      {beliefs.length > 0 && (
        <section className="section container" aria-label="Visión y misión">
          <RevealGroup className="grid" style={{ ["--min" as string]: "320px" }}>
            {beliefs.map((b) => (
              <RevealItem key={b.title} className="card stack" style={{ gap: 12 }}>
                <h2 className="h-md">{b.title}</h2>
                <p className="muted" style={{ whiteSpace: "pre-line" }}>{b.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {settings.beliefs && (
        <section className="section container" aria-labelledby="t-creemos">
          <Reveal>
            <h2 id="t-creemos" className="h-lg" style={{ marginBottom: 24 }}>En qué creemos</h2>
            <p className="prose">{settings.beliefs}</p>
          </Reveal>
        </section>
      )}

      {team.length > 0 && (
        <section id="pastores" className="section container" aria-labelledby="t-pastores">
          <Reveal className="section-head">
            <div className="stack">
              <span className="eyebrow">Equipo pastoral</span>
              <h2 id="t-pastores" className="h-lg">Nuestros pastores</h2>
            </div>
          </Reveal>
          <RevealGroup className="team-grid">
            {team.map((p, i) => (
              <RevealItem key={p.id} className={team.length % 4 === 3 && i < 3 ? "is-top" : undefined}>
                <figure className="pastor-card">
                  <RevealPhoto src={p.image_url} alt={p.name} ratio="4 / 5" sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw" delay={(i % 4) * 0.08} />
                  <figcaption>
                    <span className="h-sm">{p.name}</span>
                    {p.role && <span className="label">{p.role}</span>}
                    {p.bio && <span className="muted" style={{ fontSize: 15 }}>{p.bio}</span>}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="section container" aria-labelledby="t-historia">
        <div className="split" style={{ alignItems: "start" }}>
          <Reveal className="stack history-aside" style={{ gap: 20 }}>
            <h2 id="t-historia" className="h-lg">Nuestra historia</h2>
            <p className="muted">
              Más de veinte años creciendo como familia: congresos, campamentos, viajes misioneros y, en 2024, la dedicación de nuestro nuevo local.
            </p>
            <figure className="stack" style={{ gap: 8, margin: 0 }}>
              <Photo src={HISTORY_PHOTOS[0].image_url} alt={HISTORY_PHOTOS[0].caption} ratio="16 / 10" />
              <figcaption className="label">Así empezamos: {HISTORY_PHOTOS[0].caption.toLowerCase()}.</figcaption>
            </figure>
          </Reveal>
          <Timeline items={HISTORY} />
        </div>
      </section>

      <section className="section container" aria-labelledby="t-inicios" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <div className="stack">
            <span className="eyebrow">Archivo</span>
            <h2 id="t-inicios" className="h-md">Los primeros años</h2>
            <p className="muted">De cuando éramos el anexo &ldquo;Los Productores&rdquo; de la {FOUNDER.mother_church}. Toca una foto para verla completa.</p>
          </div>
        </Reveal>
        <Gallery items={HISTORY_PHOTOS.slice(1)} className="gallery-archive" />
      </section>

      <section className="section container" aria-label="Primera visita" style={{ paddingTop: 0 }}>
        <Reveal>
          <FirstVisit settings={settings} />
        </Reveal>
      </section>
    </>
  );
}
