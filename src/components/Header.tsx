"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site";
import { IconClose, IconMenu } from "./Icons";

type Props = { logoUrl: string | null; liveUrl: string | null };

function Brand({ logoUrl }: { logoUrl: string | null }) {
  return (
    <Link href="/" className="brand-link" aria-label="Iglesia Los Productores, inicio">
      {logoUrl && (
        // El logo puede cambiarse desde el panel; puede tener cualquier proporción.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="brand-logo" />
      )}
      <span className="brand-name">
        Iglesia
        <br />
        Los Productores
      </span>
    </Link>
  );
}

export default function Header({ logoUrl, liveUrl }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const btn = menuBtn.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const left = NAV.slice(0, 3);
  const right = NAV.slice(3);

  return (
    <header className="header" data-solid={scrolled ? "true" : "false"}>
      <div className="container header-inner">
        <nav className="nav" aria-label="Principal">
          {left.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Brand logoUrl={logoUrl} />
        <div className="header-actions">
          <nav className="nav nav-right" aria-label="Secundaria">
            {right.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link className="btn btn-primary btn-sm header-visit" href="/visitanos" style={{ marginLeft: 8 }}>
            Visítanos
          </Link>
          <button
            ref={menuBtn}
            type="button"
            className="menu-btn"
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen(true)}
          >
            <IconMenu />
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-movil" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="mobile-menu-top">
            <Brand logoUrl={logoUrl} />
            <button type="button" className="menu-btn" style={{ display: "inline-flex" }} aria-label="Cerrar menú" onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </div>
          <nav aria-label="Principal">
            <Link ref={firstLink} href="/" aria-current={pathname === "/" ? "page" : undefined}>
              Inicio
            </Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/visitanos">
              Planea tu visita
            </Link>
            {liveUrl && (
              <a className="btn btn-ghost" href={liveUrl} target="_blank" rel="noopener noreferrer">
                <span className="live-dot" aria-hidden="true" />
                Cultos en vivo
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
