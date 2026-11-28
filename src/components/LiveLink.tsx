"use client";

import { useEffect, useState } from "react";
import { isLiveNow, type LiveSlot } from "@/lib/live";

type Props = {
  href: string;
  slots: LiveSlot[];
  className?: string;
  idleLabel?: string;
  liveLabel?: string;
};

/**
 * Botón de transmisión: en horario de culto se pone rojo con un pulso y dice "En vivo ahora".
 * Se revisa cada 30 segundos en el navegador (la página puede estar en caché).
 */
export default function LiveLink({ href, slots, className = "btn btn-ghost", idleLabel = "Cultos en vivo", liveLabel = "En vivo ahora" }: Props) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const check = () => setLive(isLiveNow(slots));
    check();
    const t = setInterval(check, 30_000);
    return () => clearInterval(t);
  }, [slots]);

  return (
    <a className={`${className} ${live ? "is-live" : ""}`} href={href} target="_blank" rel="noopener noreferrer">
      <span className="live-dot" aria-hidden="true" />
      {live ? liveLabel : idleLabel}
    </a>
  );
}
