"use client";

import { useState } from "react";
import { categories } from "@/app/lib/categories";
import Pattern from "@/app/components/Pattern";
import SectionChat from "@/app/components/SectionChat";
import { useLang } from "@/app/lib/i18n";

const docTypeLabel = {
  diplome: (t: ReturnType<typeof useLang>["t"]) => t.docDiplome,
  certification: (t: ReturnType<typeof useLang>["t"]) => t.docCertification,
  lettre: (t: ReturnType<typeof useLang>["t"]) => t.docLettre,
};

export default function Hub() {
  const { lang, toggle, t } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = categories.find((c) => c.id === openId) ?? null;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 md:py-24">
      <header className="mb-14 flex items-start justify-between md:mb-20">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)]">
            {t.tagline}
          </p>
          <h1 className="font-display mt-3 text-4xl font-medium tracking-tight md:text-6xl">
            NDINGA OBA Olivier-Vertu
          </h1>
        </div>
        <button
          onClick={toggle}
          className="font-mono mt-1 rounded border border-[var(--border)] px-3 py-1.5 text-xs tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
        >
          {t.langToggle}
        </button>
      </header>

      {/* Grille */}
      <div
        className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-500"
        style={{ gridTemplateRows: open ? "0fr" : "1fr", opacity: open ? 0 : 1 }}
      >
        <div className="grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setOpenId(cat.id)}
              className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-left transition-colors hover:border-[var(--accent)]/40"
            >
              <div className="absolute inset-0 opacity-70 transition-transform duration-500 group-hover:scale-105">
                <Pattern id={cat.id} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-[var(--bg-elevated)]/40 to-transparent" />
              <div className="relative p-5">
                <span className="font-mono text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
                  {cat.index}
                </span>
                <h2 className="font-display text-xl font-medium">{cat.label[lang]}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {cat.description[lang]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu déplié */}
      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          {open && (
            <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
              <div className="absolute inset-0 opacity-25">
                <Pattern id={open.id} />
              </div>
              <div className="relative p-6 md:p-10">
                <span className="font-mono text-[11px] tracking-[0.15em] text-[var(--accent)]">
                  {open.index}
                </span>
                <h2 className="font-display mt-2 text-3xl font-medium md:text-5xl">
                  {open.label[lang]}
                </h2>
                <p className="mt-4 max-w-lg text-[var(--text-muted)]">
                  {open.description[lang]}
                </p>

                {open.documents ? (
                  <div className="mt-10 space-y-6">
                    {(["diplome", "certification", "lettre"] as const).map((type) => {
                      const items = open.documents!.filter((d) => d.type === type);
                      if (items.length === 0) return null;
                      return (
                        <div key={type}>
                          <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
                            {docTypeLabel[type](t)}
                          </p>
                          <ul className="mt-2 space-y-2">
                            {items.map((doc, i) => (
                              <li
                                key={i}
                                className="rounded-md border border-dashed border-[var(--border)] px-4 py-3 text-sm"
                              >
                                <span className="text-[var(--text)]">{doc.title[lang]}</span>
                                <span className="text-[var(--text-muted)]"> — {doc.issuer} · {doc.date} </span>
                                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                  ({t.docTodo})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-10 rounded-md border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">
                    {t.contentSoon}{" "}
                    {open.id === "projets" && t.contentProjets}
                    {open.id === "papiers" && t.contentPapiers}
                    {["swarm", "robotics", "heuristics", "physics", "algo", "ml"].includes(open.id) &&
                      t.contentLabs}
                    {open.id === "contact" && t.contentContact}
                  </div>
                )}

                <SectionChat sectionId={open.id} />

                <button
                  onClick={() => setOpenId(null)}
                  className="font-mono mt-10 flex items-center gap-2 text-xs tracking-[0.15em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t.back} ▲
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
