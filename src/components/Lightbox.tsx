"use client";

import Image from "next/image";
import { AnimatePresence, m, type PanInfo } from "motion/react";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { IconChevronLeft, IconChevronRight, IconClose } from "./Icons";
import { EASE } from "./motion/Reveal";

export type LightboxItem = { id: string; image_url: string; caption: string | null; album?: string | null };
export type LightboxHandle = { open: (index: number) => void };

const slide = {
  enter: (d: number) => ({ x: d > 0 ? "18%" : "-18%", opacity: 0, scale: 0.96 }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-18%" : "18%", opacity: 0, scale: 0.96 }),
};

/**
 * Visor a pantalla completa: flechas, teclado (← → Esc), deslizar con el dedo
 * y una tira de miniaturas. Usa <dialog>, así el foco queda dentro mientras está abierto.
 */
const Lightbox = forwardRef<LightboxHandle, { items: LightboxItem[] }>(function Lightbox({ items }, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [[index, dir], setState] = useState<[number | null, number]>([null, 0]);

  useImperativeHandle(ref, () => ({
    open: (i: number) => {
      setState([i, 0]);
      dialog.current?.showModal();
    },
  }));

  const move = useCallback(
    (d: number) => setState(([i]) => (i === null ? [i, d] : [(i + d + items.length) % items.length, d])),
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

  // La miniatura activa siempre a la vista
  useEffect(() => {
    if (index === null) return;
    strip.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) move(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) move(-1);
  };

  const current = index === null ? null : items[index];

  return (
    <dialog ref={dialog} className="lightbox" aria-label="Foto ampliada" onClose={() => setState([null, 0])}>
      {current && (
        <div className="lightbox-inner">
          <div className="lightbox-top">
            <span className="lightbox-count num">
              {index! + 1} / {items.length}
            </span>
            {current.album && <span className="lightbox-album">{current.album}</span>}
            <button type="button" className="lightbox-btn" onClick={() => dialog.current?.close()} aria-label="Cerrar" autoFocus>
              <IconClose />
            </button>
          </div>

          <div className="lightbox-stage">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <m.figure
                key={current.id}
                className="lightbox-figure"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE }}
                drag={items.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current.image_url} alt={current.caption || "Foto de la iglesia"} draggable={false} />
                {current.caption && <figcaption>{current.caption}</figcaption>}
              </m.figure>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button type="button" className="lightbox-btn lightbox-prev" onClick={() => move(-1)} aria-label="Foto anterior">
                  <IconChevronLeft />
                </button>
                <button type="button" className="lightbox-btn lightbox-next" onClick={() => move(1)} aria-label="Foto siguiente">
                  <IconChevronRight />
                </button>
              </>
            )}
          </div>

          {items.length > 1 && (
            <div className="lightbox-strip" ref={strip}>
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  data-i={i}
                  className={i === index ? "is-active" : undefined}
                  onClick={() => setState([i, i > index! ? 1 : -1])}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={i === index || undefined}
                >
                  <Image src={it.image_url} alt="" width={96} height={96} sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
});

export default Lightbox;
