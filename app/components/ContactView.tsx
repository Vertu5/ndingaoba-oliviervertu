"use client";

import { useState } from "react";

export default function ContactView({ lang }: { lang: "fr" | "en" }) {
  const [copied, setCopied] = useState(false);

  const email = "obavertu@gmail.com";
  const phone = "+32 497 21 21 37";
  const phoneClean = "+32497212137";
  const location = "Bruxelles, Belgique";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Intro block */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8">
        <h3 className="font-display text-xl font-medium text-[var(--accent)] md:text-2xl">
          {lang === "fr" ? "Prenons contact" : "Get in Touch"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] max-w-xl">
          {lang === "fr"
            ? "Disponible pour des opportunités en Software Development, Ingénierie IA, ou des projets complexes. N'hésitez pas à me joindre directement."
            : "Available for Software Development, AI Engineering opportunities, or complex technical projects. Feel free to reach out directly."}
        </p>
      </div>

      {/* Grid des Coordonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Email */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-6 flex flex-col justify-between transition-colors hover:border-[var(--accent)]/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✉️</span>
              <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                Email
              </span>
            </div>
            <p className="font-mono text-base font-medium text-[var(--text)] select-all">
              {email}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {lang === "fr" ? "Réponse sous 24h" : "Response within 24h"}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3 pt-4 border-t border-dashed border-[var(--border)]">
            <a
              href={`mailto:${email}`}
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
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-[var(--border)] p-3 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-elevated)]"
          >
            <span className="flex items-center gap-2 text-[var(--text)]">
              <span>💻</span> GitHub
            </span>
            <span className="text-[var(--accent)]">github.com ↗</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-[var(--border)] p-3 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-elevated)]"
          >
            <span className="flex items-center gap-2 text-[var(--text)]">
              <span>💼</span> LinkedIn
            </span>
            <span className="text-[var(--accent)]">linkedin.com ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
