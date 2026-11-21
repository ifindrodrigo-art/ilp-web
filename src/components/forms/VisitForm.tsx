"use client";

import { useState } from "react";
import { Consent, ErrorSummary, FieldError, Honeypot, Result, sendSubmission, validEmail, validPhone, type Errors } from "./shared";

const LABELS: Record<string, string> = {
  name: "Tu nombre",
  phone: "Teléfono o WhatsApp",
  email: "Correo",
  consent: "Privacidad",
};

const WHEN = ["Domingo 10:00 a.m.", "Domingo 5:00 p.m.", "Martes 7:00 p.m. (oración)", "Sábado (jóvenes o teens)", "Todavía no sé"];

export default function VisitForm() {
  const [v, setV] = useState({ name: "", phone: "", email: "", visit_when: WHEN[0], message: "", wants_contact: false, consent: false });
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function validate(x = v): Errors {
    const e: Errors = {};
    if (x.name.trim().length < 2) e.name = "Escribe tu nombre.";
    if (x.phone.trim() && !validPhone(x.phone)) e.phone = "Revisa el número: solo dígitos, por ejemplo 987 654 321.";
    if (x.email.trim() && !validEmail(x.email)) e.email = "Revisa el correo, por ejemplo nombre@gmail.com.";
    if (x.wants_contact && !x.phone.trim() && !x.email.trim()) e.phone = "Déjanos un teléfono o correo para contactarte.";
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
    setTouched({ name: true, phone: true, email: true, consent: true });
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
      { kind: "nuevo", name: v.name, phone: v.phone, email: v.email, visit_when: v.visit_when, message: v.message, wants_contact: v.wants_contact, consent: v.consent },
      hp,
    );
    setSending(false);
    setResult(r);
    if (r === "ok") {
      setV({ name: "", phone: "", email: "", visit_when: WHEN[0], message: "", wants_contact: false, consent: false });
      setTouched({});
    }
  }

  const err = (k: string) => (touched[k] ? errors[k] : undefined);

  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby="form-nuevo-titulo">
      <h3 id="form-nuevo-titulo" className="h-sm">Avísanos que vienes</h3>
      <ErrorSummary errors={touched.consent ? errors : {}} labels={LABELS} />

      <div className="field">
        <label htmlFor="name">Tu nombre *</label>
        <input
          id="name"
          className="input"
          autoComplete="name"
          value={v.name}
          maxLength={80}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          aria-invalid={err("name") ? true : undefined}
          aria-describedby={err("name") ? "name-error" : undefined}
          required
        />
        <FieldError id="name-error" msg={err("name")} />
      </div>

      <div className="field">
        <label htmlFor="phone">Teléfono o WhatsApp</label>
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
          aria-describedby={err("phone") ? "phone-error" : "phone-hint"}
        />
        <span id="phone-hint" className="hint">Opcional. Solo lo usamos para darte la bienvenida.</span>
        <FieldError id="phone-error" msg={err("phone")} />
      </div>

      <div className="field">
        <label htmlFor="email">Correo</label>
        <input
          id="email"
          className="input"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={v.email}
          maxLength={120}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
          aria-invalid={err("email") ? true : undefined}
          aria-describedby={err("email") ? "email-error" : undefined}
        />
        <FieldError id="email-error" msg={err("email")} />
      </div>

      <div className="field">
        <label htmlFor="visit_when">¿Cuándo piensas venir?</label>
        <select id="visit_when" className="input" value={v.visit_when} onChange={(e) => set("visit_when", e.target.value)}>
          {WHEN.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">¿Algo que quieras contarnos?</label>
        <textarea
          id="message"
          className="input"
          value={v.message}
          maxLength={2000}
          onChange={(e) => set("message", e.target.value)}
          aria-describedby="message-hint"
        />
        <span id="message-hint" className="hint">Por ejemplo, si vienes con niños o con alguien más.</span>
      </div>

      <label className="check" htmlFor="wants_contact">
        <input id="wants_contact" type="checkbox" checked={v.wants_contact} onChange={(e) => set("wants_contact", e.target.checked)} />
        <span>Quiero que alguien de la iglesia me contacte antes de ir.</span>
      </label>

      <Consent checked={v.consent} onChange={(c) => set("consent", c)} error={err("consent")} />
      <Honeypot value={hp} onChange={setHp} />

      <Result state={result} okText="¡Gracias! Recibimos tu mensaje. Te esperamos con los brazos abiertos." />

      <div>
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </form>
  );
}
