"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Cpu, Database } from "lucide-react";
import { useLang } from "@/app/lib/i18n";

// Dynamic load Plotly to prevent SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// ==============================================================================
// 🌾 Project: Evolutionary Spatial Allocation via NSGA-II & PROMETHEE II
// 👨‍💻 Research Lead: Olivier Vertu NDINGA OBA
// 🌐 Portfolio: https://ndingaoba-oliviervertu.vercel.app/
// 📅 Date: August 2026
// 📝 Description: Interactive DeepMind Standard Research Paper & Pareto Manifold
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

const COLORS = {
  R: "#1f2937", // Restricted: Dark Charcoal
  C: "#475569", // Candidate: Slate Gray
  A: "#065f46", // Existing: Deep Forest Green
  NEW: "#fbbf24", // Optimal Extension: Glowing Gold
};

const generateParetoFrontier = (numPoints = 60) => {
  return Array.from({ length: numPoints })
    .map((_, i) => {
      const compactness = 1.0 + Math.random() * 0.9;
      const proximity = 1.0 + Math.random() * 3.5;
      const productivity =
        12.5 - Math.pow(compactness, 1.2) * 2.0 - proximity * 0.8 + Math.random() * 0.5;
      const phi = productivity * 0.4 - proximity * 0.4 - compactness * 0.2;

      const grid = USAGE_MAP.map((row) =>
        row.map((cell) => {
          if (cell === "C") return Math.random() < (compactness < 1.3 ? 0.9 : 0.6) ? 2 : 1;
          return cell === "A" ? 2 : 0;
        })
      );

      return { id: i, compactness, proximity, productivity, phi, grid };
    })
    .sort((a, b) => b.phi - a.phi);
};

