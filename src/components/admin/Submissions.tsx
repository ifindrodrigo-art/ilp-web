"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { translateError } from "@/lib/supabase";
import { whatsappLink } from "@/lib/format";
import type { Submission } from "@/lib/types";

type Filter = "nuevo" | "atendido" | "todos";
type Kind = "todos" | "nuevo" | "oracion";

function when(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" }).format(new Date(iso));
}

export default function Submissions({ sb, onCount }: { sb: SupabaseClient; onCount: (n: number) => void }) {
  const [rows, setRows] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<Filter>("nuevo");
  const [kind, setKind] = useState<Kind>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: e } = await sb.from("submissions").select("*").order("created_at", { ascending: false }).limit(500);
    setLoading(false);
    if (e) return setError(translateError(e.message));
    const list = (data as Submission[]) ?? [];
    setRows(list);
    onCount(list.filter((r) => r.status === "nuevo").length);
  }, [sb, onCount]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(r: Submission, status: Submission["status"]) {
    const { error: e } = await sb.from("submissions").update({ status }).eq("id", r.id);
    if (e) return setError(translateError(e.message));
    load();
  }

  async function remove(r: Submission) {
    const { error: e } = await sb.from("submissions").delete().eq("id", r.id);
    setConfirmDelete(null);
    if (e) return setError(translateError(e.message));
    load();
  }

  const shown = rows.filter((r) => (filter === "todos" || r.status === filter) && (kind === "todos" || r.kind === kind));

  const pill = (active: boolean) => `btn btn-sm ${active ? "btn-selected" : "btn-ghost"}`;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="stack" style={{ gap: 6 }}>
        <h2 className="h-md">Formularios recibidos</h2>
        <p className="muted" style={{ fontSize: 15, maxWidth: 680 }}>
          Mensajes de &quot;Soy nuevo&quot; y peticiones de oración. Son datos personales: no los compartas fuera del equipo y bórralos cuando ya no hagan falta.
        </p>
      </div>
      <div className="btn-row" role="group" aria-label="Filtrar por estado">
        {(["nuevo", "atendido", "todos"] as Filter[]).map((f) => (
          <button key={f} type="button" className={pill(filter === f)} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "nuevo" ? "Por atender" : f === "atendido" ? "Atendidos" : "Todos"}
          </button>
        ))}
        <span aria-hidden="true" style={{ width: 12 }} />
        {(["todos", "nuevo", "oracion"] as Kind[]).map((k) => (
          <button key={k} type="button" className={pill(kind === k)} aria-pressed={kind === k} onClick={() => setKind(k)}>
            {k === "todos" ? "Todo tipo" : k === "nuevo" ? "Soy nuevo" : "Oración"}
          </button>
        ))}
      </div>

      {error && <div className="notice notice-error" role="alert">{error}</div>}

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : shown.length === 0 ? (
        <div className="card empty">
          <p className="muted">No hay mensajes en esta vista.</p>
        </div>
      ) : (
        <ul className="admin-list">
          {shown.map((r) => {
            const wa = whatsappLink(r.phone, r.name ? `Hola ${r.name.split(" ")[0]}, te escribimos de la Iglesia Los Productores.` : undefined);
            return (
              <li key={r.id} className="admin-row" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
                <div className="stack" style={{ gap: 6, flex: "1 1 360px", minWidth: 0 }}>
                  <div className="btn-row" style={{ gap: 8, alignItems: "center" }}>
                    <span className="chip">{r.kind === "nuevo" ? "Soy nuevo" : "Oración"}</span>
                    {r.status === "nuevo" && <span className="chip" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>Por atender</span>}
                    {r.wants_contact && <span className="chip">Quiere que lo contacten</span>}
                    <span className="label" style={{ fontWeight: 400 }}>{when(r.created_at)}</span>
                  </div>
                  <span style={{ fontWeight: 500 }}>{r.name || "Anónimo"}</span>
                  {(r.phone || r.email) && <span className="muted" style={{ fontSize: 15 }}>{[r.phone, r.email].filter(Boolean).join(" · ")}</span>}
                  {r.visit_when && <span className="muted" style={{ fontSize: 15 }}>Piensa venir: {r.visit_when}</span>}
                  {r.message && <p style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{r.message}</p>}
                </div>
                <div className="btn-row">
                  {wa && (
                    <a className="btn btn-ghost btn-sm" href={wa} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  )}
                  {r.status === "nuevo" ? (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus(r, "atendido")}>
                      Marcar atendido
                    </button>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus(r, "nuevo")}>
                      Volver a por atender
                    </button>
                  )}
                  {confirmDelete === r.id ? (
                    <>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(r)}>
                        Sí, borrar
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                        No
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(r.id)}>
                      Borrar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
