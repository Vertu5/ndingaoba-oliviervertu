"use client";

import { useState } from "react";
import { bio, interests, contact, type Category } from "@/app/lib/categories";
import { domains } from "@/app/lib/domains";
import { content, type ContentType } from "@/app/lib/content";
import { interestsIntro, domainInterests } from "@/app/lib/interests";
import Pattern from "@/app/components/Pattern";
import SectionChat from "@/app/components/SectionChat";
import { useLang } from "@/app/lib/i18n";

const docTypeKey = {
  diplome: "docDiplome",
  certification: "docCertification",
  lettre: "docLettre",
} as const;

const tabs: { type: ContentType; key: "tabProjets" | "tabPapiers" | "tabDemos" }[] = [
  { type: "projet", key: "tabProjets" },
  { type: "papier", key: "tabPapiers" },
  { type: "demo", key: "tabDemos" },
];

// Grille du hub : Bio, puis tous les domaines (extensibles), puis Contact.
const tiles: Category[] = [
  bio,
  interests,
  ...domains.map((d) => ({ id: d.id, index: "LAB", label: d.label, description: d.description })),
  contact,
];

export default function Hub() {
  const { lang, toggle, t } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<ContentType>("projet");
  const open = tiles.find((c) => c.id === openId) ?? null;
  const isDomain = !!open && domains.some((d) => d.id === open.id);

  const items = isDomain
    ? content.filter((c) => c.type === tab && c.domains.includes(open!.id))
    : [];

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
          {tiles.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setOpenId(cat.id);
                setTab("projet");
              }}
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

                {/* Bio : liste de documents */}
                {open.id === "bio" && open.documents && (
                  <div className="mt-10 space-y-6">
                    {(["diplome", "certification", "lettre"] as const).map((type) => {
                      const docs = open.documents!.filter((d) => d.type === type);
                      if (docs.length === 0) return null;
                      return (
                        <div key={type}>
                          <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
                            {t[docTypeKey[type]]}
                          </p>
                          <ul className="mt-2 space-y-2">
                            {docs.map((doc, i) => (
                              <li key={i} className="rounded-md border border-dashed border-[var(--border)] px-4 py-3 text-sm">
                                <span className="text-[var(--text)]">{doc.title[lang]}</span>
                                <span className="text-[var(--text-muted)]"> — {doc.issuer} · {doc.date} </span>
                                <span className="font-mono text-[10px] text-[var(--text-muted)]">({t.docTodo})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Contact */}
                {open.id === "contact" && (
                  <div className="mt-10 rounded-md border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">
                    {t.contentContact}
                  </div>
                )}

                {/* Intérêts : intro générale + un aperçu par domaine */}
                {open.id === "interets" && (
                  <div className="mt-10 space-y-6">
                    <p className="rounded-md border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">
                      {interestsIntro[lang]}
                    </p>
                    <div className="space-y-3">
                      {domainInterests.map((di) => {
                        const d = domains.find((dd) => dd.id === di.domainId);
                        if (!d) return null;
                        return (
                          <div key={di.domainId} className="rounded-md border border-[var(--border)] p-4">
                            <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--accent)]">
                              {d.label[lang]}
                            </p>
                            <p className="mt-1 text-sm text-[var(--text)]">{di.text[lang]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Domaine : sous-onglets Projets / Papiers / Démos */}
                {isDomain && (
                  <div className="mt-10">
                    <div className="flex gap-1 border-b border-[var(--border)]">
                      {tabs.map((tb) => (
                        <button
                          key={tb.type}
                          onClick={() => setTab(tb.type)}
                          className={`font-mono px-3 py-2 text-xs tracking-[0.1em] transition-colors ${
                            tab === tb.type
                              ? "border-b border-[var(--accent)] text-[var(--accent)]"
                              : "text-[var(--text-muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          {t[tb.key]}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      {items.length === 0 && (
                        <p className="text-sm text-[var(--text-muted)]">{t.emptyTab}</p>
                      )}
                      {items.map((item) => (
                        <div key={item.id} className="rounded-md border border-[var(--border)] p-5">
                          <h3 className="font-display text-lg font-medium">{item.title[lang]}</h3>
                          <p className="mt-1 text-sm text-[var(--text-muted)]">{item.summary[lang]}</p>

                          {/* Projet : emplacement vidéo unique */}
                          {item.type === "projet" && (
                            <div className="mt-4 flex h-28 items-center justify-center rounded border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)]">
                              {t.videoPlaceholder}
                            </div>
                          )}

                          {/* Démo : emplacement embed Hugging Face */}
                          {item.type === "demo" && (
                            <div className="mt-4 flex h-28 items-center justify-center rounded border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)]">
                              {t.demoPlaceholder}
                            </div>
                          )}

                          {/* Papier : blocs texte + vidéo librement intercalés */}
                          {item.type === "papier" && item.blocks && (
                            <div className="mt-4 space-y-3">
                              {item.blocks.map((block, i) =>
                                block.kind === "text" ? (
                                  <p key={i} className="text-sm text-[var(--text)]">
                                    {block.text[lang]}
                                  </p>
                                ) : (
                                  <div key={i}>
                                    <div className="flex h-28 items-center justify-center rounded border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)]">
                                      {t.videoPlaceholder}
                                    </div>
                                    <p className="mt-1 text-xs text-[var(--text-muted)]">{block.caption[lang]}</p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
