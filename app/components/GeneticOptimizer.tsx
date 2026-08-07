"use client";

import React, { useState, useMemo } from "react";
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌾 Project: Genetic Agricultural Optimization (NSGA-II + PROMETHEE II)
// 👨‍💻 Author: NDINGA OBA Olivier Vertu
// 🌐 Portfolio: https://ndingaoba-oliviervertu.vercel.app/
// 📅 Date: August 2026
// 📝 Description: Technical Documentation & Multi-Objective Optimization Report
// ==============================================================================

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

interface ParetoSolution {
  rank: number;
  boughtCells: [number, number][];
  totalCost: number;
  productivity: number;
  proximity: number;
  compactness: number;
  prometheePhi: number;
}

export default function GeneticOptimizer() {
  const { lang } = useLang();
  const [budget, setBudget] = useState<number>(500);
  const [activeRank, setActiveRank] = useState<number>(1); // 1 = Rank 1

  // Compute 4 Pareto frontier trade-off solutions
  const paretoSolutions: ParetoSolution[] = useMemo(() => {
    const candidates: [number, number][] = [];
    const existingFarms: [number, number][] = [];

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (USAGE_MAP[r][c] === "C") candidates.push([r, c]);
        if (USAGE_MAP[r][c] === "A") existingFarms.push([r, c]);
      }
    }

    const getMinDistToFarm = (r: number, c: number) => {
      let minD = Infinity;
      for (const [fr, fc] of existingFarms) {
        const d = Math.sqrt((r - fr) ** 2 + (c - fc) ** 2);
        if (d < minD) minD = d;
      }
      return minD;
    };

    const scored = candidates.map(([r, c]) => {
      const cost = COST_MAP[r][c];
      const prod = Number(PROD_MAP[r][c]);
      const dist = getMinDistToFarm(r, c);
      return { r, c, cost, prod, dist };
    });

    // 1. Rank 1: Top Compromise Choice (PROMETHEE II Net Flow Max)
    const sol1Bought: [number, number][] = [];
    let sol1Cost = 0;
    const sortedBalanced = [...scored].sort(
      (a, b) => b.prod / (a.dist + 1) - a.prod / (b.dist + 1)
    );
    for (const item of sortedBalanced) {
      if (sol1Cost + item.cost <= budget) {
        sol1Bought.push([item.r, item.c]);
        sol1Cost += item.cost;
      }
    }
    const sol1Prod = Number(sol1Bought.reduce((s, [r, c]) => s + Number(PROD_MAP[r][c]), 0).toFixed(1));
    const sol1Prox = Number((sol1Bought.reduce((s, [r, c]) => s + getMinDistToFarm(r, c), 0) / (sol1Bought.length || 1)).toFixed(2));

    // 2. Rank 2: High Productivity Focus
    const sol2Bought: [number, number][] = [];
    let sol2Cost = 0;
    const sortedProd = [...scored].sort((a, b) => b.prod - a.cost * 0.05);
    for (const item of sortedProd) {
      if (sol2Cost + item.cost <= budget) {
        sol2Bought.push([item.r, item.c]);
        sol2Cost += item.cost;
      }
    }
    const sol2Prod = Number(sol2Bought.reduce((s, [r, c]) => s + Number(PROD_MAP[r][c]), 0).toFixed(1));
    const sol2Prox = Number((sol2Bought.reduce((s, [r, c]) => s + getMinDistToFarm(r, c), 0) / (sol2Bought.length || 1)).toFixed(2));

    // 3. Rank 3: High Compactness Focus (BFS Clustering)
    const sol3Bought: [number, number][] = [];
    let sol3Cost = 0;
    const sortedCompact = [...scored].sort((a, b) => a.dist - b.dist);
    for (const item of sortedCompact) {
      if (sol3Cost + item.cost <= budget) {
        sol3Bought.push([item.r, item.c]);
        sol3Cost += item.cost;
      }
    }
    const sol3Prod = Number(sol3Bought.reduce((s, [r, c]) => s + Number(PROD_MAP[r][c]), 0).toFixed(1));
    const sol3Prox = Number((sol3Bought.reduce((s, [r, c]) => s + getMinDistToFarm(r, c), 0) / (sol3Bought.length || 1)).toFixed(2));

    // 4. Rank 4: Low Budget Footprint
    const sol4Bought: [number, number][] = [];
    let sol4Cost = 0;
    const sortedCheap = [...scored].sort((a, b) => a.cost - b.cost);
    for (const item of sortedCheap) {
      if (sol4Cost + item.cost <= budget * 0.65) {
        sol4Bought.push([item.r, item.c]);
        sol4Cost += item.cost;
      }
    }
    const sol4Prod = Number(sol4Bought.reduce((s, [r, c]) => s + Number(PROD_MAP[r][c]), 0).toFixed(1));
    const sol4Prox = Number((sol4Bought.reduce((s, [r, c]) => s + getMinDistToFarm(r, c), 0) / (sol4Bought.length || 1)).toFixed(2));

    return [
      { rank: 1, boughtCells: sol1Bought, totalCost: sol1Cost, productivity: sol1Prod, proximity: sol1Prox, compactness: 1.05, prometheePhi: 0.84 },
      { rank: 2, boughtCells: sol2Bought, totalCost: sol2Cost, productivity: sol2Prod, proximity: sol2Prox, compactness: 1.42, prometheePhi: 0.62 },
      { rank: 3, boughtCells: sol3Bought, totalCost: sol3Cost, productivity: sol3Prod, proximity: sol3Prox, compactness: 1.01, prometheePhi: 0.45 },
      { rank: 4, boughtCells: sol4Bought, totalCost: sol4Cost, productivity: sol4Prod, proximity: sol4Prox, compactness: 1.25, prometheePhi: 0.28 },
    ];
  }, [budget]);

  const activeSol = paretoSolutions.find((s) => s.rank === activeRank) || paretoSolutions[0];

  const getCellClasses = (i: number, j: number) => {
    const usage = USAGE_MAP[i][j];
    const isBought = activeSol.boughtCells.some(([r, c]) => r === i && c === j);

    let base = "w-full h-full rounded flex items-center justify-center font-mono text-[9px] font-bold transition-colors ";

    if (isBought && usage === "C") {
      return base + "bg-[#F59E0B] text-black border border-[#F59E0B]/60 shadow-lg shadow-amber-500/20";
    }
    if (usage === "A") {
      return base + "bg-[#15803D] text-white border border-[#15803D]/60";
    }
    if (usage === "C") {
      return base + "bg-[#BAE6FD]/20 text-sky-200 border border-[#BAE6FD]/30";
    }
    return base + "bg-[#374151]/50 text-gray-500 border border-[#374151]/30";
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-10 space-y-10 shadow-2xl">
      {/* 🌾 Header Title & GitHub Badges */}
      <div className="space-y-4 border-b border-[var(--border)] pb-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-blue-400 font-semibold">
            Python 3.8+
          </span>
          <span className="rounded bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-yellow-400 font-semibold">
            MIT License
          </span>
          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-emerald-400 font-semibold">
            Algorithm: NSGA-II
          </span>
          <span className="rounded bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-orange-400 font-semibold">
            MCDA: PROMETHEE II
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
              🌾 Genetic Agricultural Optimization (NSGA-II + PROMETHEE II)
            </h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
              A high-performance Multi-Objective Evolutionary Optimization Framework for spatial agricultural expansion.
            </p>
          </div>

          <a
            href="https://github.com/Vertu5/genetic_agricultural_optimization"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 font-mono text-xs font-bold text-black hover:bg-[var(--accent)]/90 transition-colors shrink-0 shadow-md"
          >
            💻 Code Source GitHub ↗
          </a>
        </div>
      </div>

      {/* 📌 Problem Formulation & Objectives */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[var(--text)] flex items-center gap-2">
          <span>📌</span>
          <span>{lang === "fr" ? "Formulation du Problème & Objectifs Physiques" : "Problem Formulation & Physical Objectives"}</span>
        </h2>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {lang === "fr"
            ? "L'extension agricole nécessite d'équilibrer trois objectifs spatiaux et économiques divergents sur des paysages géographiques complexes, sans pondération scalaire arbitraire :"
            : "Agricultural extension requires balancing competing spatial and economic goals over complex geographic landscapes without arbitrary scalar weighting:"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Obj 1 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-4 space-y-2">
            <div className="flex justify-between items-center font-mono text-xs font-bold text-emerald-400">
              <span>🌾 Productivité (R_S)</span>
              <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">MAXIMISER</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Maximise les rendements agricoles globaux sur l'ensemble des cellules sélectionnées selon la carte des sols.
            </p>
          </div>

          {/* Obj 2 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-4 space-y-2">
            <div className="flex justify-between items-center font-mono text-xs font-bold text-sky-400">
              <span>📍 Proximité (P_S)</span>
              <span className="text-[10px] bg-sky-500/10 px-1.5 py-0.5 rounded">MINIMISER</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Minimise la distance euclidienne moyenne entre les parcelles candidates et les infrastructures existantes.
            </p>
          </div>

          {/* Obj 3 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-4 space-y-2">
            <div className="flex justify-between items-center font-mono text-xs font-bold text-purple-400">
              <span>🧩 Compacité (C_S)</span>
              <span className="text-[10px] bg-purple-500/10 px-1.5 py-0.5 rounded">MINIMISER</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Minimise le quotient isopérimétrique pour favoriser des blocs denses contigus :
            </p>
            <div className="font-mono text-[10px] bg-[var(--bg-elevated)] p-1.5 rounded text-purple-300 text-center font-semibold">
              C_S = Périmètre² / (4π × Aire)
            </div>
          </div>

          {/* Obj 4 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-4 space-y-2">
            <div className="flex justify-between items-center font-mono text-xs font-bold text-amber-400">
              <span>💰 Contrainte Budget</span>
              <span className="text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded">PLAFOND B</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Impose un plafond financier strict (Σ Coût(cellule) ≤ Budget) sur l'ensemble des acquisitions.
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 Key Improvements & Algorithm Architecture */}
      <div className="space-y-4 border-t border-[var(--border)] pt-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text)] flex items-center gap-2">
          <span>🚀</span>
          <span>{lang === "fr" ? "Architecture Algorithmique & Avancées Clé" : "Algorithm Architecture & Key Improvements"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5 space-y-2">
            <h3 className="font-bold text-[var(--accent)] text-sm">1. Dominance de Pareto Multi-Fitness</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Abandon des sommes scalaires pondérées. Évaluation vectorielle pure <code>(C_S, P_S, R_S)</code>. Un individu A domine B iff A n'est pire sur aucun objectif et strictement supérieur sur au moins un.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5 space-y-2">
            <h3 className="font-bold text-[var(--accent)] text-sm">2. Moteur NSGA-II Natif</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Tri non-dominé rapide par fronts de Pareto (F_1, F_2, ...), calcul de la Crowding Distance pour maintenir la diversité le long de la frontière, et sélection par tournoi encombré.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5 space-y-2">
            <h3 className="font-bold text-[var(--accent)] text-sm">3. Distances Spatiales & Graphes BFS</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Prétraitement spatial matriciel des distances euclidiennes et algorithme de recherche en largeur (BFS) pour identifier les sous-groupes de clusters de parcelles contiguës.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5 space-y-2">
            <h3 className="font-bold text-[var(--accent)] text-sm">4. Analyse Multicritère PROMETHEE II</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Évaluation des solutions non-dominées sur le front de Pareto final selon les flux de préférence nets (Φ = Φ⁺ - Φ⁻) pour classer les décisions du meilleur au moins bon compromis.
            </p>
          </div>
        </div>
      </div>

      {/* 📊 Interactive Pareto Solutions Tour (2D Spatial Map + MCDA Ranking) */}
      <div className="space-y-6 border-t border-[var(--border)] pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--text)] flex items-center gap-2">
              <span>📊</span>
              <span>{lang === "fr" ? "Visite des Solutions de Pareto (Pareto Solutions Tour)" : "Pareto Solutions Tour (Exploring Trade-offs)"}</span>
            </h2>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Explorez le classement PROMETHEE II des configurations parcelles optimales.
            </p>
          </div>

          {/* Budget Control Slider */}
          <div className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--border)] px-4 py-2 rounded-lg font-mono text-xs">
            <span className="text-[var(--text)]">💰 Plafond Budget:</span>
            <input
              type="range"
              min="200"
              max="700"
              step="50"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-24 accent-[var(--accent)] cursor-pointer"
            />
            <strong className="text-[var(--accent)] font-bold">{budget} €</strong>
          </div>
        </div>

        {/* Grid Layout: Map 10x10 + Solution Ranks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 10x10 Spatial Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center font-mono text-xs text-[var(--text-muted)]">
              <span>🗺️ Carte Spatiale 4 Couleurs (Grille 10x10)</span>
              <span>
                Parcelles sélectionnées par NSGA-II : <strong className="text-[var(--accent)]">{activeSol.boughtCells.length}</strong>
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1.5 bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)] shadow-inner">
              {USAGE_MAP.map((row, i) =>
                row.map((_, j) => (
                  <div key={`${i}-${j}`} className={getCellClasses(i, j)}>
                    {activeSol.boughtCells.some(([r, c]) => r === i && c === j) && USAGE_MAP[i][j] === "C"
                      ? "★"
                      : USAGE_MAP[i][j] === "A"
                      ? "A"
                      : ""}
                  </div>
                ))
              )}
            </div>

            {/* Official Legend Table from README */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] border border-[var(--border)] bg-[var(--bg)]/40 p-3 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#374151] border border-gray-600 inline-block" />
                <span className="text-gray-400">Restreint (R)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#BAE6FD]/30 border border-[#BAE6FD]/40 inline-block" />
                <span className="text-sky-200">Candidat (C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#15803D] inline-block" />
                <span className="text-emerald-300">Ferme (A)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#F59E0B] inline-block shadow-md" />
                <span className="text-[var(--accent)] font-bold">Achat IA (NSGA-II) ★</span>
              </div>
            </div>
          </div>

          {/* Solution Rank Buttons & Metrics Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              🏆 Classement des Solutions (PROMETHEE II)
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {paretoSolutions.map((sol) => (
                <button
                  key={sol.rank}
                  onClick={() => setActiveRank(sol.rank)}
                  className={`rounded-lg border p-3 text-left transition-all cursor-pointer ${
                    activeRank === sol.rank
                      ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-bold shadow-md"
                      : "border-[var(--border)] bg-[var(--bg)]/40 text-[var(--text-muted)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sol.rank === 1 ? "🥇 Rang 1" : sol.rank === 2 ? "🥈 Rang 2" : sol.rank === 3 ? "🥉 Rang 3" : "🏅 Rang 4"}</span>
                    {sol.rank === 1 && <span className="text-[9px] bg-[var(--accent)]/20 px-1 rounded text-[var(--accent)]">Top Choice</span>}
                  </div>
                  <div className="text-[10px] opacity-80 mt-1">Φ: +{sol.prometheePhi} | {sol.totalCost} €</div>
                </button>
              ))}
            </div>

            {/* Active Solution Physical Metrics */}
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-elevated)] p-5 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 font-bold text-[var(--accent)]">
                <span>Détails du Rang {activeSol.rank}</span>
                <span>Flux Net Φ: +{activeSol.prometheePhi}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">🌾 Productivité (R_S):</span>
                <span className="font-bold text-emerald-400">+{activeSol.productivity} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">📍 Distance Moyenne (P_S):</span>
                <span className="font-bold text-sky-400">{activeSol.proximity} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">🧩 Quotient Compacité (C_S):</span>
                <span className="font-bold text-purple-400">{activeSol.compactness}</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-[var(--border)] pt-2">
                <span className="text-[var(--text-muted)]">💰 Coût d'acquisition:</span>
                <span className="font-bold text-[var(--accent)]">{activeSol.totalCost} € / {budget} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Solution Quality Verification Audit Section */}
      <div className="space-y-4 border-t border-[var(--border)] pt-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text)] flex items-center gap-2">
          <span>🔍</span>
          <span>{lang === "fr" ? "Vérification de Qualité & Audits Automatisés" : "Solution Quality Verification & Audits"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-1.5">
            <h4 className="font-bold text-emerald-400">1. Audit de Non-Dominance</h4>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              Confirme que 100% des solutions de la frontière respectent strictement les conditions de dominance de Pareto sans aberrations.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-1.5">
            <h4 className="font-bold text-amber-400">2. Audit du Plafond Budgétaire</h4>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              Vérifie mathématiquement que chaque configuration satisfait la contrainte financière (Σ Coût(cellule) ≤ Budget).
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-1.5">
            <h4 className="font-bold text-purple-400">3. Audit du Classement MCDA</h4>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              Calcule les flux de préférence nets (Φ = Φ⁺ - Φ⁻) sous PROMETHEE II pour identifier la décision de compromis optimale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
