"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌾 Project: Genetic Agricultural Optimization (NSGA-II + PROMETHEE II)
// 👨💻 Author: Olivier Vertu Ndingaoba
// ==============================================================================

export default function GeneticOptimizer() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  
  // States
  const [frameIndex, setFrameIndex] = useState(0);
  const [showTheory, setShowTheory] = useState(false);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [imgZoom, setImgZoom] = useState(1);
  const [tourFullscreen, setTourFullscreen] = useState(false);
  
  const totalFrames = 31; // Extracted from pareto_solutions_tour.gif

  return (
    <>
      {/* GENERIC FULLSCREEN IMAGE MODAL (for static GIFs and Maps) */}
      {fullscreenImg && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 overflow-auto p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setFullscreenImg(null);
              setImgZoom(1);
            }
          }}
        >
          <div 
            className="relative cursor-auto transition-all duration-300"
            style={{ 
              width: `${100 * imgZoom}%`, 
              maxWidth: imgZoom === 1 ? '100%' : '300%',
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            <img 
              src={fullscreenImg} 
              alt="Fullscreen View" 
              className={`max-w-full ${imgZoom === 1 ? 'max-h-[90vh]' : 'h-auto'} object-contain rounded shadow-2xl`}
            />
          </div>
          
          {/* Controls */}
          <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4 bg-black/80 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-sans backdrop-blur-sm border border-white/10 shadow-xl z-10 w-[90%] sm:w-auto justify-center max-w-sm">
            <button onClick={() => setImgZoom(z => Math.max(1, z - 0.5))} className="hover:text-blue-400 font-bold text-2xl px-2 leading-none">−</button>
            <span className="font-mono text-sm w-12 text-center">{Math.round(imgZoom * 100)}%</span>
            <button onClick={() => setImgZoom(z => Math.min(4, z + 0.5))} className="hover:text-blue-400 font-bold text-2xl px-2 leading-none">+</button>
            <div className="w-px h-5 bg-white dark:bg-[var(--bg-elevated)]/20 mx-1 sm:mx-2"></div>
            <button 
              onClick={() => { setFullscreenImg(null); setImgZoom(1); }}
              className="hover:text-red-400 text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              {isEn ? "Close ✕" : "Fermer ✕"}
            </button>
          </div>
        </div>
      )}

      <article lang={isEn ? "en" : "fr"} className="bg-[#fafafa] dark:bg-[var(--bg)] text-[#222222] dark:text-[var(--text)] font-serif selection:bg-blue-200 rounded-lg overflow-hidden border border-slate-200 dark:border-[var(--border)] shadow-xl relative">
        
        {/* HEADER / TITRE */}
        <header className="max-w-3xl mx-auto pt-16 pb-12 px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
            {isEn ? "Evolutionary Spatial Allocation" : "Allocation Spatiale Évolutive"} <br/>
            <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl">(NSGA-II & PROMETHEE II)</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-sans mb-10 text-slate-600 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border)] pb-8">
            <div>
              <strong>{isEn ? "Author" : "Auteur"}</strong><br/>
              NDINGA OBA Olivier Vertu
            </div>
            <div>
              <strong>Framework</strong><br/>
              {isEn ? "Multi-Objective Evolutionary Optimization" : "Optimisation Évolutive Multi-Objectifs"}
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">NSGA-II</span>
              <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">PROMETHEE II</span>
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 whitespace-nowrap">Python 3.8+</span>
            </div>
          </div>

          {/* ABSTRACT */}
          <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-12 text-left md:text-justify md:hyphens-auto">
            <p>
              <strong>{isEn ? "Project Goal:" : "Le but du projet :"}</strong> {isEn 
                ? "Automating spatial decision-making for agricultural land expansion. We aim to find the optimal land parcels to purchase in order to maximize crop yields, maintain proximity to existing farms, and group fields efficiently, all while strictly adhering to a predefined budget constraint."
                : "Automatiser la prise de décision pour l'extension de terres agricoles. Nous voulons trouver les meilleures parcelles de terrain à acheter pour maximiser les rendements, rester proche de nos fermes actuelles, et regrouper les champs intelligemment, le tout sans dépasser un budget strict."
              }
            </p>
          </section>
        </header>

        {/* CORPS DE L'ARTICLE */}
        <main className="max-w-3xl mx-auto px-6 pb-24 text-lg leading-relaxed sm:text-justify text-slate-800 dark:text-[var(--text)]">
          
          {/* PROBLEM FORMULATION */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              <h2 className="text-2xl font-bold font-sans">
                {isEn ? "1. Problem Formulation" : "1. Formulation du Problème"}
              </h2>
              <button 
                onClick={() => setShowTheory(!showTheory)}
                className="text-sm bg-slate-100 dark:bg-[var(--bg-elevated)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded font-sans transition-colors border border-slate-200 dark:border-[var(--border)] mt-4 md:mt-0 shadow-sm"
              >
                {showTheory 
                  ? (isEn ? "Hide mathematical formulas" : "Cacher les formules mathématiques") 
                  : (isEn ? "Show mathematical formulas" : "Voir les formules mathématiques")
                }
              </button>
            </div>
            
            <p className="mb-8 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
              {isEn 
                ? "Before seeking a solution, we must understand the baseline. The territory is divided into parcels. Some already belong to the farmer (Existing Farms), others are candidates for purchase, and each has a specific cost and yield potential." 
                : "Avant de chercher une solution, il faut comprendre notre point de départ. Le territoire est divisé en parcelles. Certaines appartiennent déjà à l'agriculteur (Fermes existantes), d'autres sont candidates à l'achat, et chacune possède un coût et un potentiel de rendement différent."
              }
            </p>

            {/* INITIAL PROBLEM MAPS */}
            <figure className="mb-12 -mx-6 md:-mx-8">
              <div 
                className="bg-white dark:bg-[var(--bg-elevated)] p-3 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm cursor-zoom-in hover:shadow-md transition-shadow"
                onClick={() => setFullscreenImg(`/assets/${isEn ? 'en' : 'fr'}/input_maps.png`)}
              >
                <img 
                  src={`/assets/${isEn ? 'en' : 'fr'}/input_maps.png`} 
                  alt={isEn ? "Initial Spatial Maps" : "Cartes Spatiales Initiales"} 
                  className="w-full h-auto rounded"
                />
              </div>
              <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] text-center px-4">
                <strong>{isEn ? "Figure 1. Input Data." : "Figure 1. Les données d'entrée."}</strong> {isEn ? "The initial topology showing the productivity map (left), cost map (middle), and current land use (right)." : "La topologie initiale du terrain, montrant la carte de productivité (gauche), la carte des coûts (milieu) et l'usage actuel des sols (droite)."} <em>{isEn ? "(Click image to enlarge)" : "(Cliquez sur l'image pour agrandir)"}</em>
              </figcaption>
            </figure>

            <p className="mb-6 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
              {isEn 
                ? "When purchasing new land, the AI algorithm balances 4 often contradictory objectives:" 
                : "Lors de l'achat de nouvelles parcelles, l'algorithme d'Intelligence Artificielle arbitre la situation entre 4 objectifs souvent contradictoires :"
              }
            </p>

            <ul className="space-y-4 mb-8">
              <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <strong className="font-sans text-slate-900 dark:text-[var(--text)]">1. {isEn ? "Productivity (Maximize)" : "Productivité (Maximiser)"}</strong>
                <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">{isEn ? "Prioritize land that offers the highest crop yield." : "Acheter en priorité les terres qui offrent le meilleur rendement de culture."}</p>
                {showTheory && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center">
                    <em>{isEn ? "Mathematical Formulation:" : "Formulation Mathématique :"}</em> 
                    <div className="my-3 flex justify-center"><BlockMath math={String.raw`R_S = \sum_{c \in S} \text{Production}(c)`} /></div>
                  </div>
                )}
              </li>
              <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <strong className="font-sans text-slate-900 dark:text-[var(--text)]">2. {isEn ? "Proximity (Minimize)" : "Proximité (Minimiser)"}</strong>
                <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">{isEn ? "Keep new land as close as possible to existing infrastructure to reduce transport costs." : "Garder les nouvelles terres le plus près possible des infrastructures existantes pour réduire les coûts de transport."}</p>
                {showTheory && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center">
                    <em>{isEn ? "Mathematical Formulation:" : "Formulation Mathématique :"}</em> 
                    <div className="my-3 flex justify-center"><BlockMath math={String.raw`P_S = \frac{1}{|S|} \sum_{c \in S} \min_{a \in A} \text{dist}(c, a)`} /></div>
                  </div>
                )}
              </li>
              <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <strong className="font-sans text-slate-900 dark:text-[var(--text)]">3. {isEn ? "Compactness (Minimize Scatter)" : "Compacité (Minimiser l'éparpillement)"}</strong>
                <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">{isEn ? "Favor large, contiguous blocks of land rather than small, scattered 'confetti' patches." : "Favoriser des gros blocs de terres collés les uns aux autres, plutôt que des petits bouts de champs éparpillés partout en 'confetti'."}</p>
                {showTheory && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center">
                    <em>{isEn ? "Mathematical Formulation:" : "Formulation Mathématique :"}</em> 
                    <div className="my-3 flex justify-center"><BlockMath math={String.raw`C_S=\frac{\text{Perimeter}^2}{4\pi\cdot\text{Area}}`} /></div>
                  </div>
                )}
              </li>
              <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <strong className="font-sans text-slate-900 dark:text-[var(--text)]">4. {isEn ? "Budget (Strict Constraint)" : "Le Budget (Contrainte Stricte)"}</strong>
                <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">{isEn ? "The total price of the purchased land must never exceed the farmer's wallet." : "Le prix total des terres achetées ne doit jamais dépasser le portefeuille de l'agriculteur."}</p>
                {showTheory && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center">
                    <em>{isEn ? "Mathematical Formulation:" : "Formulation Mathématique :"}</em> 
                    <div className="my-3 flex justify-center"><BlockMath math={String.raw`\sum_{c \in S} \text{Cost}(c) \le B`} /></div>
                  </div>
                )}
              </li>
            </ul>
          </section>

          {/* GENETIC ALGORITHM EXPLANATION */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              {isEn ? "How the Genetic Algorithm Works" : "Comment fonctionne l'Algorithme Génétique ?"}
            </h2>
            <p className="mb-8 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
              {isEn 
                ? "To solve this complex equation, we use an AI inspired by Darwin's theory of evolution. Instead of testing all billions of possibilities, the algorithm \"evolves\" solutions over generations."
                : "Pour résoudre cette équation complexe, nous utilisons une IA inspirée par la théorie de l'évolution de Darwin. Au lieu de tester les milliards de possibilités une par une, l'algorithme fait \"évoluer\" les solutions sur plusieurs générations."
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
              
              {/* Step 1 */}
              <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">1</div>
                <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">{isEn ? "Initialization" : "Initialisation"}</strong>
                <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">{isEn ? "Generate random purchase plans." : "Créer des plans d'achat aléatoires."}</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">2</div>
                <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">{isEn ? "Evaluation" : "Évaluation"}</strong>
                <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">{isEn ? "Calculate the 4 objectives for each plan." : "Calculer les 4 objectifs pour chaque plan."}</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">3</div>
                <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">{isEn ? "Selection" : "Sélection"}</strong>
                <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">{isEn ? "Keep the most promising solutions." : "Garder les compromis les plus prometteurs."}</p>
              </div>

              {/* Step 4 */}
              <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">4</div>
                <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">{isEn ? "Crossover" : "Croisement"}</strong>
                <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">{isEn ? "Mix good plans to create better offspring." : "Mélanger les bons plans pour créer des enfants."}</p>
              </div>

              {/* Step 5 */}
              <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">5</div>
                <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">{isEn ? "Mutation" : "Mutation"}</strong>
                <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">{isEn ? "Random tweaks to explore new ideas." : "Petits changements aléatoires (innovations)."}</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-600 dark:text-[var(--text-muted)] rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                {isEn ? "Loops for 100 generations" : "Boucle répétée sur 100 générations"}
              </span>
            </div>
          </section>

          {/* ARCHITECTURE */}
          {showTheory && (
            <section className="mb-16 bg-blue-50 dark:bg-blue-900/30/50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-xl font-bold font-sans mb-4 text-blue-900">
                {isEn ? "Algorithmic Architecture (Advanced)" : "Architecture Algorithmique (Avancé)"}
              </h2>
              <p className="mb-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
                {isEn 
                  ? "Unlike classical approaches that arbitrarily sum scores, this architecture implements pure Multi-Objective Pareto Dominance."
                  : "Contrairement aux approches classiques qui additionnent arbitrairement les scores, cette architecture implémente une Dominance de Pareto multi-objectifs pure."
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded border border-slate-200 dark:border-[var(--border)] shadow-sm overflow-x-auto">
                  <strong className="text-slate-900 dark:text-[var(--text)] text-sm">{isEn ? "NSGA-II Engine" : "Moteur NSGA-II"}</strong>
                  <p className="hidden sm:block mt-1 text-xs sm:text-sm text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
                    {isEn 
                      ? "Uses Fast Non-Dominated Sorting to partition populations into Pareto fronts"
                      : "Utilise le tri non-dominé rapide (Fast Non-Dominated Sorting) pour diviser la population en fronts de Pareto"
                    } (<InlineMath math={String.raw`F_1, F_2, \dots`} />).
                  </p>
                </div>
                <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded border border-slate-200 dark:border-[var(--border)] shadow-sm overflow-x-auto">
                  <strong className="text-slate-900 dark:text-[var(--text)] text-sm">{isEn ? "PROMETHEE II Ranking" : "Classement PROMETHEE II"}</strong>
                  <p className="hidden sm:block mt-1 text-xs sm:text-sm text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
                    {isEn 
                      ? "Evaluates non-dominated solutions on the final front to provide a decision-maker ranking based on preference flows"
                      : "Évalue les solutions non-dominées du front final pour classer les compromis selon les flux de préférence"
                    } (<InlineMath math={String.raw`\Phi^+, \Phi^-`} />).
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* INTERACTIVE VISUALIZATIONS */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              {isEn ? "2. Interactive Solution Exploration" : "2. Exploration Interactive des Solutions"}
            </h2>
            <p className="mb-10 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
              {isEn 
                ? "The AI algorithm generates dozens of valid compromises (the \"Pareto Front\"). You can explore the 31 best solutions found below. The slider allows you to navigate from the most balanced solution (Solution 1) to more extreme solutions."
                : "L'algorithme IA génère des dizaines de compromis valides (le \"Front de Pareto\"). Vous pouvez explorer ci-dessous les 31 meilleures solutions trouvées. Le curseur vous permet de naviguer de la solution la plus équilibrée (Solution 1) aux solutions plus extrêmes."
              }
              <br/><br/>
              <em>{isEn ? "Tip: Click on any image or graph to view it in full screen and read the axes in detail!" : "Astuce : Cliquez sur n'importe quelle image ou graphique pour l'afficher en plein écran et zoomer dedans !"}</em>
            </p>

            <figure className="mb-16 -mx-6 md:-mx-12 lg:-mx-24 font-sans">
              
              {/* INTERACTIVE VIEWER (Modal-aware) */}
              <div className={`transition-all duration-300 ${tourFullscreen ? 'fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-12 overflow-y-auto' : 'bg-white dark:bg-[var(--bg-elevated)] p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-xl flex flex-col items-center'}`}>
                
                {tourFullscreen && (
                  <button 
                    onClick={() => setTourFullscreen(false)}
                    className="absolute top-6 right-8 text-white font-sans bg-white dark:bg-[var(--bg-elevated)]/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white dark:bg-[var(--bg-elevated)]/20 transition-colors z-[80]"
                  >
                    {isEn ? "Close ✕" : "Fermer ✕"}
                  </button>
                )}

                {/* IMAGE FRAME */}
                <div 
                  className={`w-full relative ${tourFullscreen ? 'bg-black flex-1 min-h-[50vh] max-h-[75vh]' : 'bg-slate-50 dark:bg-[var(--bg-elevated)] min-h-[300px] md:min-h-[500px]'} border ${tourFullscreen ? 'border-white/10' : 'border-slate-200 dark:border-[var(--border)]'} rounded-lg overflow-hidden flex items-center justify-center cursor-zoom-in group`}
                  onClick={() => !tourFullscreen && setTourFullscreen(true)}
                >
                  <img 
                    src={`/assets/${isEn ? 'en' : 'fr'}/tour_frames/frame_${frameIndex.toString().padStart(3, '0')}.png`} 
                    alt={`Pareto Tour Frame ${frameIndex}`} 
                    className={`w-full h-full object-contain transition-transform duration-300 ${!tourFullscreen && 'group-hover:scale-[1.01]'}`}
                  />
                  {!tourFullscreen && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none flex items-center justify-center">
                      <span className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg backdrop-blur-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        {isEn ? "Fullscreen View" : "Vue Plein Écran"}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTROLS */}
                <div className={`w-full max-w-3xl mt-6 flex flex-col items-center gap-4 ${tourFullscreen ? 'bg-black/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md mt-8' : ''}`}>
                  <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                    <button 
                      onClick={() => setFrameIndex(Math.max(0, frameIndex - 1))}
                      disabled={frameIndex === 0}
                      className={`px-3 py-2 sm:px-4 ${tourFullscreen ? 'bg-white dark:bg-[var(--bg-elevated)]/10 text-white hover:bg-white dark:bg-[var(--bg-elevated)]/20' : 'bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[var(--border)]'} disabled:opacity-30 font-bold rounded-lg transition-colors`}
                    >
                      ⬅<span className="hidden sm:inline"> {isEn ? "Prev" : "Préc"}</span>
                    </button>
                    
                    <div className="flex-1 flex flex-col items-center px-1 sm:px-4">
                      <input 
                        type="range" 
                        min="0" 
                        max={totalFrames - 1} 
                        value={frameIndex} 
                        onChange={(e) => setFrameIndex(parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className={`text-[10px] sm:text-xs font-mono mt-3 font-bold tracking-widest uppercase ${tourFullscreen ? 'text-blue-300' : 'text-slate-500 dark:text-[var(--text-muted)]'}`}>
                        <span className="hidden sm:inline">{isEn ? "Solution" : "Solution"}</span> {frameIndex + 1} / {totalFrames}
                      </span>
                    </div>

                    <button 
                      onClick={() => setFrameIndex(Math.min(totalFrames - 1, frameIndex + 1))}
                      disabled={frameIndex === totalFrames - 1}
                      className={`px-3 py-2 sm:px-4 ${tourFullscreen ? 'bg-blue-600 text-white hover:bg-blue-50 dark:bg-blue-900/300' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-30 font-bold rounded-lg transition-colors shadow-sm`}
                    >
                      <span className="hidden sm:inline">{isEn ? "Next" : "Suiv"} </span>➡
                    </button>
                  </div>
                </div>
              </div>
              
              {!tourFullscreen && (
                <figcaption className="mt-6 text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] text-center max-w-2xl mx-auto px-4">
                  <strong>{isEn ? "Figure 2. Interactive Pareto Tour." : "Figure 2. Tour Interactif des Solutions Pareto."}</strong> {isEn ? "Exploration of non-dominated solutions ranked by PROMETHEE II. The left panel shows the spatial allocation map (new land in gold). The right panel tracks the exact position on the 3D Pareto front." : "Exploration des solutions non-dominées classées par PROMETHEE II. Le panneau de gauche montre la carte spatiale d'allocation (nouvelles terres en or). Le panneau de droite suit la position exacte sur le front de Pareto 3D."}
                </figcaption>
              )}
            </figure>

            {/* Figure 3 & 4: Evolutions side-by-side (Static Generated Visuals) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 -mx-6 md:-mx-12">
              <figure>
                <div 
                  className="bg-white dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] p-2 shadow-sm rounded-lg cursor-zoom-in hover:shadow-md transition-all group relative"
                  onClick={() => setFullscreenImg(`/assets/${isEn ? 'en' : 'fr'}/spatial_evolution.gif`)}
                >
                  <img src={`/assets/${isEn ? 'en' : 'fr'}/spatial_evolution.gif`} alt="Spatial Configuration Evolution" className="w-full h-auto rounded" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none flex items-center justify-center">
                    <span className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {isEn ? "Zoom In" : "Agrandir"}
                    </span>
                  </div>
                </div>
                <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] px-2 text-left md:text-justify md:hyphens-auto">
                  <strong>{isEn ? "Figure 3. Spatial Evolution." : "Figure 3. Évolution Spatiale."}</strong> {isEn ? "The algorithm converges from a sparse distribution to contiguous agricultural blocks across generations." : "L'algorithme converge d'une distribution éparse vers des blocs agricoles contigus au fil des générations."}
                </figcaption>
              </figure>

              <figure>
                <div 
                  className="bg-white dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] p-2 shadow-sm rounded-lg cursor-zoom-in hover:shadow-md transition-all group relative"
                  onClick={() => setFullscreenImg(`/assets/${isEn ? 'en' : 'fr'}/pareto_convergence.gif`)}
                >
                  <img src={`/assets/${isEn ? 'en' : 'fr'}/pareto_convergence.gif`} alt="Pareto Frontier Convergence" className="w-full h-auto rounded" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none flex items-center justify-center">
                    <span className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {isEn ? "Zoom In" : "Agrandir"}
                    </span>
                  </div>
                </div>
                <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] px-2 text-left md:text-justify md:hyphens-auto">
                  <strong>{isEn ? "Figure 4. Frontier Convergence." : "Figure 4. Convergence du Front."}</strong> {isEn ? "The population converges towards the true Pareto front in the objective space, escaping local minima." : "La population converge vers le véritable front de Pareto dans l'espace des objectifs, s'échappant des minima locaux."}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* CONCLUSION / REPO */}
          <section className="bg-slate-900 text-slate-300 p-8 rounded-xl font-sans shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">{isEn ? "Quality Verification & Open Source" : "Vérification de Qualité & Open Source"}</h3>
            <p className="text-sm mb-4 leading-relaxed text-left md:text-justify md:hyphens-auto line-clamp-4 sm:line-clamp-none">
              {isEn 
                ? "The pipeline executes an automated quality audit (" 
                : "Le pipeline exécute un audit de qualité automatisé ("
              }
              <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">src/verify_solutions.py</code>
              {isEn 
                ? ") after every run to ensure 100% of solutions satisfy budget constraints and strict Pareto dominance rules." 
                : ") après chaque optimisation pour s'assurer qu'absolument 100% des solutions respectent les contraintes budgétaires et les règles de dominance stricte de Pareto."
              }
            </p>
            <a href="https://github.com/Vertu5/genetic_agricultural_optimization/tree/old-version-before-website" target="_blank" rel="noopener noreferrer" className="inline-block bg-white dark:bg-[var(--bg-elevated)] text-slate-900 dark:text-[var(--text)] font-bold px-6 py-2.5 rounded shadow hover:bg-slate-100 dark:bg-[var(--bg-elevated)] transition-colors">
              {isEn ? "View Source Code (Python) on GitHub" : "Voir le code source complet (Python) sur GitHub"}
            </a>
          </section>

        </main>
      </article>
    </>
  );
}
