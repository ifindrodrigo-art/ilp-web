"use client";

import Image from "next/image";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { EASE } from "./Reveal";

/* ------------------------------------------------------------------ */
/* Foto que se descubre como una cortina al entrar en pantalla          */
/* ------------------------------------------------------------------ */
type RevealPhotoProps = {
  src: string | null | undefined;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Desde dónde se abre la cortina */
  from?: "bottom" | "left" | "right";
  delay?: number;
};

const CLOSED = { bottom: "inset(100% 0% 0% 0%)", left: "inset(0% 100% 0% 0%)", right: "inset(0% 0% 0% 100%)" };

export function RevealPhoto({ src, alt, ratio = "4 / 5", sizes = "(max-width: 900px) 100vw, 33vw", priority, className, from = "bottom", delay = 0 }: RevealPhotoProps) {
  const reduce = useReducedMotion();
  if (!src) {
    return (
      <div className={`photo ${className ?? ""}`} style={{ aspectRatio: ratio }}>
        <div className="photo-fallback" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" />
        </div>
      </div>
    );
  }
  // El disparador es un contenedor sin recorte: Chrome no "ve" un elemento con clip-path cerrado.
  return (
    <m.div className={className} data-reveal="" initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={{ hidden: {}, show: {} }}>
      <m.div
        className="photo"
        style={{ aspectRatio: ratio }}
        data-reveal=""
        variants={{ hidden: { clipPath: CLOSED[from] }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay } } }}
      >
        <m.div
          style={{ position: "absolute", inset: 0 }}
          data-reveal=""
          variants={{ hidden: { scale: 1.18 }, show: { scale: 1, transition: reduce ? { duration: 0 } : { duration: 1.6, ease: EASE, delay } } }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
        </m.div>
      </m.div>
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/* Botón magnético: se inclina un poco hacia el puntero (solo mouse)    */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });

  function move(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </m.span>
  );
}

/* ------------------------------------------------------------------ */
/* Franja de texto grande que se desliza al bajar (ligada al scroll)    */
/* y se inclina según la velocidad. No se mueve sola.                   */
/* ------------------------------------------------------------------ */
export function VelocityText({ items, reverse = false, tone = "ink" }: { items: string[]; reverse?: boolean; tone?: "ink" | "accent" | "outline" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 300 });
  const skewX = useTransform(smooth, [-2000, 2000], reduce ? [0, 0] : [10, -10]);
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : reverse ? ["-30%", "0%"] : ["0%", "-30%"]);
  const line = items.join("  ·  ") + "  ·  ";
  return (
    <div ref={ref} className={`velocity velocity-${tone}`} aria-hidden="true">
      <m.div className="velocity-track" style={{ x, skewX }}>
        {[0, 1, 2].map((i) => (
          <span key={i}>{line}</span>
        ))}
      </m.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Título que aparece palabra por palabra al entrar en pantalla         */
/* (el disparador es el título completo: las palabras están ocultas     */
/* tras su máscara y no se "ven" solas)                                 */
/* ------------------------------------------------------------------ */
const headingGroup = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const headingWord = { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.8, ease: EASE } } };

export function SplitHeading({
  text,
  as = "h2",
  className,
  id,
  style,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  const Comp = as === "h1" ? m.h1 : as === "h3" ? m.h3 : m.h2;
  const words = text.split(" ");
  return (
    <Comp id={id} className={className} style={style} variants={headingGroup} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word-mask">
            <m.span className="word" variants={headingWord}>
              {w}
            </m.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Comp>
  );
}
