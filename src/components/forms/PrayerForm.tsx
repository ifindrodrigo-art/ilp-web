"use client";

import { useState } from "react";
import { Consent, ErrorSummary, FieldError, Honeypot, Result, sendSubmission, validPhone, type Errors } from "./shared";

const LABELS: Record<string, string> = {
  message: "Tu petición",
  phone: "Teléfono o WhatsApp",
  consent: "Privacidad",
};

export default function PrayerForm() {
  const [v, setV] = useState({ name: "", phone: "", message: "", wants_contact: false, consent: false });
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function validate(x = v): Errors {
    const e: Errors = {};
    if (x.message.trim().length < 3) e.message = "Cuéntanos por qué quieres que oremos.";
    if (x.phone.trim() && !validPhone(x.phone)) e.phone = "Revisa el número: solo dígitos, por ejemplo 987 654 321.";
    if (x.wants_contact && !x.phone.trim()) e.phone = "Déjanos un teléfono para poder contactarte.";
    if (!x.consent) e.consent = "Marca la casilla para poder enviar.";
    return e;
  }

  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    const next = { ...v, [k]: val };
    setV(next);
    if (errors[k as string] || (k === "wants_contact" && errors.phone)) setErrors(validate(next));
    setResult(null);
  }

  function blur(k: string) {
    setTouched((t) => ({ ...t, [k]: true }));
    const e = validate();
    setErrors((prev) => ({ ...prev, [k]: e[k] }));
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setTouched({ message: true, phone: true, consent: true });
    const keys = Object.keys(e).filter((k) => e[k]);
    if (keys.length) {
      requestAnimationFrame(() => {
        const target = keys.length > 1 ? document.getElementById("resumen-errores") : document.getElementById(keys[0]);
        target?.focus();
      });
      return;
    }
    setSending(true);
    const r = await sendSubmission(
      { kind: "oracion", name: v.name, phone: v.phone, email: null, visit_when: null, message: v.message, wants_contact: v.wants_contact, consent: v.consent },
      hp,
    );
    setSending(false);
    setResult(r);
    if (r === "ok") {
      setV({ name: "", phone: "", message: "", wants_contact: false, consent: false });
      setTouched({});
    }
  }

  const err = (k: string) => (touched[k] ? errors[k] : undefined);

  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby="form-oracion-titulo">
      <h2 id="form-oracion-titulo" className="h-sm">Petición de oración</h2>
      <ErrorSummary errors={touched.consent ? errors : {}} labels={LABELS} />

      <div className="field">
        <label htmlFor="message">Tu petición *</label>
        <textarea
          id="message"
          className="input"
          value={v.message}
          maxLength={2000}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={err("message") ? true : undefined}
          aria-describedby={err("message") ? "message-error" : undefined}
          required
        />
        <FieldError id="message-error" msg={err("message")} />
      </div>

      <div className="field">
        <label htmlFor="pname">Tu nombre</label>
        <input id="pname" className="input" autoComplete="name" value={v.name} maxLength={80} onChange={(e) => set("name", e.target.value)} aria-describedby="pname-hint" />
        <span id="pname-hint" className="hint">Opcional. Puedes dejarlo en blanco si prefieres que sea anónima.</span>
      </div>

      <label className="check" htmlFor="wants_contact">
        <input id="wants_contact" type="checkbox" checked={v.wants_contact} onChange={(e) => set("wants_contact", e.target.checked)} />
        <span>Quiero que un pastor me contacte.</span>
      </label>

      <div className="field">
        <label htmlFor="phone">Teléfono o WhatsApp{v.wants_contact ? " *" : ""}</label>
        <input
          id="phone"
          className="input"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={v.phone}
          maxLength={30}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={() => blur("phone")}
          aria-invalid={err("phone") ? true : undefined}
          aria-describedby={err("phone") ? "phone-error" : undefined}
        />
        <FieldError id="phone-error" msg={err("phone")} />
      </div>

      <Consent checked={v.consent} onChange={(c) => set("consent", c)} error={err("consent")} />
      <Honeypot value={hp} onChange={setHp} />

      <Result state={result} okText="Recibimos tu petición. Estaremos orando por ti." />

      <div>
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? "Enviando…" : "Enviar petición"}
        </button>
      </div>
    </form>
  );
}
