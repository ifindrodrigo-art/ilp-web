"use client";

import Image from "next/image";
import { m } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconClose } from "./Icons";
import type { GalleryItem } from "@/lib/types";
import { EASE } from "./motion/Reveal";

type Item = Pick<GalleryItem, "id" | "image_url" | "caption">;

export default function Gallery({ items, className }: { items: Item[]; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const openAt = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const move = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [move]);

  const current = index === null ? null : items[index];

  return (
    <>
      <div className={`gallery ${className ?? ""}`}>
        {items.map((g, i) => (
          <m.button
            key={g.id}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Ver foto${g.caption ? `: ${g.caption}` : ""}`}
            data-reveal=""
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.06 }}
          >
            <Image src={g.image_url} alt={g.caption || "Foto de la iglesia"} width={440} height={440} sizes="(max-width: 600px) 50vw, 25vw" />
          </m.button>
        ))}
      </div>

      <dialog ref={dialog} className="lightbox" aria-label="Foto ampliada" onClose={() => setIndex(null)}>
        {current && (
          <div className="lightbox-inner">
            {/* Foto a tamaño completo, sin recorte */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image_url} alt={current.caption || "Foto de la iglesia"} />
            {current.caption && <p className="muted">{current.caption}</p>}
            <button type="button" className="lightbox-btn" style={{ top: 16, right: 16 }} onClick={close} aria-label="Cerrar">
              <IconClose />
            </button>
            {items.length > 1 && (
              <>
                <button type="button" className="lightbox-btn" style={{ left: 16, top: "50%" }} onClick={() => move(-1)} aria-label="Foto anterior">
                  <IconChevronLeft />
                </button>
                <button type="button" className="lightbox-btn" style={{ right: 16, top: "50%" }} onClick={() => move(1)} aria-label="Foto siguiente">
                  <IconChevronRight />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
