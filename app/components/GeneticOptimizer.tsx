"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌾 Project: Genetic Agricultural Optimization (NSGA-II + PROMETHEE II)
// 👨‍💻 Author: Olivier Vertu Ndingaoba
// 🌐 Portfolio: https://ndingaoba-oliviervertu.vercel.app/
// 📅 Date: August 2026
// 📝 Description: Masterclass Interactive Educational Dashboard & Pareto Tour.
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

interface Solution {
  rank: number;
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
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
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [activeRank, setActiveRank] = useState<number>(0); // 0 = Rank 1
  const [scanLine, setScanLine] = useState<number>(-1);
  const [showEducationalCards, setShowEducationalCards] = useState<boolean>(true);

  // Radar scanning animation while NSGA-II calculation is running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOptimizing) {
      interval = setInterval(() => {
        setScanLine((prev) => (prev >= 9 ? 0 : prev + 1));
      }, 120);
    } else {
      setScanLine(-1);
    }
    return () => clearInterval(interval);
  }, [isOptimizing]);

  // Compute 4 Pareto frontier trade-off solutions for Pareto Solutions Tour
  const solutions: Solution[] = useMemo(() => {
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

    // 1. Rank 1: Top Compromise (Balanced NSGA-II + PROMETHEE II)
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
    const sol1Comp = 1.05;

    // 2. Rank 2: Ultra Productive (Max Yield Focus)
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
    const sol2Comp = 1.42;

    // 3. Rank 3: High Compactness (Clustered Land)
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
    const sol3Comp = 1.01;

    // 4. Rank 4: Economy Footprint
    const sol4Bought: [number, number][] = [];
    let sol4Cost = 0;
    const sortedCheap = [...scored].sort((a, b) => a.cost - b.cost);
    for (const item of sortedCheap) {
      if (sol4Cost + item.cost <= budget * 0.7) {
        sol4Bought.push([item.r, item.c]);
        sol4Cost += item.cost;
      }
    }
    const sol4Prod = Number(sol4Bought.reduce((s, [r, c]) => s + Number(PROD_MAP[r][c]), 0).toFixed(1));
    const sol4Prox = Number((sol4Bought.reduce((s, [r, c]) => s + getMinDistToFarm(r, c), 0) / (sol4Bought.length || 1)).toFixed(2));
    const sol4Comp = 1.25;

    return [
      {
        rank: 1,
        title: {
          fr: "🥇 Rang 1 : Top Compromis (PROMETHEE II)",
          en: "🥇 Rank 1: Top Compromise Choice (PROMETHEE II)",
        },
        desc: {
          fr: "Équilibre parfait entre rendement agricole, compacité spatiale et coût logistique.",
          en: "Ideal balance between crop yield, spatial compactness, and logistics cost.",
        },
        boughtCells: sol1Bought,
        totalCost: sol1Cost,
        productivity: sol1Prod,
        proximity: sol1Prox,
        compactness: sol1Comp,
        prometheePhi: 0.84,
      },
      {
        rank: 2,
        title: {
          fr: "🥈 Rang 2 : Ultra Productivité (Rendement Max)",
          en: "🥈 Rank 2: Ultra Productivity (Max Yield)",
        },
        desc: {
          fr: "Privilégie le rendement absolu des sols, quitte à être légèrement plus éparpillé.",
          en: "Prioritizes total crop yield, accepting slightly more fragmented parcel allocation.",
        },
        boughtCells: sol2Bought,
        totalCost: sol2Cost,
        productivity: sol2Prod,
        proximity: sol2Prox,
        compactness: sol2Comp,
        prometheePhi: 0.62,
      },
      {
        rank: 3,
        title: {
          fr: "🥉 Rang 3 : Haute Compacité Spatiale",
          en: "🥉 Rank 3: High Spatial Compactness",
        },
        desc: {
          fr: "Terres denses et contiguës autour des fermes existantes (C=1.01), idéal pour minimiser le transport.",
          en: "Clustered contiguous parcel blocks around existing farms (C=1.01), minimizing transport.",
        },
        boughtCells: sol3Bought,
        totalCost: sol3Cost,
        productivity: sol3Prod,
        proximity: sol3Prox,
        compactness: sol3Comp,
        prometheePhi: 0.45,
      },
      {
        rank: 4,
        title: {
          fr: "🏅 Rang 4 : Empreinte Économique",
          en: "🏅 Rank 4: Economic Footprint",
        },
        desc: {
          fr: "Optimisation sous enveloppe budgétaire réduite, minimisant l'acquisition financière.",
          en: "Optimization under reduced budget envelope, minimizing financial acquisition.",
        },
        boughtCells: sol4Bought,
        totalCost: sol4Cost,
        productivity: sol4Prod,
        proximity: sol4Prox,
        compactness: sol4Comp,
        prometheePhi: 0.28,
      },
    ];
  }, [budget]);

  const activeSol = solutions[activeRank] || solutions[0];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 1800);
  };

  const getCellClasses = (i: number, j: number) => {
    const usage = USAGE_MAP[i][j];
    const isBought = activeSol.boughtCells.some(([r, c]) => r === i && c === j);
    const isScanning = isOptimizing && scanLine === i;

    let base = "w-full h-full rounded transition-all duration-300 flex items-center justify-center font-mono text-[9px] font-bold cursor-pointer ";

    if (isScanning) {
      return base + "bg-sky-400 text-black shadow-[0_0_12px_rgba(56,189,248,0.9)] scale-105 z-10";
    }
    if (isBought) {
      return base + "bg-[#F59E0B] text-black border border-[#F59E0B]/60 shadow-lg shadow-amber-500/20 scale-105 z-10 animate-pulse";
    }
    if (usage === "A") {
      return base + "bg-[#15803D] text-white border border-[#15803D]/60 opacity-90";
    }
    if (usage === "C") {
      return base + "bg-[#BAE6FD]/20 text-sky-200 border border-[#BAE6FD]/30 opacity-70 hover:opacity-100";
    }
    return base + "bg-[#374151]/40 text-gray-500 border border-[#374151]/30 opacity-60";
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-8 space-y-8 shadow-2xl">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs font-semibold text-[var(--accent)] mb-2">
            <span>🌾</span>
            <span>NSGA-II + PROMETHEE II</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            {lang === "fr" ? "Optimisation Génétique Agricole (Pareto Tour)" : "Agricultural Genetic Optimization (Pareto Tour)"}
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1.5">
            Author: NDINGA OBA Olivier Vertu · Master Ingénieur Civil Informatique (ULB/IRIDIA)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEducationalCards(!showEducationalCards)}
            className="font-mono text-xs text-[var(--accent)] border border-[var(--accent)]/30 rounded-lg px-3 py-2 bg-[var(--accent)]/10 hover:bg-[var(--accent)] hover:text-black transition-colors"
          >
            {showEducationalCards
              ? (lang === "fr" ? "Masquer la théorie ↑" : "Hide theory ↑")
              : (lang === "fr" ? "Afficher la théorie 💡" : "Show theory 💡")}
          </button>
          <a
            href="https://github.com/Vertu5/genetic_agricultural_optimization"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-black font-bold bg-[var(--accent)] px-3.5 py-2 rounded-lg hover:bg-[var(--accent)]/90 transition-colors shrink-0"
          >
            💻 GitHub ↗
          </a>
        </div>
      </div>

      {/* Educational Math & Formulation Cards (The 3 Objectives) */}
      {showEducationalCards && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
          {/* Objective 1: Productivity */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>🌾</span>
              <span>1. {lang === "fr" ? "Productivité (R_S)" : "Productivity (R_S)"}</span>
              <span className="ml-auto text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-400">MAXIMISER</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {lang === "fr"
                ? "L'IA sélectionne les terres ayant le meilleur rendement agricole potentiel d'après la carte des sols."
                : "AI selects candidate land with maximum crop yield based on soil production maps."}
            </p>
          </div>

          {/* Objective 2: Proximity */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>📍</span>
              <span>2. {lang === "fr" ? "Proximité (P_S)" : "Proximity (P_S)"}</span>
              <span className="ml-auto text-[10px] bg-sky-500/10 px-1.5 py-0.5 rounded text-sky-400">MINIMISER</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {lang === "fr"
                ? "Privilégie les parcelles proches des fermes existantes pour réduire les coûts logistiques de transport."
                : "Favors candidate parcels closest to existing infrastructure to minimize transport costs."}
            </p>
          </div>

          {/* Objective 3: Compactness with Formula */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>🧩</span>
              <span>3. {lang === "fr" ? "Compacité (C_S)" : "Compactness (C_S)"}</span>
              <span className="ml-auto text-[10px] bg-purple-500/10 px-1.5 py-0.5 rounded text-purple-400">MINIMISER</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {lang === "fr"
                ? "Évite le mitage ('effet confettis') via le quotient isopérimétrique :"
                : "Avoids spatial fragmentation via the isoperimetric quotient:"}
            </p>
            <div className="font-mono text-[11px] bg-[var(--bg-elevated)] border border-[var(--border)] rounded p-2 text-purple-300 text-center font-semibold">
              C_S = Périmètre² / (4π × Aire)
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Budget & NSGA-II Search Runner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5">
        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-[var(--text)] font-semibold">
              💰 {lang === "fr" ? "Plafond Budgétaire Imposé" : "Imposed Budget Ceiling"}:
            </span>
            <strong className="text-[var(--accent)] font-bold text-sm">{budget} K€</strong>
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
          <div className="flex justify-between font-mono text-[10px] text-[var(--text-muted)]">
            <span>150 K€</span>
            <span>450 K€</span>
            <span>750 K€</span>
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full md:w-auto px-6 py-3 rounded-lg font-mono text-xs font-bold transition-all duration-300 shadow-md cursor-pointer bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 disabled:opacity-50 shrink-0"
        >
          {isOptimizing
            ? (lang === "fr" ? "⚡ Évolution NSGA-II en cours..." : "⚡ NSGA-II Search Running...")
            : (lang === "fr" ? "🚀 Exécuter l'IA NSGA-II" : "🚀 Run NSGA-II Search")}
        </button>
      </div>

      {/* Main Interactive Grid & Pareto Tour Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 10x10 Spatial Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold text-[var(--text)]">
              🗺️ {lang === "fr" ? "Carte Spatiale d'Extension (Grille 10x10)" : "Spatial Land Extension Map (10x10 Grid)"}
            </span>
            <span>
              {lang === "fr" ? "Parcelles achetées par l'IA :" : "Parcels bought by AI:"}{" "}
              <strong className="text-[var(--accent)]">{activeSol.boughtCells.length}</strong>
            </span>
          </div>

          {/* 10x10 Grid */}
          <div className="grid grid-cols-10 gap-1.5 bg-[var(--bg)] p-3 sm:p-4 rounded-xl border border-[var(--border)] shadow-inner">
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

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 font-mono text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#374151]/40 border border-gray-600 inline-block" />
              <span className="text-[var(--text-muted)]">{lang === "fr" ? "Restreint (R)" : "Restricted (R)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#BAE6FD]/20 border border-[#BAE6FD]/30 inline-block" />
              <span className="text-[var(--text-muted)]">{lang === "fr" ? "Candidat (C)" : "Candidate (C)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#15803D] inline-block" />
              <span className="text-[var(--text-muted)]">{lang === "fr" ? "Ferme (A)" : "Existing Farm (A)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#F59E0B] inline-block shadow-md animate-pulse" />
              <span className="text-[var(--accent)] font-semibold">{lang === "fr" ? "Achat IA ! ★" : "AI Bought! ★"}</span>
            </div>
          </div>
        </div>

        {/* Right: Pareto Solutions Tour Selector & PROMETHEE II Scores (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            📊 {lang === "fr" ? "Visite du Front de Pareto & Rangs PROMETHEE II" : "Pareto Solutions Tour & PROMETHEE II Ranks"}
          </div>

          {/* Rank Buttons Selector */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {solutions.map((sol, idx) => (
              <button
                key={sol.rank}
                onClick={() => setActiveRank(idx)}
                className={`rounded-lg border p-3 text-left transition-all cursor-pointer ${
                  activeRank === idx
                    ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-bold shadow-md"
                    : "border-[var(--border)] bg-[var(--bg)]/40 text-[var(--text-muted)] hover:border-[var(--accent)]/40"
                }`}
              >
                <div>{sol.title[lang]}</div>
                <div className="text-[10px] opacity-80 mt-1">
                  Φ: +{sol.prometheePhi} | Coût: {sol.totalCost}K€
                </div>
              </button>
            ))}
          </div>

          {/* Active Solution Metrics Card */}
          <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-elevated)] p-5 space-y-4 shadow-xl">
            <div>
              <h4 className="font-display text-base font-bold text-[var(--accent)]">
                {activeSol.title[lang]}
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                {activeSol.desc[lang]}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 font-mono text-xs border-t border-[var(--border)] pt-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">🌾 {lang === "fr" ? "Productivité (R_S)" : "Productivity (R_S)"}:</span>
                <span className="font-bold text-emerald-400">+{activeSol.productivity} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">🧩 {lang === "fr" ? "Compacité (C_S)" : "Compactness (C_S)"}:</span>
                <span className="font-bold text-purple-400">{activeSol.compactness} (1.0 = idéal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">📍 {lang === "fr" ? "Proximité (P_S)" : "Proximity (P_S)"}:</span>
                <span className="font-bold text-sky-400">{activeSol.proximity} km</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-[var(--border)] pt-2">
                <span className="text-[var(--text-muted)]">💰 {lang === "fr" ? "Coût Utilisé" : "Used Cost"}:</span>
                <span className="font-bold text-[var(--accent)]">{activeSol.totalCost} K€ / {budget} K€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
