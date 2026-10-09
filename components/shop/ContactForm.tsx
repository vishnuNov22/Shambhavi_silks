"use client";

import { useState } from "react";
import { SITE, whatsappLink } from "@/data/site";

const REASONS = ["Bridal appointment", "Saree enquiry", "Lehenga fitting", "Order follow-up", "Something else"];

/**
 * No backend is connected in the prototype, so the form composes a WhatsApp
 * message (the boutique's real channel) rather than pretending to "send".
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please tell us your name."); return; }
    setError("");
    const msg = [
      `Hello ${SITE.shortName} Silks! This is ${name.trim()}.`,
      `Reason: ${reason}`,
      date ? `Preferred date: ${date}` : "",
      phone ? `Phone: ${phone}` : "",
      note ? `Note: ${note}` : "",
    ].filter(Boolean).join("\n");
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required aria-invalid={!!error} aria-describedby={error ? "cf-err" : undefined} />
      </div>
      <div className="field">
        <label htmlFor="cf-phone">Phone (optional)</label>
        <input id="cf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
      </div>
      <div className="field">
        <label htmlFor="cf-reason">I’d like to…</label>
        <select id="cf-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
          {REASONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-date">Preferred visit date (optional)</label>
        <input id="cf-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="field field--full">
        <label htmlFor="cf-note">Anything we should know?</label>
        <textarea id="cf-note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Colours you love, the occasion, your budget…" />
      </div>
      {error && <p id="cf-err" className="field__error" role="alert">{error}</p>}
      <button type="submit" className="lux-btn lux-btn--solid">
        <span className="lux-btn__fill" aria-hidden="true" /><span className="lux-btn__label">Continue on WhatsApp</span>
      </button>
      <p className="fine">Opens WhatsApp with your message ready to send to {SITE.phoneDisplay}. Nothing is sent until you press send.</p>
    </form>
  );
}
