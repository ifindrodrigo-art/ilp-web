"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { translateError } from "@/lib/supabase";
import { SETTINGS_FIELDS } from "./config";
import FieldInput from "./FieldInput";

type Row = Record<string, unknown>;

export default function SettingsEditor({ sb }: { sb: SupabaseClient }) {
  const [row, setRow] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    sb.from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (e) setError(translateError(e.message));
        else if (!data) setError("No encontré la fila de ajustes. ¿Corriste supabase/schema.sql?");
        else setRow(data as Row);
      });
  }, [sb]);

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    if (!row) return;
    if (!String(row.address ?? "").trim()) return setError("La dirección es obligatoria.");
    setSaving(true);
    setError(null);
    const payload: Row = { updated_at: new Date().toISOString() };
    for (const f of SETTINGS_FIELDS) {
      // Solo columnas que ya existen en la base (por si falta correr una actualización)
      if (!(f.key in row)) continue;
      const v = row[f.key];
      payload[f.key] = typeof v === "string" ? v.trim() || null : v ?? null;
    }
    payload.address = String(row.address).trim();
    const { error: e } = await sb.from("settings").update(payload).eq("id", 1);
    setSaving(false);
    if (e) return setError(translateError(e.message));
    setFlash("Ajustes guardados. En la web se verán en alrededor de un minuto.");
  }

  if (!row) return error ? <div className="notice notice-error" role="alert">{error}</div> : <p className="muted">Cargando…</p>;

  return (
    <form className="form" onSubmit={save} noValidate>
      <div className="stack" style={{ gap: 6 }}>
        <h2 className="h-md">Ajustes de la web</h2>
        <p className="muted" style={{ fontSize: 15 }}>Contacto, logo, fotos principales, redes y los textos de Nosotros.</p>
      </div>
      <div className="admin-form-grid">
        {SETTINGS_FIELDS.filter((f) => f.key in row).map((f) => (
          <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "span-2" : undefined}>
            <FieldInput
              field={f}
              value={row[f.key]}
              onChange={(v) => {
                setRow((r) => (r ? { ...r, [f.key]: v } : r));
                setFlash(null);
              }}
              sb={sb}
              folder="ajustes"
            />
          </div>
        ))}
      </div>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      {flash && <div className="notice notice-ok" role="status">{flash}</div>}
      <div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar ajustes"}
        </button>
      </div>
    </form>
  );
}
