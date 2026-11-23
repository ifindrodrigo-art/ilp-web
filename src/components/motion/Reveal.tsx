"use client";

import { m, type Variants } from "motion/react";

/** Curva de salida suave (la misma de --ease-out en el CSS). */
export const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  /** Cuánto sube al aparecer, en px */
  y?: number;
  id?: string;
};

/** Aparece con un fundido y una subida corta cuando entra en pantalla (una sola vez). */
export function Reveal({ children, className, style, delay = 0, y = 28, id }: Props) {
  return (
    <m.div
      id={id}
      className={className}
      style={style}
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </m.div>
  );
}

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Contenedor de una cuadrícula: sus RevealItem aparecen uno tras otro. */
export function RevealGroup({ children, className, style, id }: Omit<Props, "delay" | "y">) {
  return (
    <m.div
      id={id}
      className={className}
      style={style}
      data-reveal=""
      variants={group}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className, style }: Omit<Props, "delay" | "y" | "id">) {
  return (
    <m.div className={className} style={style} data-reveal="" variants={item}>
      {children}
    </m.div>
  );
}
