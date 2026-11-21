"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { translateError } from "@/lib/supabase";
import { youtubeId } from "@/lib/format";
import type { Field, TableConfig } from "./config";
import FieldInput, { uploadImage } from "./FieldInput";

type Row = Record<string, unknown>;

type Props = {
  sb: SupabaseClient;
  config: TableConfig;
  ministryOptions: { value: string; label: string }[];
  onChanged?: () => void;
};

function toDb(field: Field, v: unknown): unknown {
  if (field.type === "checkbox") return Boolean(v);
  if (field.type === "number") return v === null || v === "" || Number.isNaN(Number(v)) ? 0 : Number(v);
  if (field.type === "youtube") return typeof v === "string" ? youtubeId(v) : v;
  if (typeof v === "string") {
    const t = v.trim();
    return t === "" ? null : t;
  }
  return v ?? null;
}

export default function TableEditor({ sb, config, ministryOptions, onChanged }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [bulkAlbum, setBulkAlbum] = useState("");
  const [bulkState, setBulkState] = useState<string | null>(null);

  const fields = useMemo(
    () => config.fields.map((f) => (f.key === "ministry_slug" ? { ...f, options: ministryOptions } : f)),
    [config.fields, ministryOptions],
  );

  const load = useCallback(async () => {
    setLoading(true);
    let q = sb.from(config.table).select("*");
    for (const o of config.order) q = q.order(o.column, { ascending: o.ascending, nullsFirst: false });
    const { data, error } = await q;
    setLoading(false);
    if (error) return setLoadError(translateError(error.message));
    setLoadError(null);
    setRows((data as Row[]) ?? []);
  }, [sb, config]);

  useEffect(() => {
    load();
    setEditing(null);
  }, [load]);

  function startNew() {
    setIsNew(true);
    setEditing({ ...config.defaults });
    setErrors({});
    setFormError(null);
  }

  function startEdit(r: Row) {
    setIsNew(false);
    setEditing({ ...r });
    setErrors({});
    setFormError(null);
  }

  function validate(r: Row) {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const v = r[f.key];
      const empty = v === null || v === undefined || (typeof v === "string" && v.trim() === "");
      if (f.required && empty) e[f.key] = "Este campo es obligatorio.";
      if (f.key === "slug" && typeof v === "string" && v && !/^[a-z0-9-]{2,40}$/.test(v)) e.slug = "Solo minúsculas, números y guiones.";
      if (f.type === "youtube" && typeof v === "string" && v && !/^[A-Za-z0-9_-]{11}$/.test(youtubeId(v))) e[f.key] = "No reconozco ese link de YouTube.";
      if (f.type === "time" && typeof v === "string" && v && !/^\d{2}:\d{2}/.test(v)) e[f.key] = "Usa el formato 19:00.";
    }
    if (r.ends_on && r.starts_on && String(r.ends_on) < String(r.starts_on)) e.ends_on = "La fecha de fin no puede ser antes del inicio.";
    return e;
  }

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    if (!editing) return;
    const e = validate(editing);
    setErrors(e);
    if (Object.keys(e).length) {
      setFormError("Revisa los campos marcados.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload: Row = {};
    for (const f of fields) {
      if (!isNew && f.createOnly) continue;
      let v = toDb(f, editing[f.key]);
      if (f.type === "time" && typeof v === "string") v = v.slice(0, 5);
      payload[f.key] = v;
    }
    const res = isNew
      ? await sb.from(config.table).insert(payload)
      : await sb.from(config.table).update(payload).eq(config.pk, editing[config.pk] as string);
    setSaving(false);
    if (res.error) return setFormError(translateError(res.error.message));
    setEditing(null);
    setFlash(isNew ? `Se agregó el ${config.singular}. En la web se verá en alrededor de un minuto.` : "Cambios guardados. En la web se verán en alrededor de un minuto.");
    await load();
    onChanged?.();
  }

  async function remove(r: Row) {
    const { error } = await sb.from(config.table).delete().eq(config.pk, r[config.pk] as string);
    setConfirmDelete(null);
    if (error) return setFlash(`No se pudo borrar: ${translateError(error.message)}`);
    setFlash(`Se borró el ${config.singular}.`);
    if (editing && editing[config.pk] === r[config.pk]) setEditing(null);
    await load();
    onChanged?.();
  }

  async function bulkUpload(files: FileList) {
    const list = Array.from(files);
    let ok = 0;
    const failed: string[] = [];
    for (let i = 0; i < list.length; i++) {
      setBulkState(`Subiendo ${i + 1} de ${list.length}…`);
      try {
        const url = await uploadImage(sb, list[i], config.table);
        const { error } = await sb.from(config.table).insert({ image_url: url, album: bulkAlbum.trim() || null, published: true, sort: 10 });
        if (error) throw new Error(translateError(error.message));
        ok++;
      } catch (err) {
        failed.push(`${list[i].name}: ${(err as Error).message}`);
      }
    }
    setBulkState(failed.length ? `Se subieron ${ok}. No se pudieron subir: ${failed.join(" · ")}` : `Se subieron ${ok} fotos. Agrega descripciones con "Editar".`);
    await load();
    onChanged?.();
  }

  if (editing) {
    return (
      <form className="form" onSubmit={save} noValidate>
        <div className="admin-bar">
          <h2 className="h-md">{isNew ? `Nuevo ${config.singular}` : `Editar ${config.singular}`}</h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
            Volver a la lista
          </button>
        </div>
        <div className="admin-form-grid">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "span-2" : undefined}>
              <FieldInput
                field={f}
                value={editing[f.key]}
                onChange={(v) => {
                  setEditing((cur) => (cur ? { ...cur, [f.key]: v } : cur));
                  if (errors[f.key]) setErrors((er) => ({ ...er, [f.key]: "" }));
                }}
                sb={sb}
                folder={config.table}
                disabled={!isNew && f.createOnly}
                error={errors[f.key] || undefined}
              />
            </div>
          ))}
        </div>
        {formError && (
          <div className="notice notice-error" role="alert">
            {formError}
          </div>
        )}
        <div className="btn-row">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="admin-bar">
        <div className="stack" style={{ gap: 6 }}>
          <h2 className="h-md">{config.title}</h2>
          <p className="muted" style={{ fontSize: 15, maxWidth: 640 }}>{config.intro}</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={startNew}>
          Agregar {config.singular}
        </button>
      </div>

      {config.bulkUpload && (
        <div className="card stack" style={{ gap: 12, padding: 20 }}>
          <span className="label">Subir varias fotos a la vez</span>
          <div className="btn-row" style={{ alignItems: "center" }}>
            <label className="sr-only" htmlFor="bulk-album">Álbum para estas fotos</label>
            <input id="bulk-album" className="input" style={{ maxWidth: 320 }} placeholder="Álbum (opcional)" value={bulkAlbum} onChange={(e) => setBulkAlbum(e.target.value)} />
            <label className="btn btn-ghost btn-sm" htmlFor="bulk-files" style={{ cursor: "pointer" }}>
              Elegir fotos
            </label>
            <input
              id="bulk-files"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) bulkUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
          {bulkState && <p className="muted" role="status">{bulkState}</p>}
        </div>
      )}

      {flash && (
        <div className="notice notice-ok" role="status">
          {flash}
        </div>
      )}
      {loadError && (
        <div className="notice notice-error" role="alert">
          {loadError}
        </div>
      )}

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : rows.length === 0 ? (
        <div className="card empty">
          <p className="muted">Todavía no hay {config.title.toLowerCase()}.</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={startNew}>
            Agregar el primero
          </button>
        </div>
      ) : (
        <ul className="admin-list">
          {rows.map((r) => {
            const key = String(r[config.pk]);
            const hidden = config.visibleKey ? !r[config.visibleKey] : false;
            return (
              <li key={key} className="admin-row">
                {typeof r.image_url === "string" && r.image_url && (
                  // Miniatura en la lista del panel
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image_url} alt="" className="admin-thumb" />
                )}
                <div className="stack" style={{ gap: 2, minWidth: 0, flex: 1 }}>
                  <span style={{ fontWeight: 500 }}>{config.rowTitle(r)}</span>
                  <span className="label" style={{ fontWeight: 400 }}>{config.rowMeta(r)}</span>
                </div>
                {hidden && <span className="chip">Oculto</span>}
                {confirmDelete === key ? (
                  <div className="btn-row" role="group" aria-label="Confirmar borrado">
                    <span className="muted" style={{ alignSelf: "center", fontSize: 14 }}>¿Borrar?</span>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(r)}>
                      Sí, borrar
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                      No
                    </button>
                  </div>
                ) : (
                  <div className="btn-row">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(r)}>
                      Editar
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(key)} aria-label={`Borrar ${config.rowTitle(r)}`}>
                      Borrar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
