"use client";

import React, { useState } from 'react';
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌍 Project: Urban Air Pollution ML
// 👨💻 Author: NDINGA OBA Olivier Vertu
// ==============================================================================

export default function UrbanAirPollution() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [imgZoom, setImgZoom] = useState(1);

  return (
    <>
      {/* GENERIC FULLSCREEN IMAGE MODAL */}
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
            {isEn ? "Urban Air Pollution" : "Pollution de l'Air Urbain"} <br/>
            <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl">
              {isEn ? "Spatio-Temporal Machine Learning" : "Machine Learning Spatio-Temporel"}
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-sans mb-10 text-slate-600 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border)] pb-8">
            <div>
              <strong>{isEn ? "Author" : "Auteur"}</strong><br/>
              NDINGA OBA Olivier Vertu
            </div>
            <div>
              <strong>Framework</strong><br/>
              {isEn ? "Statistical Foundations of ML" : "Fondations Statistiques du ML"}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)]">Regression</span>
              <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)]">Data Imputation</span>
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">R (Notebook)</span>
            </div>
          </div>

          {/* ABSTRACT */}
          <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-12 text-left md:text-justify md:hyphens-auto">
            <p>
              <strong>{isEn ? "Problem Statement:" : "Énoncé du problème :"}</strong> {isEn 
                ? "Air pollution is a major cause of disease and death worldwide. This project focuses on predicting the concentration of hazardous PM2.5 particles across various African cities. By leveraging ground-based air quality sensors, weather conditions, and satellite imagery data, we developed a robust spatio-temporal machine learning pipeline capable of inferring missing values and forecasting pollution levels."
                : "La pollution de l'air est une cause majeure de maladies et de décès dans le monde. Ce projet se concentre sur la prédiction de la concentration des dangereuses particules PM2.5 dans plusieurs villes africaines. En exploitant des capteurs de qualité de l'air au sol, des données météorologiques et des images satellites, nous avons développé un pipeline de machine learning spatio-temporel capable de déduire les valeurs manquantes et de prévoir les niveaux de pollution."
              }
            </p>
          </section>
        </header>

        {/* CORPS DE L'ARTICLE */}
        <main className="max-w-3xl mx-auto px-6 pb-24 text-lg leading-relaxed text-slate-800 dark:text-[var(--text)]">
          
          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              <h2 className="text-2xl font-bold font-sans">
                {isEn ? "1. Methodology" : "1. Méthodologie"}
              </h2>
            </div>
            <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
              <p>
                {isEn 
                  ? "The core challenge of this project lay in the sparsity of the data. Real-world sensor data is notoriously noisy and incomplete. We had to implement advanced imputation techniques to handle missing values intelligently before any predictive modeling could begin."
                  : "Le principal défi de ce projet résidait dans la rareté des données. Les données de capteurs en monde réel sont notoirement bruitées et incomplètes. Nous avons dû mettre en œuvre des techniques avancées d'imputation pour traiter intelligemment les valeurs manquantes avant même de commencer la modélisation."
                }
              </p>
              <p>
                {isEn 
                  ? "Our pipeline consists of:"
                  : "Notre pipeline se compose de :"
                }
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2 font-sans text-base">
                <li><strong>{isEn ? "Data Cleaning & Imputation:" : "Nettoyage & Imputation :"}</strong> {isEn ? "Reconstructing continuous time-series from scattered sensor readings." : "Reconstruction des séries temporelles continues à partir de relevés éparpillés."}</li>
                <li><strong>{isEn ? "Spatio-Temporal Alignment:" : "Alignement Spatio-Temporel :"}</strong> {isEn ? "Fusing localized ground data with wide-area satellite meteorological data." : "Fusion des données au sol localisées avec les vastes données météorologiques satellites."}</li>
                <li><strong>{isEn ? "Statistical Learning:" : "Apprentissage Statistique :"}</strong> {isEn ? "Training non-linear regression models (e.g., Random Forests, Gradient Boosting) tailored for R environments." : "Entraînement de modèles de régression non linéaires adaptés aux environnements R."}</li>
              </ul>
            </div>
          </section>

          {/* VISUAL RESULTS */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              <h2 className="text-2xl font-bold font-sans">
                {isEn ? "2. Visual Insights" : "2. Aperçus Visuels"}
              </h2>
            </div>
            
            <div className="space-y-12">
              {/* Figure 1 */}
              <figure className="flex flex-col items-center">
                <div 
                  className="w-full bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded-lg p-2 cursor-zoom-in hover:border-blue-300 transition-colors"
                  onClick={() => setFullscreenImg('/assets/urban-air/fig1.png')}
                >
                  <img src="/assets/urban-air/fig1.png" alt="Data Exploration 1" className="w-full h-auto rounded" />
                </div>
                <figcaption className="text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] mt-4 text-center px-4 max-w-xl">
                  {isEn ? "Fig 1: Initial data exploration and statistical distributions." : "Fig 1 : Exploration initiale des données et distributions statistiques."}
                </figcaption>
              </figure>

              {/* Figure 2 */}
              <figure className="flex flex-col items-center">
                <div 
                  className="w-full bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded-lg p-2 cursor-zoom-in hover:border-blue-300 transition-colors"
                  onClick={() => setFullscreenImg('/assets/urban-air/fig2.png')}
                >
                  <img src="/assets/urban-air/fig2.png" alt="Data Exploration 2" className="w-full h-auto rounded" />
                </div>
                <figcaption className="text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] mt-4 text-center px-4 max-w-xl">
                  {isEn ? "Fig 2: Geospatial or temporal analysis of the target variable." : "Fig 2 : Analyse géospatiale ou temporelle de la variable cible."}
                </figcaption>
              </figure>

              {/* Figure 3 */}
              <figure className="flex flex-col items-center">
                <div 
                  className="w-full bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded-lg p-2 cursor-zoom-in hover:border-blue-300 transition-colors"
                  onClick={() => setFullscreenImg('/assets/urban-air/fig3.png')}
                >
                  <img src="/assets/urban-air/fig3.png" alt="Results" className="w-full h-auto rounded" />
                </div>
                <figcaption className="text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] mt-4 text-center px-4 max-w-xl">
                  {isEn ? "Fig 3: Final model evaluation and predictive performance." : "Fig 3 : Évaluation finale du modèle et performance prédictive."}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* CONCLUSION */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              <h2 className="text-2xl font-bold font-sans">
                {isEn ? "3. Conclusion" : "3. Conclusion"}
              </h2>
            </div>
            <div className="text-left md:text-justify md:hyphens-auto">
              <p>
                {isEn 
                  ? "By systematically imputing missing values and leveraging a rich set of meteorological covariates, we demonstrated that accurate PM2.5 forecasting is achievable even in resource-constrained environments. This pipeline highlights the power of R for heavy statistical modeling and large-scale spatio-temporal data analysis."
                  : "En imputant systématiquement les valeurs manquantes et en exploitant un riche ensemble de covariables météorologiques, nous avons démontré qu'une prévision précise des PM2.5 est réalisable même dans des environnements à ressources limitées. Ce pipeline souligne la puissance de R pour la modélisation statistique lourde et l'analyse de données spatio-temporelles à grande échelle."
                }
              </p>
            </div>
          </section>
        </main>
      </article>
    </>
  );
}
