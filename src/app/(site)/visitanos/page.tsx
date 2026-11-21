import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import VisitForm from "@/components/forms/VisitForm";
import { HowToGetThere, ScheduleGrid } from "@/components/Sections";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Visítanos",
  description: "Horarios de culto, cómo llegar a Calle Arequipa 303, Tilda, Ate Vitarte, y qué esperar en tu primera visita.",
  alternates: { canonical: "/visitanos" },
};

export default async function Visitanos() {
  const { settings, schedules } = await getContent();
  return (
    <>
      <PageHead
        eyebrow="Visítanos"
        title="Te esperamos este domingo"
        intro="Aquí tienes los horarios, cómo llegar y un formulario para avisarnos que vienes. Así te recibimos como familia."
      />

      <section className="section container" aria-labelledby="t-horarios">
        <h2 id="t-horarios" className="h-md" style={{ marginBottom: 24 }}>Horarios</h2>
        <ScheduleGrid schedules={schedules} />
      </section>

      <section className="section container" aria-label="Cómo llegar" style={{ paddingTop: 0 }}>
        <HowToGetThere settings={settings} />
      </section>

      <section id="soy-nuevo" className="section container" aria-labelledby="t-nuevo">
        <div className="split" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 20 }}>
            <span className="eyebrow">Primera visita</span>
            <h2 id="t-nuevo" className="h-lg">¿Es tu primera vez?</h2>
            {settings.first_visit ? (
              <p className="prose">{settings.first_visit}</p>
            ) : (
              <p className="muted">
                No necesitas conocer a nadie. Cuéntanos quién eres y cuándo piensas venir, y alguien de la iglesia te dará la bienvenida.
              </p>
            )}
          </div>
          <div className="card">
            <VisitForm />
          </div>
        </div>
      </section>
    </>
  );
}
