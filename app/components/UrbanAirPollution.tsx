"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌍 Project: Urban Air Pollution ML
// 👨💻 Author: NDINGA OBA Olivier Vertu
// ==============================================================================

export default function UrbanAirPollution() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  
  const [showTheory, setShowTheory] = useState(false);
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
        
        {/* HEADER */}
        <header className="max-w-3xl mx-auto pt-16 pb-12 px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
            {isEn ? "Urban Air Pollution ML" : "Pollution de l'Air Urbain (ML)"} <br/>
            <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl">
              {isEn ? "Spatio-Temporal Pipeline & Ensembling" : "Pipeline Spatio-Temporel & Ensembling"}
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
              <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)]">Time-Series</span>
              <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)]">LightGBM</span>
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">R / Python</span>
            </div>
          </div>

          <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-12 text-left md:text-justify md:hyphens-auto">
            <p>
              <strong>{isEn ? "Project Goal:" : "Le but du projet :"}</strong> {isEn 
                ? "Air pollution causes over 4 million premature deaths annually. This project tackles the sparse data problem in African cities by predicting hazardous PM2.5 concentrations. By fusing ground sensors, weather APIs, and satellite imagery, we developed a robust spatio-temporal machine learning architecture to forecast air quality."
                : "La pollution de l'air cause plus de 4 millions de décès prématurés par an. Ce projet s'attaque au problème de la rareté des données dans les villes africaines en prédisant les concentrations de PM2.5. En fusionnant des capteurs au sol, la météo et l'imagerie satellite, nous avons conçu une architecture de Machine Learning spatio-temporelle robuste."
              }
            </p>
          </section>
        </header>

        {/* BODY */}
        <main className="max-w-3xl mx-auto px-6 pb-24 text-lg leading-relaxed text-slate-800 dark:text-[var(--text)]">
          
          <div className="flex justify-end mb-8">
            <button 
              onClick={() => setShowTheory(!showTheory)}
              className="text-sm bg-slate-100 dark:bg-[var(--bg-elevated)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded font-sans transition-colors border border-slate-200 dark:border-[var(--border)] shadow-sm"
            >
              {showTheory 
                ? (isEn ? "Hide mathematical formulas" : "Cacher les formules mathématiques") 
                : (isEn ? "Show mathematical formulas" : "Afficher les formules mathématiques")}
            </button>
          </div>

          {/* 1. DATA EXPLORATION & AUTOCORRELATION */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              {isEn ? "1. Temporal Dependencies & Autocorrelation" : "1. Dépendances Temporelles & Autocorrélation"}
            </h2>
            <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
              <p>
                {isEn 
                  ? "Real-world sensor data is notoriously noisy. To decide whether to use standard regression or time-series forecasting, we analyzed the autocorrelation of our features. We discovered that 50% of the features exhibit strong temporal dependencies (e.g., cyclic variables like " : "Les données réelles des capteurs sont notoirement bruitées. Pour décider s'il fallait utiliser une régression standard ou une prévision de séries temporelles, nous avons analysé l'autocorrélation. Nous avons découvert que 50% des variables présentaient de fortes dépendances (variables cycliques comme "}<code className="bg-slate-100 dark:bg-white/10 px-1 rounded text-sm font-mono">day_cos</code>, <code className="bg-slate-100 dark:bg-white/10 px-1 rounded text-sm font-mono">week_sin</code>{isEn ? ")." : ")."}
              </p>

              {showTheory && (
                <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                    {isEn ? "Autocorrelation Function" : "Fonction d'Autocorrélation"}
                  </h4>
                  <BlockMath math="R(\tau) = \frac{\mathbb{E}[(X_t - \mu)(X_{t+\tau} - \mu)]}{\sigma^2}" />
                  <p className="text-sm mt-4 text-slate-600 dark:text-slate-400">
                    {isEn 
                      ? "By measuring how a variable correlates with a delayed copy of itself (lag \(\tau\)), we confirmed the necessity of introducing rolling means and lag features into our dataset."
                      : "En mesurant comment une variable est corrélée à une copie retardée d'elle-même (décalage \(\tau\)), nous avons confirmé la nécessité d'introduire des moyennes mobiles (rolling means) et des décalages (lags) dans nos données."}
                  </p>
                </div>
              )}
            </div>
            
            <figure className="mt-8 flex flex-col items-center">
              <div 
                className="w-full bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded-lg p-2 cursor-zoom-in hover:border-blue-300 transition-colors"
                onClick={() => setFullscreenImg('/assets/urban-air/fig1.png')}
              >
                <img src="/assets/urban-air/fig1.png" alt="Data Exploration 1" className="w-full h-auto rounded" />
              </div>
              <figcaption className="text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] mt-4 text-center px-4 max-w-xl">
                {isEn ? "Fig 1: Initial data exploration highlighting missing data blocks." : "Fig 1 : Exploration initiale mettant en évidence les blocs de données manquantes."}
              </figcaption>
            </figure>
          </section>

          {/* 2. MODEL SELECTION & RIDGE */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              {isEn ? "2. Model Architecture & Selection" : "2. Sélection & Architecture des Modèles"}
            </h2>
            <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
              <p>
                {isEn 
                  ? "We benchmarked multiple architectures, starting from robust linear models to deep recurrent networks:"
                  : "Nous avons comparé plusieurs architectures, allant des modèles linéaires robustes aux réseaux récurrents profonds :"}
              </p>

              <ul className="list-disc pl-5 space-y-4 font-sans text-base">
                <li>
                  <strong>{isEn ? "Ridge Regression:" : "Régression Ridge :"}</strong> {isEn 
                  ? "Used to counter multicollinearity in meteorological data by imposing a penalty on coefficient size." 
                  : "Utilisée pour contrer la multicolinéarité des données météorologiques en imposant une pénalité sur la taille des coefficients."}
                </li>
                <li>
                  <strong>{isEn ? "LSTM Networks:" : "Réseaux LSTM :"}</strong> {isEn 
                  ? "Despite being state-of-the-art for time series, LSTM struggled heavily with our dataset's extensive missingness and discontinuous temporal gaps, leading to severe overfitting."
                  : "Bien qu'étant l'état de l'art pour les séries temporelles, le LSTM a lourdement échoué face à l'extrême rareté de nos données et aux sauts temporels, entraînant un sur-apprentissage massif."}
                </li>
                <li>
                  <strong>{isEn ? "Random Forest / Keras NN:" : "Random Forest / Keras NN :"}</strong> {isEn 
                  ? "These proved much more resilient. The neural network architecture dynamically tuned its dense layers to capture non-linear relationships."
                  : "Ces modèles se sont révélés bien plus résilients. L'architecture de réseau de neurones a ajusté dynamiquement ses couches denses pour capturer les relations non linéaires."}
                </li>
              </ul>

              {showTheory && (
                <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                    {isEn ? "Ridge Objective Function" : "Fonction de perte Ridge"}
                  </h4>
                  <BlockMath math="\min_{\beta} \left( \sum_{i=1}^n (y_i - x_i^T \beta)^2 + \lambda \sum_{j=1}^p \beta_j^2 \right)" />
                  <p className="text-sm mt-4 text-slate-600 dark:text-slate-400">
                    {isEn 
                      ? "By introducing the bias term " : "En introduisant le terme de biais "}
                    <InlineMath math="\lambda" />
                    {isEn 
                      ? ", we artificially reduce the variance of our estimators, preventing overlapping sensor measurements from inflating the weights."
                      : ", nous réduisons artificiellement la variance de nos estimateurs, évitant que les capteurs redondants ne fassent exploser les poids."}
                  </p>
                </div>
              )}
            </div>

            <figure className="mt-8 flex flex-col items-center">
              <div 
                className="w-full bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded-lg p-2 cursor-zoom-in hover:border-blue-300 transition-colors"
                onClick={() => setFullscreenImg('/assets/urban-air/fig2.png')}
              >
                <img src="/assets/urban-air/fig2.png" alt="Data Exploration 2" className="w-full h-auto rounded" />
              </div>
              <figcaption className="text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] mt-4 text-center px-4 max-w-xl">
                {isEn ? "Fig 2: Covariate relationship and target variable distribution." : "Fig 2 : Relation des covariables et distribution de la variable cible."}
              </figcaption>
            </figure>
          </section>

          {/* 3. LIGHTGBM & ENSEMBLING */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              {isEn ? "3. The Winning Strategy: LightGBM Ensembling" : "3. La Stratégie Gagnante : LightGBM & Ensemble"}
            </h2>
            <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
              <p>
                {isEn 
                  ? "For the final predictive thrust, we selected LightGBM due to its efficiency, scalability, and native ability to handle missing values and complex non-linear structures without massive imputation overhead."
                  : "Pour la phase prédictive finale, nous avons sélectionné LightGBM pour son efficacité, sa scalabilité, et sa capacité native à traiter les valeurs manquantes sans imposer une lourde charge d'imputation."}
              </p>
              <p>
                {isEn 
                  ? "We engineered 23-day lead, lag, and rolling temporal features. To ensure extreme robustness, the final predictions were aggregated (ensembled) across 3 distinct LightGBM configurations."
                  : "Nous avons généré des caractéristiques temporelles (lead, lag, rolling) sur 23 jours. Pour garantir une robustesse extrême, les prédictions finales ont été agrégées (stratégie d'Ensemble) à partir de 3 configurations distinctes de LightGBM."}
              </p>

              {showTheory && (
                <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                    {isEn ? "Root Mean Square Error (RMSE)" : "Erreur Quadratique Moyenne (RMSE)"}
                  </h4>
                  <BlockMath math="RMSE = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}" />
                  <p className="text-sm mt-4 text-slate-600 dark:text-slate-400">
                    {isEn 
                      ? "The model's final evaluation was strictly based on RMSE, severely penalizing large deviation errors on dangerous PM2.5 pollution spikes."
                      : "L'évaluation finale du modèle était strictement basée sur le RMSE, pénalisant sévèrement les grandes erreurs de déviation lors des dangereux pics de pollution aux PM2.5."}
                  </p>
                </div>
              )}
            </div>

            <figure className="mt-8 flex flex-col items-center">
              <div 
                className="w-full bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] rounded-lg p-2 cursor-zoom-in hover:border-blue-300 transition-colors"
                onClick={() => setFullscreenImg('/assets/urban-air/fig3.png')}
              >
                <img src="/assets/urban-air/fig3.png" alt="Results" className="w-full h-auto rounded" />
              </div>
              <figcaption className="text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] mt-4 text-center px-4 max-w-xl">
                {isEn ? "Fig 3: Feature importance ranking using Mutual Information, highlighting rolling means." : "Fig 3 : Classement de l'importance des variables par Information Mutuelle."}
              </figcaption>
            </figure>
          </section>

          {/* CONCLUSION */}
          <section>
            <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
              {isEn ? "4. Conclusion" : "4. Conclusion"}
            </h2>
            <div className="text-left md:text-justify md:hyphens-auto">
              <p>
                {isEn 
                  ? "This rigorous feature engineering and ensemble approach yielded a highly competitive RMSE score of 30.05 on the Zindi challenge platform. It proved that thoughtfully designed, tree-based models can outperform complex recurrent networks when dealing with fractured, real-world environmental datasets."
                  : "Cette ingénierie rigoureuse et l'approche d'Ensemble ont permis d'obtenir un score RMSE très compétitif de 30.05 sur la plateforme de compétition Zindi. Cela prouve que des modèles basés sur les arbres de décision, lorsqu'ils sont bien conçus, peuvent surpasser les réseaux récurrents complexes face à des jeux de données environnementaux fragmentés."
                }
              </p>
            </div>
          </section>
        </main>
      </article>
    </>
  );
}
