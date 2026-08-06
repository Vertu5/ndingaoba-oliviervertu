"use client";

import { bioNarrative } from "@/app/lib/bio";
import { cvUrl, type DocEntry } from "@/app/lib/categories";
import { useState } from "react";

const docTypeKey = {
  diplome: "docDiplome",
  certification: "docCertification",
  lettre: "docLettre",
} as const;

export default function BioView({
  lang,
  t,
  documents = [],
}: {
  lang: "fr" | "en";
  t: Record<string, string>;
  documents?: DocEntry[];
}) {
  const [openDocId, setOpenDocId] = useState<string | null>(null);

  return (
    <div className="mt-8 space-y-10">
      {/* Intro & Headline */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 p-6 md:p-8">
        <h3 className="font-display text-xl font-medium text-[var(--accent)] md:text-2xl">
          {bioNarrative.headline[lang]}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text)] md:text-base">
          {bioNarrative.intro[lang]}
        </p>

        {/* Link to CV */}
        <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
          {cvUrl ? (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent)] underline underline-offset-2 hover:no-underline font-mono"
            >
              📄 {t.bioIntroLink} ↗
            </a>
          ) : (
            <span className="font-mono text-[var(--text-muted)]">
              📄 {t.bioIntroLink} ({t.cvMissing})
            </span>
          )}
        </div>
      </div>

      {/* Sections narrative */}
      <div className="space-y-6">
        {bioNarrative.sections.map((sec) => (
          <div
            key={sec.id}
            className="group rounded-lg border border-[var(--border)] p-6 transition-colors hover:border-[var(--accent)]/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="font-display text-lg font-medium text-[var(--text)]">
                {sec.title[lang]}
              </h4>
              {sec.badge && (
                <span className="font-mono rounded bg-[var(--accent)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--accent)]">
                  {sec.badge[lang]}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {sec.content[lang]}
            </p>

            {/* Certifications special block under 'autodidacte-certifs' */}
            {sec.id === "autodidacte-certifs" && (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {bioNarrative.certifications.map((group, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg)]/60 p-4"
                  >
                    <p className="font-mono text-xs font-semibold tracking-wider text-[var(--accent)]">
                      {group.category[lang]}
                    </p>
                    <ul className="mt-2.5 space-y-1.5 text-xs text-[var(--text)]">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[var(--accent)]">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Vision & Objectives */}
      <div className="rounded-lg border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg)] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs text-[var(--accent)] tracking-widest">VISION & ROADMAP</span>
        </div>
        <h4 className="font-display text-xl font-medium text-[var(--text)]">
          {bioNarrative.vision.title[lang]}
        </h4>
        <p className="mt-3 text-sm italic text-[var(--text)] border-l-2 border-[var(--accent)] pl-4 py-1">
          "{bioNarrative.vision.philosophy[lang]}"
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
          {bioNarrative.vision.roadmap[lang]}
        </p>
      </div>

      {/* Documents section (Diplômes, Certifications, Lettres) */}
      {documents.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-[var(--border)]">
          <h4 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)]">
            DOCUMENTS & DIPLÔMES
          </h4>
          {(["diplome", "certification", "lettre"] as const).map((type) => {
            const docs = documents.filter((d) => d.type === type);
            if (docs.length === 0) return null;
            return (
              <div key={type} className="space-y-3">
                <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
                  {t[docTypeKey[type]]}
                </p>
                <ul className="space-y-2">
                  {docs.map((doc) => {
                    const isOpen = openDocId === doc.id;
                    return (
                      <li
                        key={doc.id}
                        className="rounded-md border border-[var(--border)] overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenDocId(isOpen ? null : doc.id)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--bg)]/40"
                        >
                          <span>
                            <span className="text-[var(--text)]">{doc.title[lang]}</span>
                            <span className="text-[var(--text-muted)]">
                              {" "}
                              — {doc.issuer} · {doc.date}{" "}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--text-muted)]">
                              ({t.docTodo})
                            </span>
                          </span>
                          <span className="font-mono text-[var(--text-muted)]">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--text-muted)]">
                            {doc.detail?.[lang]}
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono mt-2 block text-xs text-[var(--accent)] hover:underline"
                              >
                                {t.docView}
                              </a>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
