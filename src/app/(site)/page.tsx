import Image from "next/image";
import Link from "next/link";
import Photo from "@/components/Photo";
import Gallery from "@/components/Gallery";
import VideoEmbed from "@/components/VideoEmbed";
import { IconArrowDown } from "@/components/Icons";
import { FeaturedEvent, FirstVisit, HowToGetThere, MinistryCard, ScheduleGrid } from "@/components/Sections";
import { getContent, upcomingEvents } from "@/lib/content";
import { formatTime } from "@/lib/format";

export const revalidate = 60;

export default async function Home() {
  const c = await getContent();
  const { settings } = c;
  const next = upcomingEvents(c.events)[0];
  const sermon = c.sermons[0];
  const sundays = c.schedules.filter((s) => s.recurrence === "weekly" && s.day === 0);
  const sundayText = sundays.length ? `Domingos ${sundays.map((s) => formatTime(s.start_time)).join(" y ")}` : null;
  const hasPhoto = Boolean(settings.hero_image_url);

  return (
    <>
      <section className={`hero ${hasPhoto ? "hero-photo" : "hero-plain"}`} aria-labelledby="titulo-inicio">
        {settings.hero_image_url && <Image className="hero-img" src={settings.hero_image_url} alt="" fill priority sizes="100vw" />}
        <div className="hero-content">
          <span className="eyebrow rise">Ate Vitarte · Lima · Desde 2004</span>
          <h1 id="titulo-inicio" className="display rise">
            Más que una iglesia,
            <br />
            una familia
          </h1>
          <p className="lead rise rise-2">Te esperamos en Ate Vitarte. Ven con los tuyos y trae un invitado.</p>
          <div className="btn-row rise rise-3">
            <Link className={`btn ${hasPhoto ? "btn-light" : "btn-primary"}`} href="/visitanos">
              Planea tu visita
            </Link>
            {settings.live_url && (
              <a className={`btn ${hasPhoto ? "btn-light" : "btn-ghost"}`} href={settings.live_url} target="_blank" rel="noopener noreferrer">
                <span className="live-dot" aria-hidden="true" />
                Cultos en vivo
              </a>
            )}
          </div>
          <p className="label num rise rise-3">{[sundayText, "Calle Arequipa 303, Tilda, Ate"].filter(Boolean).join("  |  ")}</p>
          <a href="#horarios" className="scroll-cue" aria-label="Ver horarios">
            <IconArrowDown />
          </a>
        </div>
      </section>

      <section id="horarios" className="section container" aria-labelledby="t-horarios">
        <div className="section-head">
          <div className="stack">
            <span className="eyebrow">Horarios</span>
            <h2 id="t-horarios" className="h-lg">Esta semana en la iglesia</h2>
          </div>
          <Link href="/visitanos" className="text-link">Horarios y cómo llegar</Link>
        </div>
        <ScheduleGrid schedules={c.schedules} />
      </section>

      {next && (
        <section className="container" aria-label="Próximo evento">
          <FeaturedEvent event={next} />
        </section>
      )}

      <section className="section container" aria-labelledby="t-nosotros">
        <div className="split">
          <Photo src={settings.welcome_image_url} alt="La iglesia Los Productores" ratio="4 / 5" />
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow">Nosotros</span>
            <h2 id="t-nosotros" className="h-lg">Transmitir vida a través de nuestra vida</h2>
            <p className="muted" style={{ maxWidth: 520 }}>
              Somos una iglesia de las Asambleas de Dios del Perú en Ate Vitarte, desde el 27 de febrero de 2004. Niños, adolescentes, jóvenes,
              damas, varones y familias: aquí hay un lugar para ti.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/nosotros">
                Conoce nuestra historia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {c.ministries.length > 0 && (
        <section className="section container" aria-labelledby="t-ministerios">
          <div className="section-head">
            <div className="stack">
              <span className="eyebrow">Ministerios</span>
              <h2 id="t-ministerios" className="h-lg">Una familia, muchos ministerios</h2>
              <p className="muted">Encuentra tu lugar según tu edad y tu etapa.</p>
            </div>
            <Link href="/ministerios" className="text-link">Ver todos</Link>
          </div>
          <div className="grid-3">
            {c.ministries.slice(0, 6).map((m) => (
              <MinistryCard key={m.slug} m={m} />
            ))}
          </div>
        </section>
      )}

      <section className="section container" aria-labelledby="t-predicas">
        <div className="split-wide">
          {sermon ? <VideoEmbed id={sermon.youtube_id} title={sermon.title} /> : <Photo src={null} alt="" ratio="16 / 9" />}
          <div className="stack" style={{ gap: 20 }}>
            <span className="eyebrow">Prédicas</span>
            <h2 id="t-predicas" className="h-lg">{sermon ? sermon.title : "¿Te perdiste el culto?"}</h2>
            <p className="muted">Cada domingo transmitimos en vivo por Facebook, y los cultos quedan en nuestro canal de YouTube.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/predicas">
                Ver prédicas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {c.gallery.length > 0 && (
        <section className="section container" aria-labelledby="t-galeria">
          <div className="section-head">
            <div className="stack">
              <span className="eyebrow">Galería</span>
              <h2 id="t-galeria" className="h-lg">Así vivimos la fe juntos</h2>
            </div>
            <Link href="/galeria" className="text-link">Ver galería</Link>
          </div>
          <Gallery items={c.gallery.slice(0, 8)} />
        </section>
      )}

      <section className="section container" aria-label="Cómo llegar">
        <HowToGetThere settings={settings} />
      </section>

      <section className="container" aria-label="Primera visita">
        <FirstVisit settings={settings} />
      </section>
    </>
  );
}
