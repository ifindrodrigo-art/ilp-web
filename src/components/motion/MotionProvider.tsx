"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Carga solo lo necesario de Motion (animaciones y "al entrar en pantalla").
 * reducedMotion="user": si la persona pidió menos movimiento en su celular o
 * computadora, se quitan los desplazamientos y quedan solo los fundidos suaves.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