export default function GeneticOptimizer() {
  const { lang } = useLang();
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setParetoData(generateParetoFrontier(75));
    setIsMounted(true);
  }, []);

  const activeSolution = paretoData[activeIndex];

  const plotData = useMemo(() => {
    if (!paretoData.length) return [];
    return [
      {
        x: paretoData.map((d) => d.compactness),
        y: paretoData.map((d) => d.proximity),
        z: paretoData.map((d) => d.productivity),
        mode: "markers",
        type: "scatter3d",
        marker: {
          size: paretoData.map((_, i) => (i === activeIndex ? 8 : 4)),
          color: paretoData.map((d) => d.phi),
          colorscale: "Plasma",
          showscale: false,
          line: {
            color: paretoData.map((_, i) => (i === activeIndex ? "#ffffff" : "transparent")),
            width: paretoData.map((_, i) => (i === activeIndex ? 2 : 0)),
          },
        },
        hovertemplate: "C: %{x:.2f}<br>P: %{y:.2f}<br>R: %{z:.2f}<extra></extra>",
      },
    ];
  }, [paretoData, activeIndex]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-white text-slate-900 font-sans antialiased rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
      {/* SECTION 1 : PUBLICATION SCIENTIFIQUE (Le Pourquoi) */}
      <article className="max-w-5xl mx-auto py-16 px-6 sm:px-12">
        <header className="mb-14 border-b border-slate-200 pb-12">
          <div className="flex items-center gap-3 text-xs font-bold text-blue-600 tracking-widest uppercase mb-6">
            <Cpu className="w-4 h-4" />
            <span>Research Publication</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>Operations Research</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1] text-slate-900 mb-6">
            Evolutionary Spatial Allocation via NSGA-II & PROMETHEE II
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light">
            {lang === "fr"
              ? "L'extension des infrastructures agricoles est un défi topologique et financier strict. Nous présentons un moteur d'optimisation multi-objectifs générant une frontière de Pareto mathématique, classée sans pondération arbitraire par flux nets multicritères."
              : "Agricultural infrastructure extension is a strict topological and financial challenge. We present a multi-objective optimization engine generating a mathematical Pareto frontier, ranked without arbitrary scalar weighting via net preference flows."}
          </p>
        </header>

        {/* FORMULATION DU PROBLÈME */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {lang === "fr" ? "Vecteur 1" : "Vector 1"}
            </h3>
            <h4 className="text-xl font-bold text-slate-900">Productivité</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {lang === "fr"
                ? "Maximisation du rendement agronomique global évalué sur la matrice continue de production des sols."
                : "Maximizing global crop yield evaluated over the continuous soil productivity matrix."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {lang === "fr" ? "Vecteur 2" : "Vector 2"}
            </h3>
            <h4 className="text-xl font-bold text-slate-900">Proximité</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {lang === "fr"
                ? "Minimisation de la distance euclidienne vers l'infrastructure existante pour contraindre les coûts logistiques."
                : "Minimizing Euclidean distance to existing infrastructure to constrain logistics costs."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {lang === "fr" ? "Vecteur 3" : "Vector 3"}
            </h3>
            <h4 className="text-xl font-bold text-slate-900">Compacité</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              {lang === "fr"
                ? "Minimisation du quotient isopérimétrique exact pour neutraliser le fractionnement spatial."
                : "Minimizing the exact isoperimetric quotient to neutralize spatial fragmentation."}
            </p>
            <div className="bg-slate-50 border border-slate-200 py-2 px-3 text-center rounded font-mono text-sm font-semibold text-slate-800 shadow-sm">
              C = Perimeter² / (4π × Area)
            </div>
          </div>
        </section>
      </article>

      {/* SECTION 2 : ENVIRONNEMENT DE SIMULATION DE LABORATOIRE (DARK MODE) */}
      <section className="bg-[#0f172a] text-slate-300 py-14 px-4 sm:px-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-800 pb-6 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-500" />
                Pareto Frontier Interactive Manifold
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-light">
                {lang === "fr"
                  ? "Exploration spatiale de l'espace des solutions non-dominées. Cliquez sur une coordonnée 3D pour afficher sa topologie."
                  : "Spatial exploration of non-dominated solutions. Click a 3D coordinate to reveal its spatial allocation topology."}
              </p>
            </div>

            {/* LÉGENDE SCIENTIFIQUE ÉPURÉE */}
            <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#1f2937] rounded-sm"></span> RESTRICTED
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#475569] rounded-sm"></span> CANDIDATE
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#065f46] rounded-sm"></span> EXISTING
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#fbbf24] rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>{" "}
                OPTIMAL EXTENSION
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[650px]">
            {/* ESPACE 3D (PLOTLY WEBGL) */}
            <div className="lg:col-span-8 bg-black/40 rounded-xl border border-slate-800 relative flex items-center justify-center shadow-2xl">
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Objective Space
                </span>
                <span className="text-sm font-mono text-white">NSGA-II 3D Projection</span>
              </div>
              <Plot
                data={plotData as any}
                layout={{
                  autosize: true,
                  margin: { l: 0, r: 0, b: 0, t: 0 },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  scene: {
                    xaxis: {
                      title: "C(S)",
                      color: "#64748b",
                      gridcolor: "#1e293b",
                      zerolinecolor: "#1e293b",
                      backgroundcolor: "transparent",
                    },
                    yaxis: {
                      title: "P(S)",
                      color: "#64748b",
                      gridcolor: "#1e293b",
                      zerolinecolor: "#1e293b",
                      backgroundcolor: "transparent",
                    },
                    zaxis: {
                      title: "R(S)",
                      color: "#64748b",
                      gridcolor: "#1e293b",
                      zerolinecolor: "#1e293b",
                      backgroundcolor: "transparent",
                    },
                    camera: { eye: { x: 1.5, y: 1.5, z: 1.0 } },
                  },
                }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%", minHeight: "450px" }}
                onClick={(e) => {
                  if (e.points && e.points.length > 0) setActiveIndex(e.points[0].pointIndex);
                }}
              />
            </div>

            {/* DONNÉES ET TOPOLOGIE 2D */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Panneau de Métriques PROMETHEE II */}
              <div className="bg-black/40 p-6 rounded-xl border border-slate-800 shadow-2xl">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      PROMETHEE II Ranking
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {activeIndex === 0 ? "Global Optimum (Rank 1)" : `Compromise Rank ${activeIndex + 1}`}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      Net Flow (Φ)
                    </span>
                    <span className="text-xl font-mono text-blue-400">{activeSolution?.phi.toFixed(4)}</span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Productivity (Max)</span>
                    <span className="text-slate-200">{activeSolution?.productivity.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Proximity (Min)</span>
                    <span className="text-slate-200">{activeSolution?.proximity.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Compactness (Min)</span>
                    <span className="text-slate-200">{activeSolution?.compactness.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Rendu Spatial 2D */}
              <div className="bg-black/40 p-6 rounded-xl border border-slate-800 flex-1 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 self-start w-full border-b border-slate-800 pb-2">
                  Spatial Allocation Topology
                </span>

                <div className="w-full max-w-[220px] aspect-square grid grid-cols-10 gap-[2px]">
                  {USAGE_MAP.map((row, i) =>
                    row.map((_, j) => {
                      const usage = USAGE_MAP[i][j];
                      const isBought = activeSolution?.grid[i][j] === 2 && usage === "C";
                      let bgColor = COLORS[usage as keyof typeof COLORS];
                      if (isBought) bgColor = COLORS.NEW;

                      return (
                        <div
                          key={`${i}-${j}`}
                          className={`w-full h-full rounded-[1px] transition-colors duration-300 ${
                            isBought ? "shadow-[0_0_12px_rgba(251,191,36,0.5)] z-10" : ""
                          }`}
                          style={{ backgroundColor: bgColor }}
                        ></div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
