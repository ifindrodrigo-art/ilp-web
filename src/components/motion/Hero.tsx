"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "./Reveal";

/**
 * Foto de portada: entra con un acercamiento lento (5 s, una sola vez) y se desplaza
 * un poco más lento que la página al bajar (paralaje).
 */
export function HeroMedia({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 180]);

  return (
    <div className="hero-media" aria-hidden="true">
      <m.div className="hero-media-layer" style={{ y }}>
        <m.div
          className="hero-media-layer"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: EASE }}
        >
          <Image className="hero-img" src={src} alt="" fill priority quality={90} sizes="100vw" />
        </m.div>
      </m.div>
    </div>
  );
}

/** Título de portada: las palabras suben una tras otra desde detrás de una máscara. */
export function HeroTitle({ lines, id, className }: { lines: string[]; id?: string; className?: string }) {
  let n = 0;
  return (
    <h1 id={id} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="title-line">
          {line.split(" ").map((word, wi, arr) => {
            const i = n++;
            return (
              <span key={wi}>
                <span className="word-mask">
                  <m.span
                    className="word"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.08 }}
                  >
                    {word}
                  </m.span>
                </span>
                {wi < arr.length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
