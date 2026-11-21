import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { EventRow } from "@/components/Sections";
import { getContent, upcomingEvents } from "@/lib/content";
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
  };
}

export default async function MinisterioPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const m = c.ministries.find((x) => x.slug === slug);
  if (!m) notFound();
  const events = upcomingEvents(c.events).filter((e) => e.ministry_slug === m.slug);

  return (
    <>
      <div className="container page-head">
        <nav aria-label="Ruta" className="text-link" style={{ marginBottom: 24 }}>
          <Link href="/ministerios">Ministerios</Link> <span aria-hidden="true">/</span> <span aria-current="page">{m.name}</span>
        </nav>
      </div>
      <section className="container" style={{ paddingBottom: "var(--section)" }}>
        <div className="split" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 20 }}>
            <span className="eyebrow">{m.audience}</span>
            <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 88px)" }}>{m.name}</h1>
            {m.tagline && <p className="lead">{m.tagline}</p>}
            {m.description && <p className="muted" style={{ whiteSpace: "pre-line" }}>{m.description}</p>}
            {m.schedule_text && (
              <div className="card" style={{ paddingTop: 16 }}>
                <span className="eyebrow">Cuándo nos reunimos</span>
                <p className="num" style={{ marginTop: 4 }}>{m.schedule_text}</p>
              </div>
            )}
            <div className="btn-row">
              <Link className="btn btn-primary" href="/visitanos#soy-nuevo">
                Quiero sumarme
              </Link>
              {m.instagram && (
                <a className="btn btn-ghost" href={`https://www.instagram.com/${m.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer">
                  @{m.instagram.replace(/^@/, "")}
                </a>
              )}
            </div>
          </div>
          <Photo src={m.image_url} alt={`${m.name}, ${m.audience}`} ratio="4 / 5" priority />
        </div>
      </section>

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
    </>
  );
}
