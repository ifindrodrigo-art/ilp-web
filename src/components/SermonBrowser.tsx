"use client";

import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { IconPlay } from "./Icons";
import { EASE } from "./motion/Reveal";
import { capitalize, formatDate } from "@/lib/format";
import { sermonCategory } from "@/lib/media";
import type { Sermon } from "@/lib/types";

/**
 * Reproductor grande arriba y la lista de cultos debajo. Al elegir uno,
 * pasa al reproductor (con una transición) y empieza a sonar.
 */
export default function SermonBrowser({ sermons }: { sermons: Sermon[] }) {
  const [current, setCurrent] = useState(sermons[0]);
  const [playing, setPlaying] = useState(false);
  const [cat, setCat] = useState("Todos");
  const player = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const cats = useMemo(() => ["Todos", ...new Set(sermons.map(sermonCategory))], [sermons]);
  const list = sermons.filter((s) => s.id !== current.id && (cat === "Todos" || sermonCategory(s) === cat));

  const choose = (s: Sermon) => {
    setCurrent(s);
    setPlaying(true);
    player.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  const meta = (s: Sermon) => [s.preacher, s.preached_on ? capitalize(formatDate(s.preached_on)) : null].filter(Boolean).join(" · ");

  return (
    <div className="stack" style={{ gap: 56 }}>
      <div ref={player} className="split-wide sermon-feature">
        <div className="video">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={current.id + String(playing)}
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${current.youtube_id}?autoplay=1&rel=0`}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image src={`https://i.ytimg.com/vi/${current.youtube_id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" unoptimized />
                  <button type="button" className="video-play" onClick={() => setPlaying(true)} aria-label={`Reproducir: ${current.title}`}>
                    <span>
                      <IconPlay />
                    </span>
                  </button>
                </>
              )}
            </m.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            className="stack"
            style={{ gap: 12 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="eyebrow">{current.id === sermons[0].id ? "Lo más reciente" : sermonCategory(current)}</span>
            <h2 className="h-md">{current.title}</h2>
            <p className="muted">{meta(current)}</p>
          </m.div>
        </AnimatePresence>
      </div>

      {sermons.length > 1 && (
        <div className="stack" style={{ gap: 24 }}>
          <div className="filter-bar" role="toolbar" aria-label="Filtrar cultos">
            {cats.map((c) => (
              <button key={c} type="button" className={`filter-chip ${cat === c ? "is-active" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>
                {cat === c && <m.span layoutId="sermon-chip" className="filter-chip-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span>{c}</span>
              </button>
            ))}
          </div>
          <m.div layout className="sermon-grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((s, i) => (
                <m.button
                  layout={!reduce}
                  key={s.id}
                  type="button"
                  className="sermon-card"
                  onClick={() => choose(s)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
                >
                  <span className="sermon-thumb">
                    <Image src={`https://i.ytimg.com/vi/${s.youtube_id}/mqdefault.jpg`} alt="" fill sizes="(max-width: 600px) 100vw, 33vw" unoptimized />
                    <span className="sermon-play" aria-hidden="true">
                      <IconPlay size={20} />
                    </span>
                  </span>
                  <span className="label">{sermonCategory(s)}</span>
                  <span className="h-sm sermon-title">{s.title}</span>
                  <span className="muted" style={{ fontSize: 14 }}>{meta(s)}</span>
                </m.button>
              ))}
            </AnimatePresence>
          </m.div>
        </div>
      )}
    </div>
  );
}
