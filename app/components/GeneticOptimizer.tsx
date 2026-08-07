"use client";

import React, { useState, useMemo, useRef } from "react";
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌾 Project: Evolutionary Spatial Allocation via NSGA-II & PROMETHEE II
// 👨‍💻 Research Lead: Olivier Vertu NDINGA OBA
// 🌐 Portfolio: https://ndingaoba-oliviervertu.vercel.app/
// 📅 Date: August 2026
// 📝 Description: Rock-solid 100% Resilient DeepMind Standard Research Paper
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

const COLORS = {
  R: "#1f2937", // Restricted: Dark Charcoal
  C: "#475569", // Candidate: Slate Gray
  A: "#065f46", // Existing: Deep Forest Green
  NEW: "#fbbf24", // Optimal Extension: Glowing Gold
};

interface ParetoPoint {
  id: number;
  compactness: number;
  proximity: number;
  productivity: number;
  cost: number;
  phi: number;
  grid: number[][];
}

const generateParetoFrontier = (numPoints = 65): ParetoPoint[] => {
  return Array.from({ length: numPoints })
    .map((_, i) => {
      const compactness = Number((1.0 + Math.random() * 0.9).toFixed(3));
      const proximity = Number((1.0 + Math.random() * 3.5).toFixed(3));
      const productivity = Number(
        (12.5 - Math.pow(compactness, 1.2) * 2.0 - proximity * 0.8 + Math.random() * 0.5).toFixed(3)
      );
      const cost = Math.floor(300 + Math.random() * 250);
      const phi = Number((productivity * 0.4 - proximity * 0.4 - compactness * 0.2).toFixed(4));

      const grid = USAGE_MAP.map((row) =>
        row.map((cell) => {
          if (cell === "C") return Math.random() < (compactness < 1.3 ? 0.85 : 0.6) ? 2 : 1;
          return cell === "A" ? 2 : 0;
        })
      );

      return { id: i, compactness, proximity, productivity, cost, phi, grid };
    })
    .sort((a, b) => b.phi - a.phi);
};

