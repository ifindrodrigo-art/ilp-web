import Link from "next/link";
import { DAYS, formatTime, whatsappLink } from "@/lib/format";
import { MOTTO, SITE_NAME } from "@/lib/site";
import type { Schedule, Settings } from "@/lib/types";

export default function Footer({ settings, schedules }: { settings: Settings; schedules: Schedule[] }) {
  const weekly = schedules.filter((s) => s.recurrence === "weekly");
  const wa = whatsappLink(settings.whatsapp);
  const social = [
    { href: settings.instagram_url, label: "Instagram" },
    { href: settings.facebook_url, label: "Facebook (cultos en vivo)" },
    { href: settings.youtube_url, label: "YouTube" },
    { href: settings.tiktok_url, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="stack">
          <span className="brand-name" style={{ color: "var(--red)", fontSize: 22 }}>los productores</span>
          <span className="muted">{MOTTO} Asambleas de Dios del Perú.</span>
        </div>
        <div className="stack">
          <span className="footer-title">Horarios</span>
          {weekly.map((s) => (
            <span key={s.id} className="muted num">
              {DAYS[s.day]} {formatTime(s.start_time)} · {s.name}
            </span>
          ))}
        </div>
        <div className="stack">
          <span className="footer-title">Síguenos</span>
          {social.map((s) => (
            <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
        <div className="stack">
          <span className="footer-title">Visítanos</span>
          <span className="muted">{settings.address}</span>
          {settings.maps_url && (
            <a href={settings.maps_url} target="_blank" rel="noopener noreferrer">
              Abrir en Google Maps
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {SITE_NAME}</span>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/admin" rel="nofollow">Panel</Link>
      </div>
    </footer>
  );
}
