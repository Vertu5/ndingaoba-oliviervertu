"use client";

import React, { useState } from "react";
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌾 Project: Genetic Agricultural Optimization (NSGA-II + PROMETHEE II)
// 👨‍💻 Author: Olivier Vertu Ndingaoba
// 🌐 Portfolio: https://ndingaoba-oliviervertu.vercel.app/
// 📅 Date: August 2026
// 📝 Description: Interactive Front-End Component - Spatial Optimization.
// ==============================================================================

// Geographic Land Classification Map (10x10 Grid)
const USAGE_MAP = [
  ["R", "R", "C", "C", "C", "R", "C", "C", "A", "A"],
  ["R", "C", "C", "C", "C", "C", "C", "A", "A", "A"],
  ["C", "C", "C", "R", "R", "C", "C", "C", "C", "A"],
  ["C", "C", "R", "R", "R", "C", "C", "C", "C", "C"],
  ["C", "C", "C", "C", "C", "C", "C", "R", "R", "C"],
  ["A", "C", "C", "C", "C", "C", "C", "C", "R", "R"],
  ["A", "A", "C", "C", "R", "R", "C", "C", "C", "C"],
  ["A", "A", "C", "C", "C", "R", "C", "C", "C", "C"],
  ["C", "C", "C", "C", "C", "C", "C", "C", "C", "C"],
  ["R", "R", "C", "C", "C", "C", "C", "R", "R", "R"],
];

const COST_MAP = Array(10)
  .fill(0)
  .map((_, i) => Array(10).fill(0).map((_, j) => Math.floor(Math.abs(Math.sin(i * 10 + j)) * 40) + 30));

const PROD_MAP = Array(10)
  .fill(0)
  .map((_, i) => Array(10).fill(0).map((_, j) => (Math.abs(Math.cos(i * 5 + j)) * 5 + 5).toFixed(1)));

