import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/content";
import { MOTTO, SITE_NAME, SITE_URL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, schedules, announcements } = await getContent();
  const notice = announcements[0];

  const church = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: SITE_NAME,
    alternateName: "ILP",
    slogan: MOTTO,
    url: SITE_URL,
    foundingDate: "2004-02-27",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Arequipa 303, Tilda",
      addressLocality: "Ate",
      addressRegion: "Lima",
      addressCountry: "PE",
    },
    ...(settings.logo_url ? { logo: settings.logo_url } : {}),
    ...(settings.whatsapp ? { telephone: settings.whatsapp } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    sameAs: [settings.facebook_url, settings.instagram_url, settings.youtube_url, settings.tiktok_url].filter(Boolean),
  };

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      {notice && (
        <div className="announce" role="status">
          {notice.text}
          {notice.link_url && <a href={notice.link_url}>{notice.link_label || "Ver más"}</a>}
        </div>
      )}
      <Header logoUrl={settings.logo_url} liveUrl={settings.live_url} />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Footer settings={settings} schedules={schedules} />
      <JsonLd data={church} />
    </>
  );
}
