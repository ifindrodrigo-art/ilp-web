import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventRow, MinistryCard } from "@/components/Sections";
import VideoEmbed from "@/components/VideoEmbed";
import { Magnetic, RevealPhoto, SplitHeading, VelocityText } from "@/components/motion/Effects";
import { HeroMedia, HeroTitle } from "@/components/motion/Hero";
import PhotoStrip from "@/components/motion/PhotoStrip";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { IconArrowDown } from "@/components/Icons";
import { getContent, upcomingEvents } from "@/lib/content";
import { MINISTRY_VIDEOS, ministryPhotos } from "@/lib/media";
import { SEED } from "@/lib/seed";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return SEED.ministries.map((m) => ({ slug: m.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { ministries } = await getContent();
  const m = ministries.find((x) => x.slug === slug);
  if (!m) return { title: "Ministerio no encontrado" };
  return {
    title: m.name,
    description: m.description?.slice(0, 160) || `${m.name}: ministerio de ${m.audience.toLowerCase()} de la Iglesia Los Productores.`,
    alternates: { canonical: `/ministerios/${m.slug}` },
    openGraph: m.image_url ? { images: [m.image_url] } : undefined,
  };
}

export default async function MinisterioPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const m = c.ministries.find((x) => x.slug === slug);
  if (!m) notFound();
  const events = upcomingEvents(c.events).filter((e) => e.ministry_slug === m.slug);
  const photos = ministryPhotos(m.slug, c.gallery);
  const video = MINISTRY_VIDEOS[m.slug];
  const ig = m.instagram?.replace(/^@/, "");
  const heroSrc = m.image_url ?? photos[0]?.image_url ?? null;
  const second = photos.find((p) => p.image_url !== heroSrc);
  const idx = c.ministries.findIndex((x) => x.slug === m.slug);
  const others = [...c.ministries.slice(idx + 1), ...c.ministries.slice(0, idx)];
  const next = c.ministries[(idx + 1) % c.ministries.length];

  const facts = [
    { k: "Para", v: m.audience },
    m.schedule_text ? { k: "Cuándo", v: m.schedule_text } : null,
    { k: "Dónde", v: "Calle Arequipa 303, Tilda, Ate" },
    ig ? { k: "Instagram", v: `@${ig}`, href: `https://www.instagram.com/${ig}` } : null,
  ].filter(Boolean) as { k: string; v: string; href?: string }[];

  return (
    <>
      <section className={`hero ${heroSrc ? "hero-photo" : "hero-plain"} ministry-hero`} aria-labelledby="t-ministerio">
        {heroSrc && <HeroMedia src={heroSrc} />}
        <div className="hero-content">
          <nav aria-label="Ruta" className="crumbs rise">
            <Link href="/ministerios">Ministerios</Link> <span aria-hidden="true">/</span> <span aria-current="page">{m.name}</span>
          </nav>
          <span className="eyebrow rise">{m.audience}</span>
          <HeroTitle id="t-ministerio" className="display" lines={[m.name]} />
          {m.tagline && <p className="lead rise rise-2">{m.tagline}</p>}
          <div className="btn-row rise rise-3">
            <Magnetic>
              <Link className={`btn ${heroSrc ? "btn-light" : "btn-primary"}`} href="/visitanos#soy-nuevo">
                Quiero sumarme
              </Link>
            </Magnetic>
            {ig && (
              <a className={`btn ${heroSrc ? "btn-light" : "btn-ghost"}`} href={`https://www.instagram.com/${ig}`} target="_blank" rel="noopener noreferrer">
                @{ig}
              </a>
            )}
          </div>
          <a href="#conoce" className="scroll-cue rise rise-4" aria-label="Conoce el ministerio">
            <IconArrowDown />
          </a>
        </div>
      </section>

      <VelocityText items={[m.name, m.audience, m.tagline ?? "Iglesia Los Productores"]} tone="outline" />

      <section id="conoce" className="section container" aria-labelledby="t-conoce">
        <div className="split ministry-about">
          <div className="stack" style={{ gap: 28 }}>
            <span className="eyebrow">Conoce el ministerio</span>
            <SplitHeading id="t-conoce" className="h-lg" text={m.tagline ?? `Bienvenido a ${m.name}`} />
            {m.description && (
              <Reveal>
                <p className="lead" style={{ whiteSpace: "pre-line" }}>{m.description}</p>
              </Reveal>
            )}
            <RevealGroup className="facts">
              {facts.map((f) => (
                <RevealItem key={f.k} className="fact">
                  <span className="label">{f.k}</span>
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noopener noreferrer" className="fact-value">{f.v}</a>
                  ) : (
                    <span className="fact-value">{f.v}</span>
                  )}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <RevealPhoto src={second?.image_url ?? heroSrc} alt={second?.caption ?? m.name} ratio="4 / 5" from="right" sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
      </section>

      {photos.length > 1 && (
        <section className="section strip-section" aria-labelledby="t-fotos" style={{ paddingTop: 0 }}>
          <div className="container section-head">
            <div className="stack">
              <span className="eyebrow">Fotos</span>
              <SplitHeading id="t-fotos" className="h-lg" text={`Así se vive ${m.name}`} />
            </div>
            <span className="label num">{photos.length} fotos · arrastra o desliza</span>
          </div>
          <PhotoStrip items={photos} label={`Fotos de ${m.name}`} />
        </section>
      )}

      {video && (
        <section className="section container" aria-labelledby="t-video" style={{ paddingTop: 0 }}>
          <div className="split-wide">
            <Reveal>
              <VideoEmbed id={video.id} title={video.title} />
            </Reveal>
            <Reveal className="stack" style={{ gap: 16 }} delay={0.1}>
              <span className="eyebrow">Video</span>
              <h2 id="t-video" className="h-md">{video.title}</h2>
              {video.note && <p className="muted">{video.note}</p>}
              {c.settings.youtube_url && (
                <a className="text-link" href={c.settings.youtube_url} target="_blank" rel="noopener noreferrer">
                  Más en nuestro canal de YouTube
                </a>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="section container" aria-labelledby="t-proximos" style={{ paddingTop: 0 }}>
          <h2 id="t-proximos" className="h-md" style={{ marginBottom: 24 }}>Próximos eventos</h2>
          <div className="stack" style={{ gap: 12 }}>
            {events.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      <section className="join-band" aria-labelledby="t-unete">
        <div className="container join-inner">
          <Reveal className="stack" style={{ gap: 16 }}>
            <span className="eyebrow">Súmate</span>
            <h2 id="t-unete" className="h-lg">¿Quieres ser parte de {m.name}?</h2>
            <p>Cuéntanos quién eres y te contactamos. No necesitas conocer a nadie.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic>
              <Link className="btn btn-light" href="/visitanos#soy-nuevo">
                Quiero sumarme
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <section className="section container" aria-labelledby="t-otros">
        <div className="section-head">
          <div className="stack">
            <span className="eyebrow">Sigue explorando</span>
            <h2 id="t-otros" className="h-md">Otros ministerios</h2>
          </div>
          {next && (
            <Link href={`/ministerios/${next.slug}`} className="text-link">
              Siguiente: {next.name}
            </Link>
          )}
        </div>
        <RevealGroup className="grid-3">
          {others.slice(0, 3).map((o) => (
            <RevealItem key={o.slug}>
              <MinistryCard m={o} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
