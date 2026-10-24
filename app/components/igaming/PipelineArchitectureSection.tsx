"use client";

import React from "react";

export default function PipelineArchitectureSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
        {isEn
          ? "3. How the Automated Databricks Pipeline Works"
          : "3. Comment Fonctionne le Pipeline Automatisé sur Databricks ?"}
      </h2>
      <p className="mb-8 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
        {isEn
          ? "To guarantee that executives never make decisions on corrupted data, the entire pipeline is deployed as a declarative Databricks Asset Bundle (8 chained tasks) where every transformation is guarded by an automated SQL quality gate."
          : "Pour garantir que la direction ne prenne jamais de décision sur des données corrompues, le pipeline est déployé via Databricks Asset Bundles (8 tâches chaînées) où chaque étape est verrouillée par un contrôle qualité SQL bloquant."}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 relative font-sans">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-[var(--border)] -z-10 -translate-y-1/2"></div>

        <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white dark:border-blue-500/40 shadow">
            1
          </div>
          <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
            Bronze
          </strong>
          <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
            {isEn
              ? "Raw CSV ingestion (4.65M spins) + orphan check."
              : "Ingestion CSV brute (4,65M spins) + contrôle d'intégrité."}
          </p>
        </div>

        <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white dark:border-purple-500/40 shadow">
            2
          </div>
          <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
            Silver
          </strong>
          <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
            {isEn
              ? "Player-Session-Spin join & net_revenue calculation."
              : "Jointure Joueur-Session-Spin & calcul du revenu net."}
          </p>
        </div>

        <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white dark:border-emerald-500/40 shadow">
            3
          </div>
          <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
            Gold
          </strong>
          <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
            {isEn
              ? "4 business tables reconciled to the cent with Silver."
              : "4 tables métier réconciliées au centime près avec Silver."}
          </p>
        </div>

        <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white dark:border-amber-500/40 shadow">
            4
          </div>
          <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
            MLflow UC
          </strong>
          <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
            {isEn
              ? "Registers @champion model & scores 6,857 active players."
              : "Enregistre le modèle @champion & score les 6 857 actifs."}
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white dark:border-rose-500/40 shadow">
            5
          </div>
          <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
            Text-to-SQL
          </strong>
          <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
            {isEn
              ? "4 AST safety shields for 0.3s self-service queries."
              : "4 boucliers AST pour interroger Gold en 0,3 seconde."}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center font-sans">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-700 dark:text-[var(--text-muted)] rounded-full text-xs sm:text-sm font-medium border border-slate-200 dark:border-[var(--border)]">
          <svg
            className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isEn
            ? "Fast CI/CD Loop: Validated on a 5% deterministic sample (igaming_dev) in 3s before production deployment"
            : "Boucle CI/CD rapide : Validé sur un échantillon déterministe de 5 % (igaming_dev) en 3s avant déploiement en production"}
        </span>
      </div>
    </section>
  );
}
