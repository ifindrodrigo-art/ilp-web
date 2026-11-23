"use client";

import { m, type Variants } from "motion/react";
import { EASE } from "./Reveal";

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const row: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};
const line: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
};

/** Línea de tiempo: cada año aparece con su línea dibujándose de izquierda a derecha. */
export default function Timeline({ items }: { items: { year: number; items: string[] }[] }) {
  return (
    <m.ol className="timeline" data-reveal="" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}>
      {items.map((h) => (
        <m.li key={h.year} variants={row} data-reveal="">
          <m.span className="timeline-rule" variants={line} aria-hidden="true" data-reveal="" />
          <span className="timeline-year">{h.year}</span>
          <ul>
            {h.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </m.li>
      ))}
    </m.ol>
  );
}
