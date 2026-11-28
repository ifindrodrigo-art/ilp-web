"use client";

import Image from "next/image";
import { m } from "motion/react";
import { useRef } from "react";
import Lightbox, { type LightboxHandle, type LightboxItem } from "./Lightbox";
import { EASE } from "./motion/Reveal";

/** Cuadrícula simple de fotos con visor (se usa en Nosotros: archivo y recuerdos). */
export default function Gallery({ items, className }: { items: LightboxItem[]; className?: string }) {
  const box = useRef<LightboxHandle>(null);
  return (
    <>
      <div className={`gallery ${className ?? ""}`}>
        {items.map((g, i) => (
          <m.button
            key={g.id}
            type="button"
            onClick={() => box.current?.open(i)}
            aria-label={`Ver foto${g.caption ? `: ${g.caption}` : ""}`}
            data-reveal=""
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 5) * 0.06 }}
          >
            <Image src={g.image_url} alt={g.caption || "Foto de la iglesia"} width={440} height={440} sizes="(max-width: 600px) 50vw, 25vw" />
          </m.button>
        ))}
      </div>
      <Lightbox ref={box} items={items} />
    </>
  );
}