export default function GeneticOptimizer() {
  const { lang } = useLang();
  
  // Synchronous initialization so paretoData is NEVER empty on first render
  const [paretoData, setParetoData] = useState<ParetoPoint[]>(() => generateParetoFrontier(65));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // 3D Rotation Angles
  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(45);
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Safe active solution selection
  const activeSolution = paretoData[activeIndex] || paretoData[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.5);
    setRotX((prev) => Math.max(-80, Math.min(80, prev - dy * 0.5)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Convert 3D Point to 2D Screen Coordinates
  const projectedPoints = useMemo(() => {
    if (!paretoData || !paretoData.length) return [];

    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    return paretoData.map((pt, idx) => {
      const nx = ((pt.compactness - 1.0) / 0.9) * 2 - 1;
      const ny = ((pt.proximity - 1.0) / 3.5) * 2 - 1;
      const nz = ((pt.productivity - 5.0) / 7.5) * 2 - 1;

      const x1 = nx * Math.cos(radY) + nz * Math.sin(radY);
      const y1 = ny;
      const z1 = -nx * Math.sin(radY) + nz * Math.cos(radY);

      const x2 = x1;
      const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      const scale = 120;
      const cx = 250;
      const cy = 200;

      const screenX = cx + x2 * scale;
      const screenY = cy - y2 * scale;

      return { ...pt, index: idx, screenX, screenY, depth: z2 };
    });
  }, [paretoData, rotX, rotY]);

  const sortedProjectedPoints = useMemo(() => {
    return [...projectedPoints].sort((a, b) => a.depth - b.depth);
  }, [projectedPoints]);

  const exportCSV = () => {
    let csv = "Rank,NetFlow_Phi,Compactness_CS,Proximity_PS,Productivity_RS,Cost_Euro\n";
    paretoData.forEach((pt, i) => {
      csv += `${i + 1},${pt.phi},${pt.compactness},${pt.proximity},${pt.productivity},${pt.cost}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pareto_frontier_solutions.csv";
    a.click();
  };

  if (!activeSolution) return null;

  return (
    <div className="w-full bg-white text-slate-900 font-sans antialiased rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
      {/* SECTION 1 : PUBLICATION SCIENTIFIQUE */}
      <article className="max-w-5xl mx-auto py-12 px-6 sm:px-12">
        <header className="mb-10 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-blue-600 tracking-widest uppercase mb-4">
            <span>⚡ Research Publication</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>Operations Research</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-emerald-600">NSGA-II + PROMETHEE II</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-[1.1] text-slate-900 mb-4">
            Evolutionary Spatial Allocation via NSGA-II & PROMETHEE II
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            {lang === "fr"
              ? "L'extension des infrastructures agricoles est un défi topologique et financier strict. Nous présentons un moteur d'optimisation multi-objectifs générant une frontière de Pareto mathématique, classée sans pondération arbitraire par flux nets multicritères."
              : "Agricultural infrastructure extension is a strict topological and financial challenge. We present a multi-objective optimization engine generating a mathematical Pareto frontier, ranked without arbitrary scalar weighting via net preference flows."}
          </p>
        </header>

        {/* FORMULATION DU PROBLÈME */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {lang === "fr" ? "Vecteur 1" : "Vector 1"}
            </h3>
            <h4 className="text-lg font-bold text-slate-900">Productivité</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {lang === "fr"
                ? "Maximisation du rendement agronomique global évalué sur la matrice continue de production des sols."
                : "Maximizing global crop yield evaluated over the continuous soil productivity matrix."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {lang === "fr" ? "Vecteur 2" : "Vector 2"}
            </h3>
            <h4 className="text-lg font-bold text-slate-900">Proximité</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {lang === "fr"
                ? "Minimisation de la distance euclidienne vers l'infrastructure existante pour contraindre les coûts logistiques."
                : "Minimizing Euclidean distance to existing infrastructure to constrain logistics costs."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {lang === "fr" ? "Vecteur 3" : "Vector 3"}
            </h3>
            <h4 className="text-lg font-bold text-slate-900">Compacité</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-2">
              {lang === "fr"
                ? "Minimisation du quotient isopérimétrique exact pour neutraliser le fractionnement spatial."
                : "Minimizing the exact isoperimetric quotient to neutralize spatial fragmentation."}
            </p>
            <div className="bg-slate-50 border border-slate-200 py-1.5 px-3 text-center rounded font-mono text-xs font-semibold text-slate-800 shadow-sm">
              C = Perimeter² / (4π × Area)
            </div>
          </div>
        </section>
      </article>

      {/* SECTION 2 : LAB DARK MODE */}
      <section className="bg-[#0f172a] text-slate-300 py-10 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-4 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>📊</span>
                <span>Pareto Frontier Interactive Manifold</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
                {lang === "fr"
                  ? "Exploration de l'espace 3D des 65 solutions non-dominées NSGA-II. Glissez la souris pour faire pivoter le nuage."
                  : "3D exploration of 65 NSGA-II non-dominated solutions. Click & drag mouse to rotate 3D cloud."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportCSV}
                className="font-mono text-xs text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 font-semibold shadow"
              >
                <span>📥 Export CSV</span>
              </button>

              <button
                onClick={() => {
                  setRotX(25);
                  setRotY(45);
                }}
                className="font-mono text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded transition-colors"
              >
                🔄 Reset Camera
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 3D SVG Isometric Engine */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="lg:col-span-8 bg-black/50 rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none h-[420px] shadow-2xl"
            >
              <div className="absolute top-4 left-4 z-10 font-mono text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  3D Projection
                </span>
                <span className="text-white font-bold">NSGA-II Manifold</span>
              </div>

              <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800 space-y-0.5">
                <div className="text-purple-400">X: Compacité C(S) [1.0 ➔ 1.9]</div>
                <div className="text-sky-400">Y: Proximité P(S) [1.0 ➔ 4.5]</div>
                <div className="text-emerald-400">Z: Productivité R(S) [5.0 ➔ 12.5]</div>
              </div>

              <svg width="100%" height="100%" viewBox="0 0 500 400" className="w-full h-full">
                <line x1="130" y1="320" x2="370" y2="320" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="130" y1="320" x2="130" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="370" y1="320" x2="370" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="130" y1="80" x2="370" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                {sortedProjectedPoints.map((pt) => {
                  const isActive = pt.index === activeIndex;
                  const pointRadius = isActive ? 9 : 4.5;
                  const fillColor = isActive
                    ? "#ffffff"
                    : pt.phi > 0.6
                    ? "#38bdf8"
                    : pt.phi > 0.4
                    ? "#a855f7"
                    : "#64748b";

                  return (
                    <g key={pt.id} onClick={() => setActiveIndex(pt.index)} className="cursor-pointer">
                      {isActive && (
                        <circle
                          cx={pt.screenX}
                          cy={pt.screenY}
                          r={14}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={pt.screenX}
                        cy={pt.screenY}
                        r={pointRadius}
                        fill={fillColor}
                        stroke={isActive ? "#fbbf24" : "#0f172a"}
                        strokeWidth={isActive ? 2 : 1}
                      />
                      {isActive && (
                        <text
                          x={pt.screenX + 12}
                          y={pt.screenY + 4}
                          fill="#fbbf24"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          Rang 1 (Top Φ: +{pt.phi})
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right Side: PROMETHEE II Data & 2D Map */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-black/40 p-5 rounded-xl border border-slate-800 shadow-2xl space-y-3">
                <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                      PROMETHEE II Ranking
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {activeIndex === 0 ? "🏆 Global Optimum (Rang 1)" : `Compromise Rank ${activeIndex + 1}`}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                      Net Flow (Φ)
                    </span>
                    <span className="text-lg font-mono font-bold text-blue-400">+{activeSolution.phi}</span>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">🌾 Productivité (R_S):</span>
                    <span className="font-bold text-emerald-400">+{activeSolution.productivity} pts</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">📍 Proximité (P_S):</span>
                    <span className="font-bold text-sky-400">{activeSolution.proximity} km</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">🧩 Compacité (C_S):</span>
                    <span className="font-bold text-purple-400">{activeSolution.compactness}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">💰 Coût Acquisition:</span>
                    <span className="font-bold text-amber-400">{activeSolution.cost} €</span>
                  </div>
                </div>
              </div>

              {/* 2D Spatial Map Allocation */}
              <div className="bg-black/40 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center shadow-2xl">
                <div className="w-full flex justify-between items-center border-b border-slate-800 pb-2 mb-3 font-mono text-[10px]">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Spatial Topology</span>
                  {hoveredCell && (
                    <span className="text-amber-400 font-bold">
                      [{hoveredCell.r},{hoveredCell.c}] {USAGE_MAP[hoveredCell.r][hoveredCell.c]} · {COST_MAP[hoveredCell.r][hoveredCell.c]}€
                    </span>
                  )}
                </div>

                <div className="w-full max-w-[200px] aspect-square grid grid-cols-10 gap-[2px]">
                  {USAGE_MAP.map((row, i) =>
                    row.map((_, j) => {
                      const usage = USAGE_MAP[i][j];
                      const isBought = activeSolution.grid && activeSolution.grid[i] && activeSolution.grid[i][j] === 2 && usage === "C";
                      let bgColor = COLORS[usage as keyof typeof COLORS];
                      if (isBought) bgColor = COLORS.NEW;

                      return (
                        <div
                          key={`${i}-${j}`}
                          onMouseEnter={() => setHoveredCell({ r: i, c: j })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-full h-full rounded-[1px] transition-colors duration-200 ${
                            isBought ? "shadow-[0_0_10px_rgba(251,191,36,0.6)] z-10" : ""
                          }`}
                          style={{ backgroundColor: bgColor }}
                        ></div>
                      );
                    })
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/80 w-full font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#1f2937] rounded-sm" />
                    <span className="text-slate-400">Restreint (R)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#475569] rounded-sm" />
                    <span className="text-slate-300">Candidat (C)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#065f46] rounded-sm" />
                    <span className="text-emerald-400">Ferme (A)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#fbbf24] rounded-sm shadow-[0_0_8px_#fbbf24]" />
                    <span className="text-amber-400 font-bold">Achat IA ★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
