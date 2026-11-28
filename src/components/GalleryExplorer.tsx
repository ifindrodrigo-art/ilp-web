"use client";

import Image from "next/image";
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Lightbox, { type LightboxHandle } from "./Lightbox";
import { EASE } from "./motion/Reveal";
import type { Album } from "@/lib/media";
import type { GalleryItem } from "@/lib/types";

const PAGE = 24;
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

function year(d: string | null) {
  return d ? d.slice(0, 4) : null;
}

/* ------------------------------------------------------------------ */
/* Riel de álbumes: al bajar, las portadas pasan de derecha a izquierda */
/* ------------------------------------------------------------------ */
const RAIL_MAX = 12;
/** El riel avanza más rápido que el scroll, para no hacer la página eterna. */
const RAIL_SPEED = 0.6;

function AlbumRail({ albums: allAlbums, onPick, onAll }: { albums: Album[]; onPick: (name: string) => void; onAll: () => void }) {
  const albums = allAlbums.slice(0, RAIL_MAX);
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [shift, setShift] = useState(0);
  const [pinned, setPinned] = useState(false);

  useIsoLayout(() => {
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 901px)").matches;
      const s = track.current ? track.current.scrollWidth - window.innerWidth : 0;
      setPinned(desktop && !reduce && s > 0);
      setShift(Math.max(0, s));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduce, albums.length]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.3 });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={outer} className={`album-rail ${pinned ? "is-pinned" : ""}`} style={pinned ? { height: `calc(100vh + ${Math.round(shift * RAIL_SPEED)}px)` } : undefined}>
      <div className="album-rail-sticky">
        <div className="container album-rail-head">
          <span className="eyebrow">Álbumes</span>
          <span className="label num">{allAlbums.length} álbumes · desliza o baja</span>
        </div>
        <m.div ref={track} className="album-track" style={pinned ? { x } : undefined}>
          {albums.map((a, i) => (
            <m.button
              key={a.slug}
              type="button"
              className="album-card"
              onClick={() => onPick(a.name)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: EASE, delay: Math.min(i, 4) * 0.07 }}
              aria-label={`Ver el álbum ${a.name}, ${a.items.length} fotos`}
            >
              <span className="album-cover">
                <Image src={a.cover.image_url} alt="" fill sizes="(max-width: 900px) 80vw, 34vw" />
              </span>
              <span className="album-meta">
                <span className="album-index num">{String(i + 1).padStart(2, "0")}</span>
                <span className="album-name">{a.name}</span>
                <span className="label num">
                  {a.items.length} fotos{year(a.date) ? ` · ${year(a.date)}` : ""}
                </span>
              </span>
            </m.button>
          ))}
          <button type="button" className="album-card album-card-all" onClick={onAll}>
            <span className="album-meta">
              <span className="album-index num">{allAlbums.length} álbumes</span>
              <span className="album-name">Ver todas las fotos</span>
              <span className="label">Filtra por álbum y ábrelas en grande</span>
            </span>
          </button>
        </m.div>
        {pinned && (
          <div className="container">
            <div className="album-progress" aria-hidden="true">
              <m.span style={{ width: progress }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cursor "Ver" que sigue al mouse sobre el mosaico                     */
/* ------------------------------------------------------------------ */
function useFollower() {
  const x = useSpring(0, { stiffness: 400, damping: 32, mass: 0.4 });
  const y = useSpring(0, { stiffness: 400, damping: 32, mass: 0.4 });
  const [on, setOn] = useState(false);
  const bind = {
    onPointerMove: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    },
  };
  return { x, y, on, setOn, bind };
}

/* Tamaños del mosaico: un patrón que se repite cada 12 fotos */
const SPAN = ["big", "", "", "tall", "", "wide", "", "", "tall", "", "", ""];

export default function GalleryExplorer({ albums }: { albums: Album[] }) {
  const all = useMemo(() => albums.flatMap((a) => a.items), [albums]);
  const [filter, setFilter] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE);
  const box = useRef<LightboxHandle>(null);
  const mosaic = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cursor = useFollower();

  const list: GalleryItem[] = filter === "all" ? all : albums.find((a) => a.name === filter)?.items ?? [];
  const shown = list.slice(0, visible);

  const pick = (name: string) => {
    setFilter(name);
    setVisible(PAGE);
    mosaic.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <AlbumRail albums={albums} onPick={pick} onAll={() => pick("all")} />

      <section ref={mosaic} id="mosaico" className="section container mosaic-section" aria-labelledby="t-mosaico">
        <div className="section-head">
          <div className="stack">
            <span className="eyebrow">Todas las fotos</span>
            <h2 id="t-mosaico" className="h-lg">
              {filter === "all" ? "Momentos que vivimos juntos" : filter}
            </h2>
          </div>
          <span className="label num" aria-live="polite">
            {list.length} fotos
          </span>
        </div>

        <div className="filter-bar" role="toolbar" aria-label="Filtrar por álbum">
          {[{ name: "all", label: "Todo" }, ...albums.map((a) => ({ name: a.name, label: a.name }))].map((f) => (
            <button
              key={f.name}
              type="button"
              className={`filter-chip ${filter === f.name ? "is-active" : ""}`}
              aria-pressed={filter === f.name}
              onClick={() => {
                setFilter(f.name);
                setVisible(PAGE);
              }}
            >
              {filter === f.name && <m.span layoutId="chip-bg" className="filter-chip-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <div className="mosaic" {...cursor.bind} onPointerEnter={() => cursor.setOn(true)} onPointerLeave={() => cursor.setOn(false)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((g, i) => (
              <m.button
                layout={!reduce}
                key={g.id}
                type="button"
                className={`mosaic-item ${SPAN[i % SPAN.length]}`}
                onClick={() => box.current?.open(i)}
                aria-label={`Ver foto${g.caption ? `: ${g.caption}` : ""}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: EASE, delay: (i % PAGE) * 0.025 }}
              >
                <Image src={g.image_url} alt={g.caption || "Foto de la iglesia"} fill sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw" />
                <span className="mosaic-caption">
                  {g.album && filter === "all" && <span className="mosaic-album">{g.album}</span>}
                  {g.caption}
                </span>
              </m.button>
            ))}
          </AnimatePresence>
        </div>

        {visible < list.length && (
          <div className="mosaic-more">
            <button type="button" className="btn btn-primary" onClick={() => setVisible((v) => v + PAGE)}>
              Ver más fotos ({list.length - visible})
            </button>
          </div>
        )}
      </section>

      {/* Siempre se renderiza (igual en servidor y navegador); con "menos movimiento" lo oculta el CSS */}
      <m.div className="cursor-follow" aria-hidden="true" style={{ x: cursor.x, y: cursor.y }} animate={{ scale: cursor.on ? 1 : 0, opacity: cursor.on ? 1 : 0 }} transition={{ duration: 0.25 }}>
        Ver
      </m.div>

      <Lightbox ref={box} items={list} />
    </>
  );
}
