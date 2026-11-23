"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type Stat = { value: number; label: string; prefix?: string };

/** Número que cuenta desde 0 cuando aparece en pantalla. Sin JavaScript se ve el valor final. */
function Counter({ value, prefix }: { value: number; prefix?: string }) {
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
      {prefix}
      {shown}
    </span>
  );
}

export default function Stats({ items, title, id }: { items: Stat[]; title: string; id?: string }) {
  return (
    <div className="stats-grid">
      <h2 id={id} className="sr-only">
        {title}
      </h2>
      {items.map((s) => (
        <div key={s.label} className="stat">
          {/* Para lectores de pantalla: el valor final, sin la animación */}
          <span className="sr-only">
            {s.prefix}
            {s.value} {s.label}
          </span>
          <span aria-hidden="true" className="stack" style={{ gap: 8 }}>
            <Counter value={s.value} prefix={s.prefix} />
            <span className="stat-label">{s.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
