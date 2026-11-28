"use client";

import Image from "next/image";
import { useState } from "react";
import { IconPlay } from "./Icons";

/** Miniatura de YouTube que solo carga el video al tocarla (más liviano en celular). */
export default function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="video">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" unoptimized />
          <button type="button" className="video-play" onClick={() => setPlay(true)} aria-label={`Reproducir: ${title}`}>
            <span>
              <IconPlay />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
