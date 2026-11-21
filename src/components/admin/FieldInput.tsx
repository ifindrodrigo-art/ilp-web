"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET, translateError } from "@/lib/supabase";
import type { Field } from "./config";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadImage(sb: SupabaseClient, file: File, folder: string): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Usa una foto JPG, PNG o WebP.");
  if (file.size > MAX_BYTES) throw new Error("La foto pesa más de 5 MB. Prueba con una más liviana.");
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(translateError(error.message));
  return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

type Props = {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  sb: SupabaseClient;
  folder: string;
  disabled?: boolean;
  error?: string;
};

export default function FieldInput({ field, value, onChange, sb, folder, disabled, error }: Props) {
  const id = `f-${field.key}`;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const describedBy = [field.help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const str = value === null || value === undefined ? "" : String(value);

  if (field.type === "checkbox") {
    return (
      <div className="field">
        <label className="check" htmlFor={id} style={{ color: "var(--ink)" }}>
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} disabled={disabled} aria-describedby={describedBy} />
          <span>{field.label}</span>
        </label>
        {field.help && <span id={`${id}-help`} className="hint" style={{ paddingLeft: 34 }}>{field.help}</span>}
      </div>
    );
  }

  let control: React.ReactNode;
  if (field.type === "textarea") {
    control = (
      <textarea id={id} className="input" value={str} maxLength={field.max} onChange={(e) => onChange(e.target.value)} disabled={disabled} aria-describedby={describedBy} aria-invalid={error ? true : undefined} />
    );
  } else if (field.type === "select") {
    control = (
      <select
        id={id}
        className="input"
        value={str}
        onChange={(e) => {
          const raw = e.target.value;
          const opt = field.options?.find((o) => String(o.value) === raw);
          onChange(raw === "" ? null : typeof opt?.value === "number" ? Number(raw) : raw);
        }}
        disabled={disabled}
        aria-describedby={describedBy}
      >
        {!field.required && <option value="">Ninguno</option>}
        {field.options?.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "image") {
    control = (
      <div className="stack" style={{ gap: 10 }}>
        {str && (
          // Vista previa de la foto subida
          // eslint-disable-next-line @next/next/no-img-element
          <img src={str} alt="" style={{ width: 200, maxWidth: "100%", background: "var(--tint)" }} />
        )}
        <div className="btn-row">
          <label className="btn btn-ghost btn-sm" htmlFor={id} style={{ cursor: uploading ? "progress" : "pointer" }}>
            {uploading ? "Subiendo…" : str ? "Cambiar foto" : "Subir foto"}
          </label>
          <input
            id={id}
            type="file"
            accept={TYPES.join(",")}
            className="sr-only"
            disabled={disabled || uploading}
            aria-describedby={describedBy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setUploadError(null);
              setUploading(true);
              try {
                onChange(await uploadImage(sb, file, folder));
              } catch (err) {
                setUploadError((err as Error).message);
              } finally {
                setUploading(false);
              }
            }}
          />
          {str && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(null)} disabled={disabled}>
              Quitar
            </button>
          )}
        </div>
        {uploadError && <span className="field-error">{uploadError}</span>}
      </div>
    );
  } else {
    const type = field.type === "youtube" || field.type === "url" ? "url" : field.type;
    control = (
      <input
        id={id}
        className="input"
        type={field.type === "youtube" ? "text" : type}
        inputMode={field.type === "number" ? "numeric" : undefined}
        value={str}
        maxLength={field.max}
        onChange={(e) => onChange(field.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        placeholder={field.type === "youtube" ? "https://www.youtube.com/watch?v=..." : undefined}
      />
    );
  }

  return (
    <div className="field">
      <label htmlFor={id}>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      {control}
      {field.help && <span id={`${id}-help`} className="hint">{field.help}</span>}
      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
