"use client";

import Link from "next/link";
import { useRef } from "react";
import { browserClient, translateError } from "@/lib/supabase";
import type { SubmissionKind } from "@/lib/types";
import { IconAlert, IconCheck } from "../Icons";

export type Errors = Record<string, string | undefined>;

export type SubmissionInput = {
  kind: SubmissionKind;
  name: string | null;
  phone: string | null;
  email: string | null;
  visit_when: string | null;
  message: string | null;
  wants_contact: boolean;
  consent: boolean;
};

const clean = (v: string | null) => {
  const t = (v ?? "").trim().replace(/\s+/g, " ");
  return t ? t : null;
};

export async function sendSubmission(input: SubmissionInput, honeypot: string): Promise<"ok" | "demo" | string> {
  // Si un robot llenó el campo oculto, se responde "ok" sin guardar nada.
  if (honeypot.trim()) return "ok";
  const sb = browserClient();
  if (!sb) return "demo";
  const row = {
    ...input,
    name: clean(input.name),
    phone: clean(input.phone),
    email: clean(input.email)?.toLowerCase() ?? null,
    message: input.message?.trim() || null,
  };
  const { error } = await sb.from("submissions").insert(row);
  return error ? translateError(error.message) : "ok";
}

export function validPhone(v: string) {
  const digits = v.replace(/[\s\-()+]/g, "");
  return /^\d{6,15}$/.test(digits);
}

export function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <span id={id} className="field-error">
      <IconAlert /> {msg}
    </span>
  );
}

export function ErrorSummary({ errors, labels }: { errors: Errors; labels: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const list = Object.entries(errors).filter(([, v]) => v);
  if (list.length < 2) return null;
  return (
    <div ref={ref} className="notice notice-error" role="alert" tabIndex={-1} id="resumen-errores">
      <IconAlert size={18} />
      <div>
        <strong>Revisa estos campos:</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          {list.map(([k, v]) => (
            <li key={k}>
              <a href={`#${k}`}>{labels[k] ?? k}</a>: {v}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div className="field">
      <label className="check" htmlFor="consent">
        <input
          id="consent"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : undefined}
        />
        <span>
          Acepto que la iglesia use estos datos solo para atender mi mensaje. <Link href="/privacidad">Ver privacidad</Link>
        </span>
      </label>
      <FieldError id="consent-error" msg={error} />
    </div>
  );
}

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor="website">No llenar este campo</label>
      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function Result({ state, okText }: { state: "ok" | "demo" | string | null; okText: string }) {
  if (!state) return null;
  if (state === "ok")
    return (
      <div className="notice notice-ok" role="status">
        <IconCheck /> <span>{okText}</span>
      </div>
    );
  if (state === "demo")
    return (
      <div className="notice" role="status">
        <IconAlert size={18} />
        <span>La web todavía no está conectada a la base de datos, así que este formulario aún no guarda mensajes.</span>
      </div>
    );
  return (
    <div className="notice notice-error" role="alert">
      <IconAlert size={18} />
      <span>No se pudo enviar: {state} Tus datos siguen en el formulario; vuelve a intentar.</span>
    </div>
  );
}
