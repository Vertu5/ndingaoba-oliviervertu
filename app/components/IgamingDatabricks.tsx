"use client";

import React from "react";
import { useLang } from "@/app/lib/i18n";
import ExecutiveLeversSection from "./igaming/ExecutiveLeversSection";
import DecisionExplorerSection from "./igaming/DecisionExplorerSection";
import PipelineArchitectureSection from "./igaming/PipelineArchitectureSection";
import TextToSqlSandbox from "./igaming/TextToSqlSandbox";

export default function IgamingDatabricks() {
  const { lang } = useLang();
  const isEn = lang === "en";

  return (
    <article
      lang={isEn ? "en" : "fr"}
      className="bg-[#fafafa] dark:bg-[var(--bg)] text-[#222222] dark:text-[var(--text)] font-serif selection:bg-blue-200 dark:selection:bg-blue-900 rounded-lg overflow-hidden border border-slate-200 dark:border-[var(--border)] shadow-xl relative"
    >
      {/* HEADER / TITRE (Matches GeneticOptimizer & UrbanAirPollution) */}
      <header className="max-w-3xl mx-auto pt-12 sm:pt-16 pb-10 sm:pb-12 px-5 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
          {isEn ? "iGaming Executive Intelligence" : "Intelligence Décisionnelle iGaming"} <br />
          <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl block mt-1">
            {isEn
              ? "(Databricks Lakehouse, MLflow & Guarded Text-to-SQL)"
              : "(Lakehouse Databricks, MLflow & Text-to-SQL Gouverné)"}
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-sans mb-10 text-slate-600 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border)] pb-8">
          <div>
            <strong>{isEn ? "Author" : "Auteur"}</strong>
            <br />
            NDINGA OBA Olivier Vertu
          </div>
          <div>
            <strong>Framework</strong>
            <br />
            {isEn ? "Databricks Unity Catalog & MLflow" : "Databricks Unity Catalog & MLflow"}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-700 dark:text-[var(--text)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">
              Delta Lake
            </span>
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-700 dark:text-[var(--text)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">
              MLflow @champion
            </span>
            <span className="bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-500/30 whitespace-nowrap">
              Text-to-SQL
            </span>
          </div>
        </div>

        {/* ABSTRACT */}
        <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-6 text-left md:text-justify md:hyphens-auto">
          <p>
            <strong>{isEn ? "Business Goal:" : "Objectif Exécutif :"}</strong>{" "}
            {isEn
              ? "Transforming 4.65 million raw slot spins (€8.11M in bets, €574.3K in net casino revenue) into an automated decision engine for casino executives: reallocating marketing spend toward high-margin channels, rescuing churning VIP whales before they leave, isolating multi-account collusion, and enabling directors to query Databricks in plain language in 0.3 seconds."
              : "Transformer 4,65 millions de spins bruts (8,11 M€ de mises, 574,3 k€ de revenu net casino) en un moteur de décision pour la direction : réallouer le budget marketing vers les canaux à forte marge, retenir les joueurs VIP avant leur départ, isoler la fraude multi-comptes et permettre aux directeurs d'interroger Databricks en langage naturel en 0,3 seconde."}
          </p>
        </section>

        {/* COMPACT CONTEXT STRIP: WHAT WE HAVE AT THE START */}
        <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-[var(--border)] font-sans shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-2">
            {isEn
              ? "Starting Point: 4 Months of Raw Casino Telemetry (10 Countries, 8 Slot Games)"
              : "Point de Départ : 4 Mois de Logs Bruts du Casino (10 Pays, 8 Machines à Sous)"}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[var(--text-muted)] leading-relaxed mb-3.5">
            {isEn
              ? "We start with 3 raw relational files containing no pre-computed revenue and no churn or fraud labels. Our goal is to clean, reconcile, and model them on Databricks Unity Catalog to drive 4 concrete executive decisions:"
              : "Nous partons de 3 fichiers relationnels bruts sans revenu pré-calculé ni étiquette de churn ou de fraude. L'objectif est de les réconcilier et modéliser sur Databricks Unity Catalog pour éclairer 4 décisions de direction :"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-50 dark:bg-[var(--bg)] px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border)] flex items-center justify-between">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">players.csv</span>
              <span className="text-slate-700 dark:text-[var(--text)] font-medium">
                8,000 {isEn ? "signups (5 channels)" : "inscrits (5 canaux)"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[var(--bg)] px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border)] flex items-center justify-between">
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">sessions.csv</span>
              <span className="text-slate-700 dark:text-[var(--text)] font-medium">
                46,690 {isEn ? "sessions (IP/device)" : "sessions (IP/support)"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[var(--bg)] px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border)] flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">spins.csv</span>
              <span className="text-slate-700 dark:text-[var(--text)] font-medium">
                4,646,999 {isEn ? "slot spins (8 games)" : "spins (8 machines)"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN ARTICLE BODY */}
      <main className="max-w-3xl mx-auto px-5 sm:px-6 pb-24 text-base sm:text-lg leading-relaxed sm:text-justify text-slate-800 dark:text-[var(--text)]">
        {/* SECTION 1: THE 4 EXECUTIVE LEVERS */}
        <ExecutiveLeversSection isEn={isEn} />

        {/* SECTION 2: INTERACTIVE EXECUTIVE DECISION EXPLORER */}
        <DecisionExplorerSection isEn={isEn} />

        {/* SECTION 3: HOW THE MEDALLION + MLOPS PIPELINE WORKS */}
        <PipelineArchitectureSection isEn={isEn} />

        {/* SECTION 4: INTERACTIVE TEXT-TO-SQL COPILOT */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn
              ? "4. Self-Service Executive Copilot (Guarded Text-to-SQL)"
              : "4. Copilote Décisionnel en Libre-Service (Text-to-SQL Gouverné)"}
          </h2>
          <p className="mb-6 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "Why build Text-to-SQL? When a VIP Director asks 'Which whales are at risk of churning this week?', waiting 48 hours for a Data Analyst to send an Excel file means losing the player. Our copilot translates natural language into Databricks SQL in 0.3 seconds, while 4 safety shields prevent any hallucinated column or destructive query."
              : "Pourquoi avoir conçu ce moteur Text-to-SQL ? Lorsqu'un Directeur VIP demande « Quels gros joueurs risquent de partir cette semaine ? », attendre 48 heures un export Excel fait perdre le joueur. Ce copilote traduit la question en SQL Databricks en 0,3 seconde, tandis que 4 boucliers bloquent toute colonne inventée ou requête dangereuse."}
          </p>

          <TextToSqlSandbox isEn={isEn} />
        </section>

        {/* CONCLUSION / REPO (Adaptive Day/Night Card) */}
        <section className="bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-700 dark:text-[var(--text-muted)] p-8 rounded-xl border border-slate-200 dark:border-[var(--border)] font-sans shadow-md">
          <h3 className="text-xl font-bold text-slate-900 dark:text-[var(--text)] mb-4">
            {isEn
              ? "Production Governance, CI/CD & Open Source"
              : "Gouvernance en Production, CI/CD & Open Source"}
          </h3>
          <p className="text-sm mb-6 leading-relaxed text-left md:text-justify">
            {isEn ? (
              <>
                Every commit is verified by a local CI gate (
                <code className="bg-white dark:bg-[var(--bg)] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-[var(--border)] px-1.5 py-0.5 rounded font-mono text-xs">
                  make check
                </code>
                ) that runs 14 AST guardrail tests, validates SQL syntax with{" "}
                <code className="bg-white dark:bg-[var(--bg)] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-[var(--border)] px-1.5 py-0.5 rounded font-mono text-xs">
                  sqlglot
                </code>
                , and dry-runs{" "}
                <code className="bg-white dark:bg-[var(--bg)] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-[var(--border)] px-1.5 py-0.5 rounded font-mono text-xs">
                  databricks bundle sync
                </code>{" "}
                before deploying the 8-task workflow to Unity Catalog.
              </>
            ) : (
              <>
                Chaque modification est vérifiée par une porte CI automatisée (
                <code className="bg-white dark:bg-[var(--bg)] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-[var(--border)] px-1.5 py-0.5 rounded font-mono text-xs">
                  make check
                </code>
                ) qui exécute 14 tests de sécurité AST, valide la syntaxe SQL avec{" "}
                <code className="bg-white dark:bg-[var(--bg)] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-[var(--border)] px-1.5 py-0.5 rounded font-mono text-xs">
                  sqlglot
                </code>{" "}
                et vérifie la synchronisation du bundle Databricks avant de déployer le workflow de 8
                tâches dans Unity Catalog.
              </>
            )}
          </p>
          <a
            href="https://github.com/Vertu5/igaming-databricks-lakehouse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            {isEn
              ? "View Full Source Code (SQL, MLflow & Text-to-SQL) on GitHub"
              : "Voir le code source complet (SQL, MLflow & Text-to-SQL) sur GitHub"}
          </a>
        </section>
      </main>
    </article>
  );
}
