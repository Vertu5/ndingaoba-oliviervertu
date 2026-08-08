"use client";

import { useState } from "react";

export default function ContactView({ lang }: { lang: "fr" | "en" }) {
  const [copied, setCopied] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const directEmail = "obavertu@gmail.com";
  const phone = "+32 497 21 21 37";
  const phoneClean = "+32497212137";
  const location = "Bruxelles, Belgique";

  const copyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg(lang === "fr" ? "Veuillez saisir un message." : "Please enter a message.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Visiteur",
          email: emailInput || "Non renseigné",
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("");
        setName("");
        setEmailInput("");
      } else {
        setErrorMsg(data.error || "Erreur d'envoi");
        setStatus("error");
      }
    } catch {
      setErrorMsg(lang === "fr" ? "Erreur réseau, réessayez." : "Network error, try again.");
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 space-y-8">
      {/* Header Intro */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8">
        <h3 className="font-display text-xl font-medium text-[var(--accent)] md:text-2xl">
          {lang === "fr" ? "Me contacter" : "Get in Touch"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] max-w-xl">
          {lang === "fr"
            ? "Disponible pour des opportunités en Software Development, Ingénierie IA ou projets complexes. Écrivez-moi directement ci-dessous ou via mes coordonnées."
            : "Available for Software Development, AI Engineering opportunities, or complex projects. Send a message below or reach out directly."}
        </p>
      </div>

      {/* Formulaire de contact classique & élégant */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">💬</span>
          <h4 className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            {lang === "fr" ? "Envoyer un message direct" : "Send a direct message"}
          </h4>
        </div>

        {status === "success" ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
            <span className="text-3xl">🎉</span>
            <h5 className="font-display text-base font-semibold text-emerald-400">
              {lang === "fr" ? "Message transmis avec succès !" : "Message sent successfully!"}
            </h5>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              {lang === "fr"
                ? "Merci pour votre message ! Je recevrai une notification et y répondrai dans les plus brefs délais."
                : "Thank you for your message! I will be notified and respond as soon as possible."}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="font-mono text-xs text-[var(--accent)] underline hover:no-underline mt-2 inline-block"
            >
              {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  {lang === "fr" ? "Votre nom / entreprise" : "Your name / company"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "fr" ? "Ex: Jean Dupont" : "E.g. Alex Smith"}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  {lang === "fr" ? "Votre adresse email" : "Your email address"}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="email@domaine.com"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                {lang === "fr" ? "Votre message *" : "Your message *"}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  lang === "fr"
                    ? "Bonjour Olivier, je souhaite vous contacter concernant..."
                    : "Hello Olivier, I would like to reach out regarding..."
                }
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] p-3.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:border-[var(--accent)] focus:outline-none resize-y"
              />
            </div>

            {status === "error" && (
              <p className="font-mono text-xs text-red-400 font-medium">
                ⚠️ {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                📩 Notification envoyée à <span className="text-[var(--accent)]">obavertu@gmail.com</span>
              </span>

              <button
                type="submit"
                disabled={status === "loading"}
                className="font-mono rounded bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading"
                  ? (lang === "fr" ? "Envoi en cours..." : "Sending...")
                  : (lang === "fr" ? "Envoyer le message 🚀" : "Send Message 🚀")}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Cards Coordonnées Directes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Email */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-6 flex flex-col justify-between transition-colors hover:border-[var(--accent)]/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✉️</span>
              <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                Email Direct
              </span>
            </div>
            <p className="font-mono text-base font-medium text-[var(--text)] select-all">
              {directEmail}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {lang === "fr" ? "Réponse sous 24h" : "Response within 24h"}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3 pt-4 border-t border-dashed border-[var(--border)]">
            <a
              href={`mailto:${directEmail}`}
              className="font-mono rounded bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
            >
              {lang === "fr" ? "Écrire un email ↗" : "Send email ↗"}
            </a>
            <button
              onClick={copyEmail}
              className="font-mono rounded border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:border-[var(--text)]"
            >
              {copied ? (lang === "fr" ? "✓ Copié !" : "✓ Copied!") : (lang === "fr" ? "Copier" : "Copy")}
            </button>
          </div>
        </div>

        {/* Card Téléphone */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-6 flex flex-col justify-between transition-colors hover:border-[var(--accent)]/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📱</span>
              <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                {lang === "fr" ? "Téléphone & WhatsApp" : "Phone & WhatsApp"}
              </span>
            </div>
            <p className="font-mono text-base font-medium text-[var(--text)]">
              {phone}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {location} 🇧🇪
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3 pt-4 border-t border-dashed border-[var(--border)]">
            <a
              href={`tel:${phoneClean}`}
              className="font-mono rounded border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black"
            >
              {lang === "fr" ? "Appeler ↗" : "Call ↗"}
            </a>
            <a
              href={`https://wa.me/${phoneClean.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono rounded border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:border-[var(--text)]"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>
      </div>

      {/* Profils Réseaux & Code */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/40 p-6">
        <h4 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase mb-4">
          {lang === "fr" ? "Présence en ligne & Code" : "Online Presence & Code"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <a
            href="https://github.com/Vertu5"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--bg)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
          >
            <span className="flex items-center gap-3 font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              GitHub
            </span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-black group-hover:border-[var(--accent)] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--bg)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
          >
            <span className="flex items-center gap-3 font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-black group-hover:border-[var(--accent)] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
