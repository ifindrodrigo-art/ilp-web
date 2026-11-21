import Link from "next/link";
import Photo from "./Photo";
import { IconPin } from "./Icons";
import { DAYS, capitalize, dayNumber, eventDateText, formatTime, monthName, whatsappLink } from "@/lib/format";
import type { EventItem, Ministry, Schedule, Settings } from "@/lib/types";

export function ScheduleGrid({ schedules }: { schedules: Schedule[] }) {
  const weekly = schedules.filter((s) => s.recurrence === "weekly");
  const monthly = schedules.filter((s) => s.recurrence === "monthly");
  return (
    <>
      <div className="grid" style={{ ["--min" as string]: "190px", rowGap: 32 }}>
        {weekly.map((s) => (
          <div key={s.id} className="card schedule-card">
            <span className="eyebrow">{DAYS[s.day]}</span>
            <span className="schedule-time">{formatTime(s.start_time)}</span>
            <span>{s.name}</span>
            {s.note && <span className="label">{s.note}</span>}
          </div>
        ))}
      </div>
      {monthly.map((s) => (
        <div key={s.id} className="card monthly">
          <span className="eyebrow">Cada mes</span>
          <span className="num">
            {s.note ? `${s.note}: ` : `${DAYS[s.day]}: `}
            {s.name}, {s.end_time ? `de ${formatTime(s.start_time)} a ${formatTime(s.end_time)}` : formatTime(s.start_time)}
          </span>
        </div>
      ))}
    </>
  );
}

export function FeaturedEvent({ event }: { event: EventItem }) {
  return (
    <div className="card featured-event">
      <div className="event-date">
        <span className="eyebrow">{capitalize(monthName(event.starts_on))}</span>
        <span className="event-day" style={{ fontSize: event.date_confirmed ? 96 : 56 }}>
          {event.date_confirmed ? dayNumber(event.starts_on) : "Pronto"}
        </span>
      </div>
      <div className="stack" style={{ gap: 12 }}>
        <span className="eyebrow">Próximo evento</span>
        <h2 className="h-md">{event.title}</h2>
        <p className="muted num">
          {eventDateText(event)}
          {event.time_text ? ` · ${event.time_text}` : ""}
        </p>
        {event.description && <p className="muted">{event.description}</p>}
      </div>
      <Link className="btn btn-ghost" href="/eventos">
        Ver todos los eventos
      </Link>
    </div>
  );
}

export function EventRow({ event }: { event: EventItem }) {
  return (
    <article className="card event" id={`evento-${event.id}`}>
      <div className="event-date">
        <span className="eyebrow">{capitalize(monthName(event.starts_on))}</span>
        <span className="event-day" style={{ fontSize: event.date_confirmed ? 56 : 32 }}>
          {event.date_confirmed ? dayNumber(event.starts_on) : "Pronto"}
        </span>
      </div>
      <div className="stack" style={{ gap: 10 }}>
        <h3 className="h-sm">{event.title}</h3>
        <p className="muted num">
          {eventDateText(event)}
          {event.time_text ? ` · ${event.time_text}` : ""}
        </p>
        {event.location && <p className="muted">{event.location}</p>}
        {event.description && <p className="muted" style={{ whiteSpace: "pre-line" }}>{event.description}</p>}
        {event.image_url && (
          <div className="event-flyer">
            <Photo src={event.image_url} alt={`Flyer de ${event.title}`} ratio="4 / 5" sizes="320px" />
          </div>
        )}
        {event.link_url && (
          <div className="btn-row" style={{ marginTop: 4 }}>
            <a className="btn btn-primary" href={event.link_url} target="_blank" rel="noopener noreferrer">
              Inscríbete
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export function MinistryCard({ m }: { m: Ministry }) {
  return (
    <Link href={`/ministerios/${m.slug}`} className="card-link">
      <Photo src={m.image_url} alt={`${m.name}, ${m.audience}`} ratio="4 / 5" sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw" />
      <div className="ministry-body">
        <span className="eyebrow">{m.audience}</span>
        <span className="h-sm">{m.name}</span>
        {(m.tagline || m.schedule_text) && (
          <span className="muted" style={{ fontSize: 15, lineHeight: 1.5 }}>
            {[m.tagline, m.schedule_text].filter(Boolean).join(" · ")}
          </span>
        )}
        <span className="btn btn-sm" aria-hidden="true" style={{ marginTop: 6 }}>
          Conoce más
        </span>
      </div>
    </Link>
  );
}

export function HowToGetThere({ settings }: { settings: Settings }) {
  const q = encodeURIComponent(settings.address);
  return (
    <div className="split" style={{ gap: 12, alignItems: "stretch" }}>
      <div className="card stack" style={{ gap: 20 }}>
        <h2 className="h-md">Cómo llegar</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <IconPin className="pin" />
          <div className="stack" style={{ gap: 6 }}>
            <span>{settings.address}</span>
            {settings.address_reference && <span className="muted" style={{ fontSize: 15 }}>{settings.address_reference}</span>}
          </div>
        </div>
        {settings.maps_url && (
          <div className="btn-row" style={{ marginTop: "auto" }}>
            <a className="btn btn-ghost" href={settings.maps_url} target="_blank" rel="noopener noreferrer">
              Abrir en Google Maps
            </a>
          </div>
        )}
      </div>
      <iframe
        className="map"
        title={`Mapa: ${settings.address}`}
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function FirstVisit({ settings }: { settings: Settings }) {
  const wa = whatsappLink(settings.whatsapp, "Hola, quiero visitar la iglesia Los Productores.");
  return (
    <div className="card empty" style={{ padding: "72px 16px 8px" }}>
      <span className="eyebrow">Primera visita</span>
      <h2 className="h-lg">¿Es tu primera vez?</h2>
      <p className="lead" style={{ maxWidth: 560 }}>
        Cuéntanos quién eres y te recibimos el domingo. No necesitas conocer a nadie: aquí te esperamos como familia.
      </p>
      <div className="btn-row" style={{ justifyContent: "center" }}>
        <Link className="btn btn-primary" href="/visitanos#soy-nuevo">
          Planea tu visita
        </Link>
        {wa && (
          <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
            Escríbenos por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
