"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "./Reveal";

export type CollageImage = { src: string; alt: string };

/** Capas: cada foto se descubre con una cortina, se mueve a distinta velocidad al bajar y sigue un poco al mouse. */
const LAYERS = [
  { cls: "collage-a", depth: 14, speed: -50, delay: 0.15 },
  { cls: "collage-b", depth: 26, speed: 40, delay: 0.32 },
  { cls: "collage-c", depth: 38, speed: -90, delay: 0.5 },
];

function Layer({ img, i, mx, my }: { img: CollageImage; i: number; mx: ReturnType<typeof useSpring>; my: ReturnType<typeof useSpring> }) {
  const L = LAYERS[i];
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const sy = useTransform(scrollY, [0, 700], [0, reduce ? 0 : L.speed]);
  const px = useTransform(mx, (v: number) => v * L.depth);
  const py = useTransform(my, (v: number) => v * L.depth);
  const y = useTransform([sy, py], ([a, b]: number[]) => a + b);

  return (
    <m.div className={`collage-layer ${L.cls}`} style={{ x: px, y }}>
      <m.div
        className="collage-frame"
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.2, ease: EASE, delay: L.delay }}
      >
        <m.div
          style={{ position: "absolute", inset: 0 }}
          initial={reduce ? false : { scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE, delay: L.delay }}
        >
          <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="(max-width: 900px) 60vw, 30vw" style={{ objectFit: "cover" }} />
        </m.div>
      </m.div>
    </m.div>
  );
}

export default function HeadCollage({ images }: { images: CollageImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useSpring(0, { stiffness: 80, damping: 20 });
  const my = useSpring(0, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <div ref={ref} className={`collage collage-${Math.min(images.length, 3)}`}>
      {images.slice(0, 3).map((img, i) => (
        <Layer key={img.src} img={img} i={i} mx={mx} my={my} />
      ))}
    </div>
  );
}
