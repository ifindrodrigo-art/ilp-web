export default function PageHead({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="container page-head">
      <div className="stack">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="display" style={{ fontSize: "clamp(44px, 7.4vw, 92px)" }}>{title}</h1>
        {intro && <p className="lead">{intro}</p>}
      </div>
    </div>
  );
}
