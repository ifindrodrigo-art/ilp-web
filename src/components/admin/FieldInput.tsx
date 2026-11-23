"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET, translateError } from "@/lib/supabase";
import type { Field } from "./config";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
/** Lado más largo con el que se guardan las fotos. Suficiente para pantallas grandes. */
const MAX_SIDE = 2000;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Achica la foto en el navegador antes de subirla (máximo 2000 px, WebP de buena calidad).
 * Una foto de celular de 6 MB queda en unos 300 a 600 KB, así el espacio gratuito de
 * Supabase alcanza para miles de fotos. Si el navegador no puede, sube la original.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 500 * 1024) {
      bmp.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    let blob = await toBlob(canvas, "image/webp", 0.82);
    // Algunos Safari no guardan WebP: usamos JPEG, salvo en PNG (perdería la transparencia).
    if (!blob || blob.type !== "image/webp") {
      if (file.type === "image/png") return file;
      blob = await toBlob(canvas, "image/jpeg", 0.85);
    }
    if (!blob || blob.size >= file.size) return file;
    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${ext}`, { type: blob.type });
  } catch {
    return file;
  }
}

export async function uploadImage(sb: SupabaseClient, original: File, folder: string): Promise<string> {
  if (!TYPES.includes(original.type)) throw new Error("Usa una foto JPG, PNG o WebP.");
  const file = await compressImage(original);
  if (file.size > MAX_BYTES) throw new Error("La foto pesa más de 5 MB incluso achicada. Prueba con otra.");
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
