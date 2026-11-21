import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { getContent } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Cómo usa la Iglesia Los Productores los datos que envías por los formularios de la web.",
  alternates: { canonical: "/privacidad" },
};

export default async function Privacidad() {
  const { settings } = await getContent();
  const wa = whatsappLink(settings.whatsapp);
  return (
    <>
      <PageHead eyebrow="Privacidad" title="Tus datos, cuidados" />
      <section className="section container">
        <div className="stack" style={{ gap: 28, maxWidth: 720 }}>
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="h-sm">Qué datos pedimos</h2>
            <p className="muted">
              En los formularios &quot;Soy nuevo&quot; y &quot;Petición de oración&quot; puedes dejarnos tu nombre, tu teléfono o correo,
              cuándo piensas visitarnos y un mensaje. Solo el nombre es obligatorio para avisar tu visita; la petición de oración puede ser anónima.
            </p>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="h-sm">Para qué los usamos</h2>
            <p className="muted">
              Solo para darte la bienvenida, orar por tu petición y, si nos lo pides, contactarte. No los vendemos, no los compartimos
              con otras organizaciones y no los usamos para publicidad.
            </p>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="h-sm">Quién los ve</h2>
            <p className="muted">
              Solo los pastores y las personas del equipo de la iglesia autorizadas para atender los formularios. Se guardan en una base de datos protegida.
            </p>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="h-sm">Tus derechos</h2>
            <p className="muted">
              Puedes pedirnos ver, corregir o borrar tus datos en cualquier momento, de acuerdo con la Ley de Protección de Datos Personales del Perú (Ley N.° 29733).
              {wa || settings.email ? " Escríbenos por " : " Pídelo a cualquiera de los pastores."}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              )}
              {wa && settings.email ? " o a " : ""}
              {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
              {wa || settings.email ? "." : ""}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
