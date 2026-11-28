import HeadCollage, { type CollageImage } from "./motion/HeadCollage";
import { HeroTitle } from "./motion/Hero";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Hasta 3 fotos para el collage animado de la derecha */
  images?: CollageImage[];
  children?: React.ReactNode;
};

/** Encabezado de las páginas internas: título por palabras y, si hay fotos, un collage en movimiento. */
export default function PageHead({ eyebrow, title, intro, images, children }: Props) {
  const hasMedia = Boolean(images && images.length);
  return (
    <div className={`container page-head ${hasMedia ? "page-head-media" : ""}`}>
      <div className="stack page-head-text">
        {eyebrow && <span className="eyebrow rise">{eyebrow}</span>}
        <HeroTitle className="display page-title" lines={[title]} />
        {intro && <p className="lead rise rise-3">{intro}</p>}
        {children && <div className="rise rise-4">{children}</div>}
      </div>
      {hasMedia && <HeadCollage images={images!} />}
    </div>
  );
}
