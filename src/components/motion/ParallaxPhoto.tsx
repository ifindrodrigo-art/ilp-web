"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = { src: string | null | undefined; alt: string; ratio?: string; sizes?: string };

/** Foto que se desplaza un poco dentro de su marco al bajar la página. */
export default function ParallaxPhoto({ src, alt, ratio = "4 / 5", sizes = "(max-width: 900px) 100vw, 50vw" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);

  return (
    <div ref={ref} className="photo" style={{ aspectRatio: ratio }}>
      {src ? (
        <m.div style={{ y, position: "absolute", inset: "-9% 0" }}>
          <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
        </m.div>
      ) : (
        <div className="photo-fallback" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" />
        </div>
      )}
    </div>
  );
}
