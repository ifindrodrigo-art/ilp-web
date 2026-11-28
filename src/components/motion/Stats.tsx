"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type Stat = { value: number; label: string; note?: string };

/** Número que cuenta desde 0 cuando aparece en pantalla. Sin JavaScript se ve el valor final. */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const armed = useRef(false);

  // Al cargar, si todavía no se ve, se pone en 0 para contar cuando aparezca.
  useEffect(() => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (r.top > window.innerHeight) {
      armed.current = true;
      setShown(0);
    }
  }, [reduce]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="stat-value num">
      {shown}
    </span>
  );
}

/** Cuadrícula de cifras con líneas finas entre celdas. El título de la sección va fuera. */
export default function Stats({ items }: { items: Stat[] }) {
  return (
    <ul className={`stats-grid stats-${items.length}`}>
      {items.map((s) => (
        <li key={s.label} className="stat">
          {/* Para lectores de pantalla: la frase completa, sin la animación */}
          <span className="sr-only">
            {s.value} {s.label.toLowerCase()}.{s.note ? ` ${s.note}.` : ""}
          </span>
          <span className="stat-visual" aria-hidden="true">
            <Counter value={s.value} />
            <span className="stat-label">{s.label}</span>
            {s.note && <span className="stat-note">{s.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
