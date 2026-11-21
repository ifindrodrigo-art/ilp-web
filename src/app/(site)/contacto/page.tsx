import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import PrayerForm from "@/components/forms/PrayerForm";
import { getContent } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contacto y petición de oración",
  description: "Escríbenos o déjanos tu petición de oración. Iglesia Los Productores, Ate Vitarte.",
  alternates: { canonical: "/contacto" },
};

export default async function Contacto() {
  const { settings } = await getContent();
  const wa = whatsappLink(settings.whatsapp, "Hola, les escribo desde la web de la iglesia.");
  const social = [
    { href: settings.instagram_url, label: "Instagram" },
    { href: settings.facebook_url, label: "Facebook" },
    { href: settings.youtube_url, label: "YouTube" },
    { href: settings.tiktok_url, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <>
      <PageHead
        eyebrow="Contacto"
        title="Estamos para orar contigo"
        intro="Déjanos tu petición de oración. La reciben solo los pastores y el equipo de oración."
      />
      <section className="section container">
        <div className="split" style={{ alignItems: "start" }}>
          <div className="card">
            <PrayerForm />
          </div>
          <div className="stack" style={{ gap: 12 }}>
            {(wa || settings.email) && (
              <div className="card stack" style={{ gap: 16 }}>
                <h2 className="h-sm">Escríbenos</h2>
                <div className="btn-row">
                  {wa && (
                    <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  )}
                  {settings.email && (
                    <a className="btn btn-ghost" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  )}
                </div>
              </div>
            )}
            <div className="card stack" style={{ gap: 16 }}>
              <h2 className="h-sm">Síguenos</h2>
              <div className="btn-row">
                {social.map((s) => (
                  <a key={s.label} className="btn btn-ghost" href={s.href!} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="card stack" style={{ gap: 8 }}>
              <h2 className="h-sm">Dirección</h2>
              <p className="muted">{settings.address}</p>
              {settings.address_reference && <p className="muted">{settings.address_reference}</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
