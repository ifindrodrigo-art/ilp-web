import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  ratio?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/** Foto con proporción fija; si todavía no hay foto, muestra un fondo neutro. */
export default function Photo({ src, alt, ratio = "4 / 3", sizes = "(max-width: 900px) 100vw, 50vw", className, priority }: Props) {
  return (
    <div
      className={`photo ${className ?? ""}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      ) : (
        <div className="photo-fallback" aria-hidden="true">
          {/* Logo tenue mientras no hay foto */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" />
        </div>
      )}
    </div>
  );
}
