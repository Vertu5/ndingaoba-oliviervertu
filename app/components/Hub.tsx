"use client";

import { useState, useEffect } from "react";
import { bio, interests, contact, cvUrl, type Category } from "@/app/lib/categories";
import { superDomains } from "@/app/lib/superdomains";
import { domains } from "@/app/lib/domains";
import { content, type ContentType } from "@/app/lib/content";
import Pattern from "@/app/components/Pattern";
import SectionChat from "@/app/components/SectionChat";
import BioView from "@/app/components/BioView";
import ContactView from "@/app/components/ContactView";
import InterestsView from "@/app/components/InterestsView";
import GeneticOptimizer from "@/app/components/GeneticOptimizer";
import UrbanAirPollution from "@/app/components/UrbanAirPollution";
import SystemDesign from "@/app/components/SystemDesign";
import { useLang } from "@/app/lib/i18n";
import ThemeToggle from "@/app/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

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

// Niveau 1 (grille principale) : compartiments personnels + projets phares + grands domaines.
const personalTiles: Category[] = [bio, interests, contact];

const projectTiles: (Category & { tags?: string[] })[] = [
  {
    id: "swarm-tda-iridia",
    index: "01.TDA",
    label: { fr: "Essaim & TDA", en: "Swarm & TDA" },
    description: {
      fr: "Imitation en essaim & Analyse Topologique (IRIDIA/ULB).",
      en: "Swarm behavior & Topological Analysis (IRIDIA/ULB).",
    },
    tags: ["TDA", "Python", "C++", "Wasserstein"],
  },
  {
    id: "nsga2-promethee2-agricultural",
    index: "02.GA",
    label: { fr: "NSGA-II & MCDA", en: "NSGA-II & MCDA" },
    description: {
      fr: "Optimisation évolutive spatiale (NSGA-II + PROMETHEE II).",
      en: "Multi-objective spatial evolutionary optimization.",
    },
    tags: ["NSGA-II", "Python", "PROMETHEE II", "Plotly 3D"],
  },
  {
    id: "urban-air-pollution-ml",
    index: "03.ML",
    label: { fr: "Pollution ML", en: "Pollution ML" },
    description: {
      fr: "Pipeline Machine Learning spatiotemporel (ULB).",
      en: "Spatio-temporal Machine Learning pipeline (ULB).",
    },
    tags: ["ML", "Python", "PyTorch", "SpatioTemporal"],
  },
  {
    id: "air-quality-system-design",
    index: "04.SYS",
    label: { fr: "System Design SQL", en: "System Design SQL" },
    description: {
      fr: "Architecture système, modélisation 3NF, FastAPI & Docker.",
      en: "System architecture, 3NF database modeling & Docker.",
    },
    tags: ["PostgreSQL", "SQL DDL", "FastAPI", "Docker"],
  },
];

const superTiles: Category[] = superDomains.map((s) => ({ id: s.id, index: "LAB", label: s.label, description: s.description }));
const tiles: Category[] = [...personalTiles, ...projectTiles, ...superTiles];

function StandardTileButton({
  cat,
  lang,
  onOpen,
}: {
  cat: Category;
  lang: "fr" | "en";
  onOpen: (id: string) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(cat.id)}
      className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-left transition-colors hover:border-[var(--accent)]/40 shadow-sm hover:shadow-md"
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
    </motion.button>
  );
}

