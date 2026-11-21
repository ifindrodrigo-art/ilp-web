import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { MinistryCard } from "@/components/Sections";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ministerios",
  description: "Niños, adolescentes, jóvenes, alabanza, damas, varones, familia, misiones y oración: encuentra tu lugar en la Iglesia Los Productores.",
  alternates: { canonical: "/ministerios" },
};

export default async function Ministerios() {
  const { ministries } = await getContent();
  return (
    <>
      <PageHead
        eyebrow="Ministerios"
        title="Una familia, muchos ministerios"
        intro="Cada etapa de la vida tiene su espacio. Encuentra el tuyo y súmate."
      />
      <section className="section container">
        <div className="grid-3">
          {ministries.map((m) => (
            <MinistryCard key={m.slug} m={m} />
          ))}
        </div>
      </section>
    </>
  );
}
