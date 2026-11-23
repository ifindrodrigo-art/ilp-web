"use client";

import Image from "next/image";
import { useState } from "react";
import { IconPause, IconResume } from "../Icons";
import type { GalleryItem } from "@/lib/types";

/**
 * Franja de fotos que avanza sola, muy despacio. Se detiene al pasar el mouse,
 * al enfocar con el teclado o con el botón Pausar. Con "menos movimiento"
 * activado no se mueve y se puede deslizar a mano.
 */
export default function PhotoMarquee({ items }: { items: GalleryItem[] }) {
  const [paused, setPaused] = useState(false);
  if (items.length < 4) return null;
  const seconds = Math.max(40, items.length * 6);

  const strip = (copy: boolean) =>
    items.map((g, i) => (
      <figure key={`${copy ? "b" : "a"}-${g.id}`} className={`marquee-item ${i % 3 === 1 ? "is-tall" : ""}`} aria-hidden={copy || undefined}>
        <Image src={g.image_url} alt={copy ? "" : g.caption || "Foto de la iglesia"} fill sizes="(max-width: 720px) 60vw, 420px" />
      </figure>
    ));

  return (
    <div className="marquee" data-paused={paused} role="region" aria-label="Fotos de la iglesia">
      <div className="marquee-track" style={{ ["--marquee-time" as string]: `${seconds}s` }}>
        {strip(false)}
        {strip(true)}
      </div>
      <button type="button" className="marquee-toggle" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        {paused ? <IconResume /> : <IconPause />}
        {paused ? "Reanudar" : "Pausar"}
      </button>
    </div>
  );
}
