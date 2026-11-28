"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";

/**
 * Carga Motion con animaciones, gestos de arrastre y animaciones de diseño (layout).
 * reducedMotion="user": si la persona pidió menos movimiento en su celular o
 * computadora, se quitan los desplazamientos y quedan solo los fundidos suaves.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
