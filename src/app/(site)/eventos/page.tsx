import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import JsonLd from "@/components/JsonLd";
import { EventRow } from "@/components/Sections";
import { getContent, upcomingEvents } from "@/lib/content";
import { capitalize, monthName, yearOf } from "@/lib/format";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { EventItem } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventos",
  description: "Congresos, campamentos, aniversario y cultos especiales de la Iglesia Los Productores en Ate Vitarte.",
  alternates: { canonical: "/eventos" },
};

function byMonth(events: EventItem[]) {
  const groups = new Map<string, EventItem[]>();
  for (const e of events) {
    const key = `${capitalize(monthName(e.starts_on))} ${yearOf(e.starts_on)}`;
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  return [...groups.entries()];
}

export default async function Eventos() {
  const c = await getContent();
  const events = upcomingEvents(c.events);
  const confirmed = events.filter((e) => e.date_confirmed);

  return (
    <>
      <PageHead
        eyebrow="Eventos"
        title="Lo que viene en la iglesia"
        intro="Casi cada mes tenemos un evento especial. Ven y trae un invitado."
        images={[
          { src: "/fotos/galeria/juvenil-grupo.webp", alt: "Congreso juvenil Íntimo y Eterno" },
          { src: "/fotos/galeria/damas-congreso.webp", alt: "Congreso de Damas" },
          { src: "/fotos/ig/aniversario-22/01.webp", alt: "Aniversario 22 de la iglesia" },
        ]}
      />
      <section className="section container">
        {events.length === 0 ? (
          <div className="card empty">
            <h2 className="h-md">Pronto anunciaremos nuevos eventos</h2>
            <p className="muted">Mientras tanto, síguenos en redes para enterarte primero.</p>
            {c.settings.instagram_url && (
              <a className="btn btn-ghost" href={c.settings.instagram_url} target="_blank" rel="noopener noreferrer">
                Ver Instagram
              </a>
            )}
          </div>
        ) : (
          <div className="stack" style={{ gap: 40 }}>
            {byMonth(events).map(([month, list]) => (
              <div key={month} className="stack" style={{ gap: 12 }}>
                <h2 className="h-md">{month}</h2>
                {list.map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
      {confirmed.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": confirmed.map((e) => ({
              "@type": "Event",
              name: e.title,
              startDate: e.starts_on,
              ...(e.ends_on ? { endDate: e.ends_on } : {}),
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              ...(e.description ? { description: e.description } : {}),
              ...(e.image_url ? { image: [e.image_url] } : {}),
              location: {
                "@type": "Place",
                name: e.location || SITE_NAME,
                address: e.location || "Calle Arequipa 303, Tilda, Ate, Lima, Perú",
              },
              organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            })),
          }}
        />
      )}
    </>
  );
}
