"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { browserClient, translateError } from "@/lib/supabase";
import { TABLES } from "./config";
import TableEditor from "./TableEditor";
import SettingsEditor from "./SettingsEditor";
import Submissions from "./Submissions";

type Tab = "formularios" | "ajustes" | string;

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Escribe tu correo y tu contraseña.");
    setSending(true);
    setError(null);
    const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setSending(false);
    if (err) setError(translateError(err.message));
  }

  return (
    <div className="admin-center">
      <form className="admin-box form" onSubmit={submit} noValidate>
        <div className="stack" style={{ gap: 6 }}>
          <h1 className="h-md">Panel de la web</h1>
          <p className="muted" style={{ fontSize: 15 }}>Solo para el equipo de Comunicaciones.</p>
        </div>
        <div className="field">
          <label htmlFor="admin-email">Correo</label>
          <input id="admin-email" className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="admin-pass">Contraseña</label>
          <input id="admin-pass" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? "Entrando…" : "Entrar"}
        </button>
        <Link href="/" className="label">Volver a la web</Link>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const sb = browserClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("formularios");
  const [pending, setPending] = useState(0);
  const [ministryOptions, setMinistryOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!sb || !session) {
      setIsAdmin(null);
      return;
    }
    sb.from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [sb, session]);

  const loadMinistries = useCallback(() => {
    if (!sb) return;
    sb.from("ministries")
      .select("slug,name")
      .order("sort")
      .then(({ data }) => setMinistryOptions((data ?? []).map((m) => ({ value: m.slug as string, label: m.name as string }))));
  }, [sb]);

  useEffect(() => {
    if (isAdmin) loadMinistries();
  }, [isAdmin, loadMinistries]);

  if (!sb) {
    return (
      <div className="admin-center">
        <div className="admin-box stack" style={{ gap: 12, maxWidth: 520 }}>
          <h1 className="h-md">Falta conectar Supabase</h1>
          <p className="muted">
            El panel se activa cuando agregas las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en Vercel. Los pasos están en el README del repositorio.
          </p>
          <Link href="/" className="btn btn-ghost">Volver a la web</Link>
        </div>
      </div>
    );
  }

  if (session === undefined) return <div className="admin-center"><p className="muted">Cargando…</p></div>;
  if (!session) return <Login sb={sb} />;
  if (isAdmin === null) return <div className="admin-center"><p className="muted">Revisando permisos…</p></div>;
  if (!isAdmin) {
    return (
      <div className="admin-center">
        <div className="admin-box stack" style={{ gap: 12, maxWidth: 520 }}>
          <h1 className="h-md">Tu usuario no tiene permiso</h1>
          <p className="muted">
            Entraste como {session.user.email}, pero este usuario todavía no es administrador. Pide que corran supabase/hacer-admin.sql con tu correo.
          </p>
          <button type="button" className="btn btn-ghost" onClick={() => sb.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "formularios", label: pending ? `Formularios (${pending})` : "Formularios" },
    ...TABLES.map((t) => ({ id: t.table, label: t.title })),
    { id: "ajustes", label: "Ajustes" },
  ];
  const config = TABLES.find((t) => t.table === tab);

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="container admin-top-inner">
          <span className="brand-name">Panel · Los Productores</span>
          <div className="btn-row" style={{ alignItems: "center" }}>
            <span className="label" style={{ fontWeight: 400 }}>{session.user.email}</span>
            <Link className="btn btn-ghost btn-sm" href="/" target="_blank">
              Ver la web
            </Link>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => sb.auth.signOut()}>
              Salir
            </button>
          </div>
        </div>
      </header>
      <div className="container admin-body">
        <nav className="admin-tabs" aria-label="Secciones del panel">
          {tabs.map((t) => (
            <button key={t.id} type="button" className={`admin-tab${tab === t.id ? " is-active" : ""}`} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <section className="admin-panel" aria-live="polite">
          {tab === "formularios" && <Submissions sb={sb} onCount={setPending} />}
          {tab === "ajustes" && <SettingsEditor sb={sb} />}
          {config && (
            <TableEditor
              key={config.table}
              sb={sb}
              config={config}
              ministryOptions={ministryOptions}
              onChanged={config.table === "ministries" ? loadMinistries : undefined}
            />
          )}
        </section>
      </div>
    </div>
  );
}
