export default function PageHead({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="container page-head">
      <div className="stack">
        {eyebrow && <span className="eyebrow rise">{eyebrow}</span>}
        <h1 className="display rise rise-2" style={{ fontSize: "clamp(44px, 7.4vw, 92px)" }}>{title}</h1>
        {intro && <p className="lead rise rise-3">{intro}</p>}
      </div>
    </div>
  );
}