function ProjectTileButton({
  cat,
  lang,
  onOpen,
}: {
  cat: Category & { tags?: string[] };
  lang: "fr" | "en";
  onOpen: (id: string) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(cat.id)}
      className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-left transition-colors hover:border-[var(--accent)]/40 shadow-sm hover:shadow-md"
    >
      <div className="absolute inset-0 opacity-70 transition-transform duration-500 group-hover:scale-105">
        <Pattern id={cat.id} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-[var(--bg-elevated)]/40 to-transparent" />
      <div className="relative p-5 flex flex-col justify-between h-full w-full">
        <div>
          <span className="font-mono text-[11px] tracking-[0.15em] text-[var(--accent)] font-semibold">
            {cat.index}
          </span>
          <h2 className="font-display text-base font-medium text-[var(--text)] mt-0.5 group-hover:text-[var(--accent)] transition-colors leading-snug">
            {cat.label[lang]}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-1 leading-normal">
            {cat.description[lang]}
          </p>
        </div>

        {cat.tags && cat.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 font-mono text-[9px]">
            {cat.tags.map((tg, i) => (
              <span
                key={i}
                className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-1.5 py-0.5 text-[var(--accent)] font-medium"
              >
                #{tg}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default function Hub() {
  const { lang, toggle, t } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const [tab, setTab] = useState<ContentType>("projet");
  const [openDocId, setOpenDocId] = useState<string | null>(null);

  const navigate = (
    newOpenId: string | null,
    newOpenSubId: string | null = null,
    newTab: ContentType = "projet",
    mode: "push" | "replace" = "push"
  ) => {
    setOpenId(newOpenId);
    setOpenSubId(newOpenSubId);
    setTab(newTab);

    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    if (newOpenId) {
      params.set("view", newOpenId);
      if (newOpenSubId) {
        params.set("sub", newOpenSubId);
      }
      if (newTab && newTab !== "projet") {
        params.set("tab", newTab);
      }
    }

    const searchStr = params.toString();
    const newSearch = searchStr ? `?${searchStr}` : "";
    const currentSearch = window.location.search;

    if (newSearch !== currentSearch) {
      const newUrl = newSearch ? `${window.location.pathname}${newSearch}` : window.location.pathname;
      if (mode === "replace") {
        window.history.replaceState({ view: newOpenId, sub: newOpenSubId, tab: newTab }, "", newUrl);
      } else {
        window.history.pushState({ view: newOpenId, sub: newOpenSubId, tab: newTab }, "", newUrl);
      }
    }
  };

  useEffect(() => {
    const applyUrlState = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      const subParam = params.get("sub");
      const tabParam = params.get("tab");

      const validView = tiles.some((c) => c.id === viewParam) ? viewParam : null;
      const validSub = validView && domains.some((d) => d.id === subParam && d.superId === validView) ? subParam : null;
      const validTab: ContentType = (tabParam === "papier" || tabParam === "demo") ? tabParam : "projet";

      setOpenId(validView);
      setOpenSubId(validSub);
      setTab(validTab);
    };

    applyUrlState();

    const handlePopState = () => {
      applyUrlState();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const open = tiles.find((c) => c.id === openId) ?? null;
  const isSuperDomain = !!open && superDomains.some((s) => s.id === open.id);
  const subOptions = isSuperDomain ? domains.filter((d) => d.superId === open!.id) : [];
  const subOpen = domains.find((d) => d.id === openSubId) ?? null;

  const currentProjectIndex = open ? projectTiles.findIndex(p => p.id === open.id) : -1;
  const prevProject = currentProjectIndex > 0 ? projectTiles[currentProjectIndex - 1] : null;
  const nextProject = currentProjectIndex !== -1 && currentProjectIndex < projectTiles.length - 1 ? projectTiles[currentProjectIndex + 1] : null;

  function openTile(id: string) {
    navigate(id, null, "projet", "push");
  }

  const items = subOpen
    ? content.filter((c) => c.type === tab && c.domains.includes(subOpen.id))
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 md:py-24">
      {/* Header principal (affiché uniquement sur la grille d'accueil) */}
      {!open && (
        <header className="mb-10 flex items-center justify-between md:mb-16">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight sm:text-5xl md:text-6xl text-[var(--text)]">
              NDINGA OBA Olivier Vertu
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1.5 tracking-wider uppercase">
              Ingénieur Informatique & IA · Systèmes Complexes & Leadership
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggle}
              className="font-mono rounded border border-[var(--border)] px-3 py-1.5 text-xs tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            >
              {t.langToggle}
            </button>
          </div>
        </header>
      )}

      {/* Grille */}
      <AnimatePresence initial={false} mode="wait">
        {!open && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-10"
          >
            <section>
            <p className="font-mono mb-3 text-xs tracking-[0.2em] text-[var(--text-muted)]">
              {t.sectionAbout}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {personalTiles.map((cat) => (
                <StandardTileButton key={cat.id} cat={cat} lang={lang} onOpen={openTile} />
              ))}
            </div>
          </section>

          {/* Section 2 : Projets Phares (1 seule ligne de 4 tuiles compactes sur desktop) */}
          <section>
            <p className="font-mono mb-3 text-xs tracking-[0.2em] text-[var(--accent)] font-semibold flex items-center gap-1.5">
              <span>⭐</span>
              <span>{t.sectionFeaturedProjects}</span>
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {projectTiles.map((cat) => (
                <ProjectTileButton key={cat.id} cat={cat} lang={lang} onOpen={openTile} />
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono mb-3 text-xs tracking-[0.2em] text-[var(--text-muted)]">
              {t.sectionDomains}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {superTiles.map((cat) => (
                <StandardTileButton key={cat.id} cat={cat} lang={lang} onOpen={openTile} />
              ))}
            </div>
          </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu déplié */}
      <AnimatePresence initial={false} mode="wait">
        {open && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg">
              <div className="absolute inset-0 opacity-25">
                <Pattern id={subOpen ? subOpen.id : open.id} />
              </div>
              <div className="relative p-6 md:p-10">
                {/* Header du panneau déplié avec langue et bouton RETOUR en haut */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 md:pb-5 mb-4 md:mb-8 sticky top-0 bg-[var(--bg)]/95 backdrop-blur z-20">
                  
                  {/* Left: Index */}
                  <div className="flex-none sm:flex-1 flex items-center justify-start">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-[var(--accent)] font-semibold">
                      {subOpen ? "LAB" : open.index}
                    </span>
                  </div>
                    
                  {/* Center: Top Prev/Next Navigation (only for projectTiles) */}
                  <div className="flex-none sm:flex-1 flex items-center justify-center">
                    {currentProjectIndex !== -1 && (
                      <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-xs overflow-hidden">
                        <button 
                          disabled={!prevProject}
                          onClick={() => { if(prevProject) navigate(prevProject.id, null, "projet", "push"); }}
                          className="px-2 py-1 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed flex items-center justify-center"
                          title={prevProject ? prevProject.label[lang] : ""}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <div className="w-px h-3 bg-[var(--border)]"></div>
                        <button 
                          disabled={!nextProject}
                          onClick={() => { if(nextProject) navigate(nextProject.id, null, "projet", "push"); }}
                          className="px-2 py-1 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed flex items-center justify-center"
                          title={nextProject ? nextProject.label[lang] : ""}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Theme, Lang, Close */}
                  <div className="flex-none sm:flex-1 flex items-center justify-end gap-2 sm:gap-3">
                    <ThemeToggle />
                    <button
                      onClick={toggle}
                      className="font-mono rounded border border-[var(--border)] px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                    >
                      {t.langToggle}
                    </button>
                    <button
                      onClick={() => navigate(null, null, "projet", "push")}
                      className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] text-[var(--accent)] border border-[var(--accent)]/30 rounded px-2 sm:px-3 py-1 bg-[var(--accent)]/10 transition-colors hover:bg-[var(--accent)] hover:text-black"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      <span className="hidden sm:inline">{lang === "fr" ? "FERMER" : "CLOSE"}</span>
                    </button>
                  </div>
                </div>

                {open.id !== "nsga2-promethee2-agricultural" && open.id !== "urban-air-pollution-ml" && (
                  <>
                    <h2 className="font-display text-2xl font-medium sm:text-4xl md:text-5xl">
                      {subOpen ? subOpen.label[lang] : open.label[lang]}
                    </h2>
                    <p className="mt-1 sm:mt-3 max-w-lg text-xs sm:text-sm text-[var(--text-muted)]">
                      {subOpen ? subOpen.description[lang] : open.description[lang]}
                    </p>
                  </>
                )}

                {/* Vue détaillée si une tuile de Projet Phare est ouverte */}
                {projectTiles.some((p) => p.id === open.id) && (() => {
                  if (open.id === "nsga2-promethee2-agricultural") {
                    return (
                      <div className="mt-4">
                        <GeneticOptimizer />
                      </div>
                    );
                  }
                  if (open.id === "urban-air-pollution-ml") {
                    return (
                      <div className="mt-4">
                        <UrbanAirPollution />
                      </div>
                    );
                  }
                  if (open.id === "air-quality-system-design") {
                    return (
                      <div className="mt-4">
                        <SystemDesign />
                      </div>
                    );
                  }
                  const item = content.find((c) => c.id === open.id);
                  if (!item) return null;
                  return (
                    <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-[var(--text)]">
                          {item.title[lang]}
                        </h3>
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-[var(--accent)] underline hover:no-underline shrink-0 font-medium"
                          >
                            💻 Code Source GitHub ↗
                          </a>
                        )}
                      </div>

                      <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">{item.summary[lang]}</p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 font-mono text-[11px] pt-2">
                          {item.tags.map((tg, i) => (
                            <span key={i} className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-1 text-[var(--accent)] font-medium">
                              #{tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

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
                        onClick={() => navigate(openId, d.id, "projet", "push")}
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
                      onClick={() => navigate(openId, null, "projet", "push")}
                      className="font-mono mb-6 flex items-center gap-2 text-xs tracking-[0.15em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                    >
                      ← {t.backToDomains}
                    </button>
                    <div className="flex gap-1 border-b border-[var(--border)]">
                      {tabs.map((tb) => (
                        <button
                          key={tb.type}
                          onClick={() => navigate(openId, openSubId, tb.type, "replace")}
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
                        <div key={item.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="font-display text-lg font-medium text-[var(--text)]">{item.title[lang]}</h3>
                            {item.githubUrl && (
                              <a
                                href={item.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs text-[var(--accent)] underline hover:no-underline shrink-0"
                              >
                                💻 Code Source GitHub ↗
                              </a>
                            )}
                          </div>

                          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.summary[lang]}</p>

                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] pt-1">
                              {item.tags.map((tg, i) => (
                                <span key={i} className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2 py-0.5 text-[var(--accent)] font-medium">
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          )}

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

                {/* Barre de navigation inférieure : Précédent, Haut, Retour, Suivant */}
                <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-row items-center justify-between gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs">
                  
                  {/* Previous Project */}
                  {prevProject ? (
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        navigate(prevProject.id, null, "projet", "push");
                      }}
                      className="w-1/3 flex justify-start items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-1 sm:p-2 rounded hover:bg-[var(--bg)] text-left group"
                    >
                      <svg className="shrink-0 transition-transform group-hover:-translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      <span className="truncate font-semibold hidden sm:inline">{prevProject.label[lang]}</span>
                    </button>
                  ) : (
                    <div className="w-1/3"></div>
                  )}

                  {/* Scroll to Top & Back */}
                  <div className="w-1/3 flex justify-center items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-2 rounded hover:bg-[var(--bg)]"
                      title={lang === "fr" ? "Remonter en haut" : "Scroll to top"}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </button>
                    <div className="w-px h-4 bg-[var(--border)]"></div>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        navigate(null, null, "projet", "push");
                      }}
                      className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 rounded hover:bg-[var(--bg)]"
                      title={t.back}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    </button>
                  </div>

                  {/* Next Project */}
                  {nextProject ? (
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        navigate(nextProject.id, null, "projet", "push");
                      }}
                      className="w-1/3 flex justify-end items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-1 sm:p-2 rounded hover:bg-[var(--bg)] text-right group"
                    >
                      <span className="truncate font-semibold hidden sm:inline">{nextProject.label[lang]}</span>
                      <svg className="shrink-0 transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  ) : (
                    <div className="w-1/3"></div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
