"use client";

import { bioNarrative } from "@/app/lib/bio";
import { cvUrl, type DocEntry } from "@/app/lib/categories";
import { useState } from "react";

export default function BioView({
  lang,
  t,
  documents = [],
}: {
  lang: "fr" | "en";
  t: Record<string, string>;
  documents?: DocEntry[];
}) {
  const [openCertId, setOpenCertId] = useState<string | null>(null);

  // Séparer les diplômes (confidentiels - sans lien PDF) et certifications
  const diplomas = documents.filter((d) => d.type === "diplome");

  return (
    <div className="mt-6 space-y-8">
      {/* Top Header Block : Photo Placeholder + Tagline + Short Intro */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Emplacement Photo de Profil */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-[var(--accent)]/50 bg-[var(--bg)] flex flex-col items-center justify-center text-center p-2 overflow-hidden shadow-inner">
              {/* Image si disponible, sinon initiales + placeholder */}
              <span className="font-display text-2xl font-semibold text-[var(--accent)]">NO</span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] mt-1">
                Photo à venir
              </span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-0.5 rounded-full font-mono text-[9px] text-[var(--text-muted)] whitespace-nowrap">
              Bruxelles, BE
            </div>
          </div>

          {/* Subtitle & Introduction */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs font-medium text-[var(--accent)] mb-3">
              <span>💡</span>
              <span>{bioNarrative.headlineTag[lang]}</span>
            </div>

            <p className="text-sm md:text-base leading-relaxed text-[var(--text)]">
              {bioNarrative.intro[lang]}
            </p>

            {/* Lien CV */}
            <div className="mt-3 font-mono text-xs text-[var(--text-muted)] flex items-center gap-3">
              {cvUrl ? (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--accent)] underline underline-offset-4 hover:no-underline font-medium"
                >
                  📄 {t.bioIntroLink} ↗
                </a>
              ) : (
                <span className="text-[var(--text-muted)]">
                  📄 {t.bioIntroLink} ({t.cvMissing})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Première lecture : Résumé Exécutif en 4 piliers (Scan immédiat pour recruteurs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {bioNarrative.executiveSummary.map((pill, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/40 p-4 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--bg-elevated)]"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{pill.icon}</span>
              <h4 className="font-display text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
                {pill.title[lang]}
              </h4>
            </div>
            <p className="mt-2 text-xs font-medium text-[var(--text)] leading-snug">
              {pill.desc[lang]}
            </p>
          </div>
        ))}
      </div>

      {/* 📜 Parcours narratif détaillé */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">
          {lang === "fr" ? "Parcours & Spécialisations" : "Background & Specializations"}
        </h3>
        <div className="space-y-4">
          {bioNarrative.sections.map((sec) => (
            <div
              key={sec.id}
              className="rounded-lg border border-[var(--border)] p-5 md:p-6 bg-[var(--bg-elevated)]/30 transition-colors hover:border-[var(--accent)]/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="font-display text-base font-medium text-[var(--text)]">
                  {sec.title[lang]}
                </h4>
                {sec.badge && (
                  <span className="font-mono rounded bg-[var(--accent)]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                    {sec.badge[lang]}
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-[var(--text-muted)]">
                {sec.content[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🏅 Certifications (avec dossier /public/certifications/ et aperçu) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">
            {lang === "fr" ? "Certifications & Stack DevOps" : "Certifications & DevOps Stack"}
          </h3>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            📁 Dossier : <code className="text-[var(--accent)]">public/certifications/</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bioNarrative.certificationsGrouped.map((group, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span>{group.icon}</span>
                  <h4 className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                    {group.category[lang]}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => {
                    const isOpen = openCertId === item.id;
                    return (
                      <li key={item.id} className="rounded border border-[var(--border)] bg-[var(--bg)]/50 p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[var(--text)]">{item.name}</span>
                          <button
                            onClick={() => setOpenCertId(isOpen ? null : item.id)}
                            className="font-mono text-[10px] text-[var(--accent)] hover:underline ml-2 shrink-0"
                          >
                            {isOpen ? "Fermer" : "Info"}
                          </button>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.issuer}</p>

                        {isOpen && (
                          <div className="mt-2 pt-2 border-t border-dashed border-[var(--border)] text-[11px]">
                            <p className="text-[var(--text-muted)] font-mono text-[10px]">
                              PDF téléchargeable dans <code className="text-[var(--accent)]">/public{item.fileUrl}</code>
                            </p>
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono mt-1.5 inline-flex items-center gap-1 text-[10px] text-[var(--accent)] underline hover:no-underline"
                            >
                              📥 Télécharger / Voir le certificat ↗
                            </a>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 Vision & Objectives (Dev ➔ PM) */}
      <div className="rounded-xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg-elevated)]/60 to-[var(--bg)] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase">
            ROADMAP PROFESSIONNELLE
          </span>
        </div>
        <h4 className="font-display text-lg font-medium text-[var(--text)]">
          {bioNarrative.vision.title[lang]}
        </h4>
        <p className="mt-2 text-xs md:text-sm italic text-[var(--text)] border-l-2 border-[var(--accent)] pl-3 py-1">
          "{bioNarrative.vision.philosophy[lang]}"
        </p>
        <p className="mt-3 text-xs md:text-sm leading-relaxed text-[var(--text-muted)]">
          {bioNarrative.vision.roadmap[lang]}
        </p>
      </div>

      {/* 🎓 Diplômes académiques (Sans téléchargement public - Confidentialité respectée) */}
      {diplomas.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">
              {t.docDiplome}
            </h3>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              🔒 Titres académiques (Fichiers privés)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diplomas.map((doc) => (
              <div key={doc.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-sm font-medium text-[var(--text)]">
                    {doc.title[lang]}
                  </h4>
                  <span className="font-mono text-[10px] text-[var(--accent)] font-semibold shrink-0">
                    {doc.date}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">{doc.issuer}</p>
                {doc.detail && (
                  <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
                    {doc.detail[lang]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
