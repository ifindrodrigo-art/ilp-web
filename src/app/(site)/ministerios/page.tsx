import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { MinistryCard } from "@/components/Sections";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
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
        images={[
          { src: "/fotos/ministerios/jovenes.webp", alt: "Jóvenes adorando" },
          { src: "/fotos/ministerios/teens.webp", alt: "Xtreme Teens en su campamento" },
          { src: "/fotos/ig/festikids-2026/01.webp", alt: "Misión Infantil en el FestiKids" },
        ]}
      />
      <section className="section container">
        <RevealGroup className="grid-3">
          {ministries.map((m) => (
            <RevealItem key={m.slug}>
              <MinistryCard m={m} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
