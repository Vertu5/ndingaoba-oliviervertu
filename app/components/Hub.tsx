"use client";

import { useState } from "react";
import { bio, interests, contact, cvUrl, type Category } from "@/app/lib/categories";
import { superDomains } from "@/app/lib/superdomains";
import { domains } from "@/app/lib/domains";
import { content, type ContentType } from "@/app/lib/content";
import Pattern from "@/app/components/Pattern";
import SectionChat from "@/app/components/SectionChat";
import BioView from "@/app/components/BioView";
import ContactView from "@/app/components/ContactView";
import InterestsView from "@/app/components/InterestsView";
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

// Niveau 1 (grille principale) : compartiments personnels + grands domaines.
const personalTiles: Category[] = [bio, interests, contact];
const superTiles: Category[] = superDomains.map((s) => ({ id: s.id, index: "LAB", label: s.label, description: s.description }));
const tiles: Category[] = [...personalTiles, ...superTiles];

function TileButton({
  cat,
  lang,
  onOpen,
}: {
  cat: Category;
  lang: "fr" | "en";
  onOpen: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onOpen(cat.id)}
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
        <p className="mt-1 text-sm text-[var(--text-muted)]">{cat.description[lang]}</p>
      </div>
    </button>
  );
}

export default function Hub() {
  const { lang, toggle, t } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const [tab, setTab] = useState<ContentType>("projet");
  const [openDocId, setOpenDocId] = useState<string | null>(null);
  const open = tiles.find((c) => c.id === openId) ?? null;
  const isSuperDomain = !!open && superDomains.some((s) => s.id === open.id);
  const subOptions = isSuperDomain ? domains.filter((d) => d.superId === open!.id) : [];
  const subOpen = domains.find((d) => d.id === openSubId) ?? null;

  function openTile(id: string) {
    setOpenId(id);
    setOpenSubId(null);
    setTab("projet");
  }

  const items = subOpen
    ? content.filter((c) => c.type === tab && c.domains.includes(subOpen.id))
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 md:py-24">
      <header className="mb-14 flex items-start justify-between md:mb-20">
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-6xl">
          NDINGA OBA Olivier Vertu
        </h1>
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
        <div className="min-h-0 space-y-10">
          <section>
            <p className="font-mono mb-3 text-xs tracking-[0.2em] text-[var(--text-muted)]">
              {t.sectionAbout}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {personalTiles.map((cat) => (
                <TileButton key={cat.id} cat={cat} lang={lang} onOpen={openTile} />
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono mb-3 text-xs tracking-[0.2em] text-[var(--text-muted)]">
              {t.sectionDomains}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {superTiles.map((cat) => (
                <TileButton key={cat.id} cat={cat} lang={lang} onOpen={openTile} />
              ))}
            </div>
          </section>
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
                <Pattern id={subOpen ? subOpen.id : open.id} />
              </div>
              <div className="relative p-6 md:p-10">
                <span className="font-mono text-[11px] tracking-[0.15em] text-[var(--accent)]">
                  {subOpen ? "LAB" : open.index}
                </span>
                <h2 className="font-display mt-2 text-3xl font-medium md:text-5xl">
                  {subOpen ? subOpen.label[lang] : open.label[lang]}
                </h2>
                <p className="mt-4 max-w-lg text-[var(--text-muted)]">
                  {subOpen ? subOpen.description[lang] : open.description[lang]}
                </p>

                {/* Bio : vue détaillée avec narrative, certifications et documents */}
                {open.id === "bio" && (
                  <BioView lang={lang} t={t} documents={open.documents} />
                )}

                {/* Contact */}
                {open.id === "contact" && (
                  <ContactView lang={lang} />
                )}

                {/* Intérêts : 4 grands piliers (Philosophie, Sport, Créativité, Sérénité) */}
                {open.id === "interets" && (
                  <InterestsView lang={lang} />
                )}

                {/* Grand domaine : sous-grille de ses sous-domaines */}
                {isSuperDomain && !subOpen && (
                  <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {subOptions.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setOpenSubId(d.id)}
                        className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)]/40 text-left transition-colors hover:border-[var(--accent)]/40"
                      >
                        <div className="absolute inset-0 opacity-60 transition-transform duration-500 group-hover:scale-105">
                          <Pattern id={d.id} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent" />
                        <div className="relative p-4">
                          <h3 className="font-display text-base font-medium">{d.label[lang]}</h3>
                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">{d.description[lang]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Sous-domaine ouvert : sous-onglets Projets / Papiers / Démos */}
                {subOpen && (
                  <div className="mt-10">
                    <button
                      onClick={() => setOpenSubId(null)}
                      className="font-mono mb-6 flex items-center gap-2 text-xs tracking-[0.15em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                    >
                      ← {t.backToDomains}
                    </button>
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

                {/* Chat assistant : réservé uniquement aux domaines de recherche/laboratoire */}
                {isSuperDomain && (
                  <SectionChat sectionId={subOpen ? subOpen.id : open.id} />
                )}

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
