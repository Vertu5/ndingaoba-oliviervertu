"use client";

import { useState } from "react";

export default function ContactView({ lang }: { lang: "fr" | "en" }) {
  const [copied, setCopied] = useState(false);

  const directEmail = "obavertu@gmail.com";
  const phone = "+32 497 21 21 37";
  const phoneClean = "+32497212137";
  const location = "Bruxelles, Belgique";

  const copyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-8">
      {/* Header Intro */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 md:p-8">
        <h3 className="font-display text-lg font-medium text-[var(--accent)] md:text-2xl">
          {lang === "fr" ? "Me contacter" : "Get in Touch"}
        </h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed sm:text-justify text-[var(--text-muted)] max-w-xl">
          {lang === "fr"
            ? "Disponible pour des opportunités en Software Development, Ingénierie IA ou projets complexes. Écrivez-moi directement ci-dessous ou via mes coordonnées."
            : "Available for Software Development, AI Engineering opportunities, or complex projects. Send a message below or reach out directly."}
        </p>
      </div>

      {/* Cards Coordonnées Directes */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {/* Card Email */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-3 sm:p-6 flex flex-col justify-between transition-colors hover:border-[var(--accent)]/40 overflow-hidden">
          <div>
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span className="text-base sm:text-xl">✉️</span>
              <span className="font-mono text-[9px] sm:text-xs font-semibold text-[var(--accent)] uppercase tracking-wider truncate">
                Email
              </span>
            </div>
            <p className="font-mono text-[9px] sm:text-base font-medium text-[var(--text)] select-all truncate">
              {directEmail}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs text-[var(--text-muted)] truncate">
              {lang === "fr" ? "Réponse sous 24h" : "Response within 24h"}
            </p>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 border-t border-dashed border-[var(--border)]">
            <a
              href={`mailto:${directEmail}`}
              className="font-mono rounded bg-[var(--accent)] px-2 py-1.5 text-[9px] sm:text-xs font-semibold text-[var(--accent-text)] transition-opacity hover:opacity-90 text-center truncate"
            >
              {lang === "fr" ? "Écrire ↗" : "Email ↗"}
            </a>
            <button
              onClick={copyEmail}
              className="font-mono rounded border border-[var(--border)] px-2 py-1.5 text-[9px] sm:text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:border-[var(--text)] truncate"
            >
              {copied ? "✓" : (lang === "fr" ? "Copier" : "Copy")}
            </button>
          </div>
        </div>

        {/* Card Téléphone */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-3 sm:p-6 flex flex-col justify-between transition-colors hover:border-[var(--accent)]/40 overflow-hidden">
          <div>
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span className="text-base sm:text-xl">📱</span>
              <span className="font-mono text-[9px] sm:text-xs font-semibold text-[var(--accent)] uppercase tracking-wider truncate">
                {lang === "fr" ? "Tél & WhatsApp" : "Phone & WhatsApp"}
              </span>
            </div>
            <p className="font-mono text-[9px] sm:text-base font-medium text-[var(--text)] truncate">
              {phone}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs text-[var(--text-muted)] truncate">
              {location} 🇧🇪
            </p>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 border-t border-dashed border-[var(--border)]">
            <a
              href={`tel:${phoneClean}`}
              className="font-mono rounded border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2 py-1.5 text-[9px] sm:text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-text)] text-center truncate"
            >
              {lang === "fr" ? "Appeler ↗" : "Call ↗"}
            </a>
            <a
              href={`https://wa.me/${phoneClean.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono rounded border border-[var(--border)] px-2 py-1.5 text-[9px] sm:text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:border-[var(--text)] text-center truncate"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>
      </div>

      {/* Profils Réseaux & Code */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/40 p-4 sm:p-6">
        <h4 className="font-mono text-[9px] sm:text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3 sm:mb-4">
          {lang === "fr" ? "Présence en ligne" : "Online Presence"}
        </h4>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 font-mono text-[9px] sm:text-xs">
          <a
            href="https://github.com/Vertu5"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center sm:justify-between rounded-md border border-[var(--border)] bg-[var(--bg)] p-2 sm:p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 gap-2"
          >
            <span className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              <svg className="w-5 h-5 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span>GitHub</span>
            </span>
            <span className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text)] group-hover:border-[var(--accent)] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center sm:justify-between rounded-md border border-[var(--border)] bg-[var(--bg)] p-2 sm:p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 gap-2"
          >
            <span className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              <svg className="w-5 h-5 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              <span>LinkedIn</span>
            </span>
            <span className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text)] group-hover:border-[var(--accent)] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