export default function GeneticOptimizer() {
  const { lang } = useLang();
  const [budget, setBudget] = useState<number>(500);
  const [loading, setLoading] = useState<boolean>(false);
  const [solutionGrid, setSolutionGrid] = useState<number[][] | null>(null);
  const [metrics, setMetrics] = useState<{
    productivity: number;
    compactness: number;
    proximity: number;
    total_cost?: number;
    promethee_phi?: number;
  } | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      // Call Next.js / Vercel Serverless API endpoint
      const response = await fetch("/api/optimize-land", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usage_map: USAGE_MAP,
          cost_map: COST_MAP,
          production_map: PROD_MAP,
          budget_limit: budget,
          generations: 35,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSolutionGrid(data.best_solution_grid);
        setMetrics(data.metrics);
      } else {
        alert(lang === "fr" ? "Erreur lors de l'optimisation." : "Optimization error.");
      }
    } catch (error) {
      console.error("Erreur de connexion à l'API :", error);
    }
    setLoading(false);
  };

  // Determine cell color using portfolio dark mode color system
  const getCellColor = (i: number, j: number) => {
    const usage = USAGE_MAP[i][j];
    const isBought = solutionGrid && (solutionGrid[i][j] === 3 || solutionGrid[i][j] === 2);

    if (isBought && usage === "C") return "bg-[#F59E0B] border-[#F59E0B]/60 shadow-lg shadow-amber-500/20 text-black font-bold animate-pulse"; // Gold (Newly Bought by AI)
    if (usage === "A") return "bg-[#15803D] border-[#15803D]/60 text-white"; // Forest Green (Existing Farm)
    if (usage === "C") return "bg-[#BAE6FD]/20 border-[#BAE6FD]/30 text-sky-200"; // Sky Blue (Candidate)
    return "bg-[#374151]/40 border-[#374151]/30 text-gray-500"; // Dark Charcoal (Restricted)
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-8 space-y-8 shadow-xl">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs font-semibold text-[var(--accent)] mb-2">
            <span>🧬</span>
            <span>{lang === "fr" ? "IA d'Expansion Agricole (NSGA-II + PROMETHEE II)" : "Agricultural Expansion AI (NSGA-II + PROMETHEE II)"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            {lang === "fr" ? "Optimisation Spatiale Multi-Objectifs" : "Multi-Objective Spatial Optimization"}
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
            Author: NDINGA OBA Olivier Vertu · Master Ingénieur Civil Informatique (ULB/ERM)
          </p>
        </div>

        <a
          href="https://github.com/Vertu5/genetic_agricultural_optimization"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--accent)] underline hover:no-underline shrink-0 font-medium bg-[var(--accent)]/10 px-3.5 py-2 rounded-lg border border-[var(--accent)]/20 hover:bg-[var(--accent)] hover:text-black transition-colors"
        >
          💻 Code Source GitHub ↗
        </a>
      </div>

      {/* Main Grid: Control Panel + 10x10 Land Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Control Panel (1 col) */}
        <div className="col-span-1 bg-[var(--bg)]/60 p-6 rounded-xl border border-[var(--border)] space-y-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text)]">
            ⚙️ {lang === "fr" ? "Paramètres & Budget" : "Parameters & Budget"}
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <label className="text-[var(--text)] font-medium">
                💰 {lang === "fr" ? "Budget d'acquisition" : "Acquisition Budget"}:
              </label>
              <span className="font-bold text-[var(--accent)] font-mono text-sm">${budget}</span>
            </div>
            <input
              type="range"
              min="150"
              max="750"
              step="50"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--accent)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
              <span>$150</span>
              <span>$450</span>
              <span>$750</span>
            </div>
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-mono text-xs font-bold transition-all duration-300 shadow-md cursor-pointer ${
              loading
                ? "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
                : "bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 shadow-[var(--accent)]/20"
            }`}
          >
            {loading
              ? (lang === "fr" ? "⚡ Génération Pareto en cours..." : "⚡ Running NSGA-II Search...")
              : (lang === "fr" ? "🚀 Lancer l'Optimisation NSGA-II" : "🚀 Run NSGA-II Optimization")}
          </button>

          {/* Metrics Results Box */}
          {metrics && (
            <div className="mt-6 p-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--bg-elevated)] space-y-3 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h4 className="font-display text-sm font-bold text-[var(--accent)]">
                  🏆 {lang === "fr" ? "Compromis Rang 1 (PROMETHEE II)" : "Rank 1 Compromise (PROMETHEE II)"}
                </h4>
              </div>
              <ul className="font-mono text-xs space-y-2 text-[var(--text-muted)]">
                <li className="flex justify-between items-center">
                  <span>🌾 {lang === "fr" ? "Productivité :" : "Productivity:"}</span>
                  <strong className="text-emerald-400 font-bold">{metrics.productivity.toFixed(2)} pts</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>🧩 {lang === "fr" ? "Compacité :" : "Compactness:"}</span>
                  <strong className="text-amber-400 font-bold">{metrics.compactness.toFixed(3)}</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>📍 {lang === "fr" ? "Proximité :" : "Proximity:"}</span>
                  <strong className="text-sky-400 font-bold">{metrics.proximity.toFixed(2)} km</strong>
                </li>
                {metrics.total_cost && (
                  <li className="flex justify-between items-center border-t border-dashed border-[var(--border)] pt-2 mt-2">
                    <span>💰 {lang === "fr" ? "Coût Total :" : "Total Cost:"}</span>
                    <strong className="text-[var(--accent)]">${metrics.total_cost} / ${budget}</strong>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* 10x10 Spatial Interactive Grid Map (2 cols) */}
        <div className="col-span-2 flex flex-col items-center justify-center space-y-5">
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold self-start">
            🗺️ {lang === "fr" ? "Grille Spatiale 10x10 (Terres Agricoles)" : "10x10 Spatial Agricultural Land Grid"}
          </div>

          <div className="grid grid-cols-10 gap-1.5 bg-[var(--bg)] p-3 sm:p-4 rounded-xl border border-[var(--border)] shadow-inner">
            {USAGE_MAP.map((row, i) =>
              row.map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-7 h-7 sm:w-11 sm:h-11 rounded flex items-center justify-center font-mono text-[9px] font-bold border transition-all duration-500 cursor-pointer ${getCellColor(
                    i,
                    j
                  )}`}
                  title={`Cellule [${i},${j}] - ${USAGE_MAP[i][j]}`}
                >
                  {solutionGrid && (solutionGrid[i][j] === 3 || solutionGrid[i][j] === 2) && USAGE_MAP[i][j] === "C"
                    ? "★"
                    : USAGE_MAP[i][j] === "A"
                    ? "A"
                    : ""}
                </div>
              ))
            )}
          </div>

          {/* Color Legend (Match Official Design System & README) */}
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#374151]/60 border border-gray-600 rounded"></div>
              <span>{lang === "fr" ? "Restreint (R)" : "Restricted (R)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#BAE6FD]/20 border border-[#BAE6FD]/40 rounded"></div>
              <span>{lang === "fr" ? "Candidat (C)" : "Candidate (C)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#15803D] rounded"></div>
              <span>{lang === "fr" ? "Ferme (A)" : "Existing Farm (A)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#F59E0B] rounded shadow-md animate-pulse"></div>
              <span className="text-[var(--accent)] font-semibold">{lang === "fr" ? "Achat IA ! ★" : "AI Bought! ★"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
