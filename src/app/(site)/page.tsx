import Link from "next/link";
import LiveLink from "@/components/LiveLink";
import { liveSlots } from "@/lib/live";
import Photo from "@/components/Photo";
import VideoEmbed from "@/components/VideoEmbed";
import { IconArrowDown } from "@/components/Icons";
import { FeaturedEvent, FirstVisit, HowToGetThere, MinistryCard, ScheduleGrid } from "@/components/Sections";
import { HeroMedia, HeroTitle } from "@/components/motion/Hero";
import ParallaxPhoto from "@/components/motion/ParallaxPhoto";
import { Magnetic, RevealPhoto, SplitHeading, VelocityText } from "@/components/motion/Effects";
import PhotoMarquee from "@/components/motion/PhotoMarquee";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Stats, { type Stat } from "@/components/motion/Stats";
import { getContent, upcomingEvents, varietyPick } from "@/lib/content";
import { formatTime, yearsSince } from "@/lib/format";
import { FOUNDER } from "@/lib/seed";

export const revalidate = 60;

export default async function Home() {
  const c = await getContent();
  const { settings } = c;
  const next = upcomingEvents(c.events)[0];
  const sermon = c.sermons[0];
  const weekly = c.schedules.filter((s) => s.recurrence === "weekly");
  const sundays = weekly.filter((s) => s.day === 0);
  const sundayText = sundays.length ? `Domingos ${sundays.map((s) => formatTime(s.start_time)).join(" y ")}` : null;
  const hasPhoto = Boolean(settings.hero_image_url);

  const stats: Stat[] = [
    { value: yearsSince("2004-02-27"), label: "años de historia" },
    { value: c.ministries.length, label: "ministerios" },
    { value: weekly.length, label: "reuniones cada semana" },
    { value: c.team.length, label: "pastores" },
  ].filter((s) => s.value > 0);

  const leads = c.team.filter((t) => /principal/i.test(t.role ?? "")).slice(0, 2);
  const pastors = leads.length ? leads : c.team.slice(0, 2);

  return (
    <>
      <section className={`hero ${hasPhoto ? "hero-photo" : "hero-plain"}`} aria-labelledby="titulo-inicio">
        {settings.hero_image_url && <HeroMedia src={settings.hero_image_url} />}
        <div className="hero-content">
          <span className="eyebrow rise">Ate Vitarte · Lima · Desde 2004</span>
          <HeroTitle id="titulo-inicio" className="display" lines={["Más que una iglesia,", "una familia"]} />
          <p className="lead rise rise-2">Te esperamos en Ate Vitarte. Ven con los tuyos y trae un invitado.</p>
          <div className="btn-row rise rise-3">
            <Magnetic>
              <Link className={`btn ${hasPhoto ? "btn-light" : "btn-primary"}`} href="/visitanos">
                Planea tu visita
              </Link>
            </Magnetic>
            {settings.live_url && <LiveLink href={settings.live_url} slots={liveSlots(c.schedules)} className={`btn ${hasPhoto ? "btn-light" : "btn-ghost"}`} />}
          </div>
          <p className="label num rise rise-3">{[sundayText, "Calle Arequipa 303, Tilda, Ate"].filter(Boolean).join("  |  ")}</p>
          <a href="#horarios" className="scroll-cue rise rise-4" aria-label="Ver horarios">
            <IconArrowDown />
          </a>
        </div>
      </section>

      <section id="horarios" className="section container" aria-labelledby="t-horarios">
        <Reveal className="section-head">
          <div className="stack">
            <span className="eyebrow">Horarios</span>
            <h2 id="t-horarios" className="h-lg">Esta semana en la iglesia</h2>
          </div>
          <Link href="/visitanos" className="text-link">Horarios y cómo llegar</Link>
        </Reveal>
        <Reveal delay={0.1}>
          <ScheduleGrid schedules={c.schedules} />
        </Reveal>
      </section>

      {next && (
        <section className="container" aria-label="Próximo evento">
          <Reveal>
            <FeaturedEvent event={next} />
          </Reveal>
        </section>
      )}

      {stats.length > 1 && (
        <section className="stats-band" aria-labelledby="t-numeros">
          <div className="container">
            <Stats id="t-numeros" title="La iglesia en números" items={stats} />
          </div>
        </section>
      )}

      <VelocityText items={["Más que una iglesia", "una familia", "Ate Vitarte", "Desde 2004"]} tone="outline" />

      <section className="section container" aria-labelledby="t-nosotros">
        <div className="split">
          <ParallaxPhoto src={settings.welcome_image_url} alt="La iglesia Los Productores" />
          <Reveal className="stack" style={{ gap: 24 }}>
            <span className="eyebrow">Nosotros</span>
            <SplitHeading id="t-nosotros" className="h-lg" text="Transmitir vida a través de nuestra vida" />
            <p className="muted" style={{ maxWidth: 520 }}>
              Somos una iglesia de las Asambleas de Dios del Perú en Ate Vitarte, fundada por el pastor {FOUNDER.name} el 27 de febrero de 2004.
              Niños, adolescentes, jóvenes, damas, varones y familias: aquí hay un lugar para ti.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/nosotros">
                Conoce nuestra historia
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {pastors.length > 0 && (
        <section className="section container" aria-labelledby="t-pastores" style={{ paddingTop: 0 }}>
          <div className="split pastors-home">
            <Reveal className="stack" style={{ gap: 24 }}>
              <span className="eyebrow">Nuestros pastores</span>
              <h2 id="t-pastores" className="h-lg">{pastors.map((p) => p.name).join(" y ")}</h2>
              <p className="muted" style={{ maxWidth: 480 }}>
                {leads.length ? "Nuestros pastores principales. " : ""}
                {c.team.length > pastors.length ? "Junto a ellos sirve un equipo de pastores en cada etapa de la iglesia." : ""}
              </p>
              <div className="btn-row">
                <Link className="btn btn-primary" href="/nosotros#pastores">
                  Conoce al equipo pastoral
                </Link>
              </div>
            </Reveal>
            <RevealGroup className="pastor-pair">
              {pastors.map((p) => (
                <RevealItem key={p.id}>
                  <figure className="pastor-card">
                    <RevealPhoto src={p.image_url} alt={p.name} ratio="4 / 5" sizes="(max-width: 900px) 50vw, 25vw" />
                    <figcaption>
                      <span className="h-sm">{p.name}</span>
                      {p.role && <span className="label">{p.role}</span>}
                    </figcaption>
                  </figure>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {c.ministries.length > 0 && (
        <section className="section container" aria-labelledby="t-ministerios">
          <Reveal className="section-head">
            <div className="stack">
              <span className="eyebrow">Ministerios</span>
              <SplitHeading id="t-ministerios" className="h-lg" text="Una familia, muchos ministerios" />
              <p className="muted">Encuentra tu lugar según tu edad y tu etapa.</p>
            </div>
            <Link href="/ministerios" className="text-link">Ver todos</Link>
          </Reveal>
          <RevealGroup className="grid-3">
            {[...c.ministries]
              .sort((a, b) => Number(Boolean(b.image_url)) - Number(Boolean(a.image_url)) || a.sort - b.sort)
              .slice(0, 6)
              .map((m) => (
                <RevealItem key={m.slug}>
                  <MinistryCard m={m} />
                </RevealItem>
              ))}
          </RevealGroup>
        </section>
      )}

      {c.gallery.length >= 4 && (
        <section className="section" aria-labelledby="t-galeria">
          <VelocityText items={["Congresos", "Campamentos", "Bautismos", "Cultos", "Familia"]} reverse tone="accent" />
          <Reveal className="container section-head">
            <div className="stack">
              <span className="eyebrow">Galería</span>
              <SplitHeading id="t-galeria" className="h-lg" text="Así vivimos la fe juntos" />
            </div>
            <Link href="/galeria" className="text-link">Ver galería</Link>
          </Reveal>
          <Reveal y={0} delay={0.1}>
            <PhotoMarquee items={varietyPick(c.gallery, 16)} />
          </Reveal>
        </section>
      )}

      <section className="section container" aria-labelledby="t-predicas" style={{ paddingTop: 0 }}>
        <div className="split-wide">
          <Reveal>
            {sermon ? (
              <VideoEmbed id={sermon.youtube_id} title={sermon.title} />
            ) : (
              <Photo src="/fotos/predicador.webp" alt="Predicación en el Congreso de la Familia 2026" ratio="16 / 10" />
            )}
          </Reveal>
          <Reveal className="stack" style={{ gap: 20 }} delay={0.1}>
            <span className="eyebrow">{sermon ? "Último culto" : "Prédicas"}</span>
            <h2 id="t-predicas" className="h-lg">{sermon ? sermon.title : "¿Te perdiste el culto?"}</h2>
            <p className="muted">Cada domingo transmitimos en vivo por Facebook, y los cultos quedan en nuestro canal de YouTube.</p>
            {c.sermons.length > 1 && (
              <ul className="mini-list">
                {c.sermons.slice(1, 4).map((s) => (
                  <li key={s.id}>
                    <Link href="/predicas">
                      <span>{s.title}</span>
                      {s.preached_on && <span className="label num">{s.preached_on.split("-").reverse().join("/")}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="btn-row">
              <Link className="btn btn-primary" href="/predicas">
                Ver todos los cultos
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section container" aria-label="Cómo llegar" style={{ paddingTop: 0 }}>
        <Reveal>
          <HowToGetThere settings={settings} />
        </Reveal>
      </section>

      <section className="container" aria-label="Primera visita">
        <Reveal>
          <FirstVisit settings={settings} />
        </Reveal>
      </section>
    </>
  );
}
