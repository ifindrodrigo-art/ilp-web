"use client";

import Image from "next/image";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import Lightbox, { type LightboxHandle, type LightboxItem } from "../Lightbox";
import { IconChevronLeft, IconChevronRight } from "../Icons";
import { EASE } from "./Reveal";

/**
 * Tira horizontal de fotos: se desliza con el dedo, la rueda, las flechas o arrastrando con el mouse.
 * Cada foto abre el visor. Una barra muestra cuánto falta.
 */
export default function PhotoStrip({ items, label }: { items: LightboxItem[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const box = useRef<LightboxHandle>(null);
  const reduce = useReducedMotion();
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const { scrollXProgress } = useScroll({ container: ref });
  const bar = useSpring(scrollXProgress, { stiffness: 200, damping: 30 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  useMotionValueEvent(scrollXProgress, "change", (v) => {
    setAtStart(v < 0.01);
    setAtEnd(v > 0.99);
  });

  const page = (d: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="strip-wrap">
      <div
        ref={ref}
        className={`strip ${grabbing ? "is-grabbing" : ""}`}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: 0 };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down || !ref.current) return;
          const dx = e.clientX - d.x;
          d.moved = Math.max(d.moved, Math.abs(dx));
          if (d.moved > 5) setGrabbing(true);
          ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current.down = false;
          setTimeout(() => setGrabbing(false), 0);
        }}
        onPointerLeave={() => {
          drag.current.down = false;
          setGrabbing(false);
        }}
      >
        {items.map((g, i) => (
          <m.button
            key={g.id}
            type="button"
            className={`strip-item ${i % 4 === 1 ? "is-wide" : ""}`}
            onClick={() => {
              if (drag.current.moved > 5) return;
              box.current?.open(i);
            }}
            aria-label={`Ver foto${g.caption ? `: ${g.caption}` : ""}`}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: EASE, delay: Math.min(i, 5) * 0.06 }}
          >
            <Image src={g.image_url} alt={g.caption || "Foto"} fill sizes="(max-width: 600px) 75vw, 420px" draggable={false} />
          </m.button>
        ))}
      </div>
      <div className="container strip-controls">
        <div className="strip-progress" aria-hidden="true">
          <m.span style={{ scaleX: bar }} />
        </div>
        <div className="btn-row">
          <button type="button" className="round-btn" onClick={() => page(-1)} aria-label="Fotos anteriores" disabled={atStart}>
            <IconChevronLeft />
          </button>
          <button type="button" className="round-btn" onClick={() => page(1)} aria-label="Más fotos" disabled={atEnd}>
            <IconChevronRight />
          </button>
        </div>
      </div>
      <Lightbox ref={box} items={items} />
    </div>
  );
}
