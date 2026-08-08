"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// 🌍 Project: Urban Air Pollution ML
// 👨💻 Author: NDINGA OBA Olivier Vertu
// ==============================================================================

// --- Responsive Visual Schemas ---

const MissingDataTimeline = ({ isEn }: { isEn: boolean }) => (
  <div className="my-10 bg-slate-50 dark:bg-[#151515] p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-[var(--border)] font-sans relative overflow-hidden shadow-sm">
    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none hidden sm:block">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    </div>
    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
      {isEn ? "The Imputation Strategy (Rolling Windows)" : "Stratégie d'Imputation (Fenêtres Glissantes)"}
    </h3>
    
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Raw Data */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="w-full sm:w-24 text-xs font-semibold text-slate-500 uppercase tracking-wide">{isEn ? "Raw Data" : "Données Brutes"}</div>
        <div className="flex-1 flex gap-1 sm:gap-2">
          <div className="h-8 flex-1 bg-emerald-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono">D1</div>
          <div className="h-8 flex-1 bg-emerald-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono">D2</div>
          <div className="h-8 flex-1 bg-red-400/30 border border-red-400/50 rounded flex items-center justify-center text-[10px] sm:text-xs text-red-500 font-mono pattern-diagonal-lines-sm overflow-hidden">NaN</div>
          <div className="h-8 flex-1 bg-red-400/30 border border-red-400/50 rounded flex items-center justify-center text-[10px] sm:text-xs text-red-500 font-mono pattern-diagonal-lines-sm overflow-hidden">NaN</div>
          <div className="h-8 flex-1 bg-emerald-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono">D5</div>
          <div className="h-8 flex-1 bg-emerald-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono">D6</div>
        </div>
      </div>
      
      {/* Arrow */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="hidden sm:block w-24"></div>
        <div className="flex-1 sm:border-l-2 sm:border-b-2 sm:border-blue-400 sm:rounded-bl-lg sm:h-6 sm:ml-4 flex justify-center sm:justify-start items-center">
          <div className="sm:hidden text-blue-400 mb-1">↓</div>
        </div>
        <div className="text-xs font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full whitespace-nowrap text-center self-center sm:self-auto">
          {isEn ? "23-Day Rolling Mean" : "Moyenne Glissante (23j)"}
        </div>
      </div>

      {/* Cleaned Data */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="w-full sm:w-24 text-xs font-semibold text-slate-500 uppercase tracking-wide">{isEn ? "Imputed" : "Imputées"}</div>
        <div className="flex-1 flex gap-1 sm:gap-2 relative">
          <div className="absolute inset-0 bg-blue-400/10 rounded-lg blur-md"></div>
          <div className="h-8 flex-1 bg-blue-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono z-10">D1</div>
          <div className="h-8 flex-1 bg-blue-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono z-10">D2</div>
          <div className="h-8 flex-1 bg-blue-400 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono z-10">µ</div>
          <div className="h-8 flex-1 bg-blue-400 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono z-10">µ</div>
          <div className="h-8 flex-1 bg-blue-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono z-10">D5</div>
          <div className="h-8 flex-1 bg-blue-500 rounded flex items-center justify-center text-[10px] sm:text-xs text-white font-mono z-10">D6</div>
        </div>
      </div>
    </div>
  </div>
);

const FeatureImportanceChart = ({ isEn }: { isEn: boolean }) => {
  const features = [
    { name: "L3_HCHO_slant_column_mean_2", score: 95 },
    { name: "L3_NO2_sensor_altitude_max_9", score: 82 },
    { name: "L3_CO_column_number_density", score: 76 },
    { name: "day_cos (Cyclic Encoding)", score: 68 },
    { name: "precipitable_water", score: 55 },
  ];
  return (
    <div className="my-10 bg-white dark:bg-[#111] p-4 sm:p-8 rounded-xl border border-slate-200 dark:border-[var(--border)] font-sans shadow-inner">
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
        {isEn ? "Top Predictive Features (Mutual Information)" : "Meilleures Variables (Information Mutuelle)"}
      </h3>
      <div className="space-y-5">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end text-[10px] sm:text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="truncate pr-4" title={f.name}>{f.name}</span>
              <span className="font-bold">{f.score}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${f.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArchitectureFlow = ({ isEn }: { isEn: boolean }) => (
  <div className="my-10 bg-slate-900 text-white p-5 sm:p-8 rounded-xl font-sans shadow-2xl ring-1 ring-white/10">
    <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-8 flex items-center gap-2">
      <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      {isEn ? "System Architecture (Ensemble)" : "Architecture Système (Ensemble)"}
    </h3>
    
    <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
      
      {/* Layer 1: Inputs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
        <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-center text-sm shadow-md flex-1">
          <div className="font-bold text-blue-400 text-sm sm:text-base">Ground Sensors</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">PM2.5 Data (Noisy)</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-center text-sm shadow-md flex-1">
          <div className="font-bold text-indigo-400 text-sm sm:text-base">Satellite Sentinel-5P</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">NO2, HCHO, CO</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-center text-sm shadow-md flex-1">
          <div className="font-bold text-emerald-400 text-sm sm:text-base">Weather API</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">Temp, Wind, Humidity</div>
        </div>
      </div>

      {/* Arrow Down */}
      <div className="text-slate-600">↓</div>

      {/* Layer 2: Feature Eng */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 px-4 sm:px-6 py-4 rounded-xl text-center w-full shadow-lg">
        <div className="font-bold text-base sm:text-lg mb-3">Feature Engineering & Imputation</div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <span className="bg-blue-950 px-2 py-1.5 rounded border border-blue-800">Cyclic Encoding (day_cos)</span>
          <span className="bg-indigo-950 px-2 py-1.5 rounded border border-indigo-800">23-Day Rolling Windows</span>
          <span className="bg-purple-950 px-2 py-1.5 rounded border border-purple-800">Lag & Lead Features</span>
        </div>
      </div>

      {/* Split Arrows (Desktop) & Simple Arrow (Mobile) */}
      <div className="hidden sm:flex w-3/4 justify-between -mb-4 mt-2 px-10">
        <div className="border-l-2 border-b-2 border-slate-600 w-full h-8 rounded-bl-lg"></div>
        <div className="border-l-2 border-slate-600 h-10 -ml-[2px]"></div>
        <div className="border-r-2 border-b-2 border-slate-600 w-full h-8 rounded-br-lg"></div>
      </div>
      <div className="sm:hidden text-slate-600 -my-1">↓</div>

      {/* Layer 3: Ensemble */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
        <div className="bg-slate-800 border border-amber-500/50 px-4 py-3 sm:py-4 rounded-lg text-center shadow-lg sm:w-1/3">
          <div className="font-bold text-amber-400 text-sm sm:text-base">LightGBM</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">Config A</div>
        </div>
        <div className="bg-slate-800 border border-amber-500/50 px-4 py-3 sm:py-4 rounded-lg text-center shadow-lg sm:w-1/3">
          <div className="font-bold text-amber-400 text-sm sm:text-base">LightGBM</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">Config B</div>
        </div>
        <div className="bg-slate-800 border border-amber-500/50 px-4 py-3 sm:py-4 rounded-lg text-center shadow-lg sm:w-1/3">
          <div className="font-bold text-amber-400 text-sm sm:text-base">LightGBM</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">Config C</div>
        </div>
      </div>

      {/* Merge Arrows (Desktop) & Simple Arrow (Mobile) */}
      <div className="hidden sm:flex w-3/4 justify-between mt-0 px-10">
        <div className="border-l-2 border-t-2 border-amber-500/30 w-full h-8 rounded-tl-lg"></div>
        <div className="border-l-2 border-amber-500/30 h-10 -ml-[2px]"></div>
        <div className="border-r-2 border-t-2 border-amber-500/30 w-full h-8 rounded-tr-lg"></div>
      </div>
      <div className="sm:hidden text-slate-600 -my-1">↓</div>

      {/* Layer 4: Output */}
      <div className="bg-green-900/40 border border-green-500/50 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-center shadow-[0_0_15px_rgba(34,197,94,0.2)] w-full sm:w-auto mt-2 sm:mt-0">
        <div className="font-black text-lg sm:text-xl text-green-400 leading-tight">PM2.5 Final Prediction</div>
        <div className="text-[10px] sm:text-xs font-mono text-green-300 mt-1 tracking-widest">RMSE: 30.05</div>
      </div>

    </div>
  </div>
);


export default function UrbanAirPollution() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  
  const [showTheory, setShowTheory] = useState(false);

  return (
    <article lang={isEn ? "en" : "fr"} className="bg-[#fafafa] dark:bg-[var(--bg)] text-[#222222] dark:text-[var(--text)] font-serif selection:bg-blue-200 rounded-lg overflow-hidden border border-slate-200 dark:border-[var(--border)] shadow-xl relative">
      
      {/* HEADER */}
      <header className="max-w-3xl mx-auto pt-10 sm:pt-16 pb-8 sm:pb-12 px-5 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
          {isEn ? "Urban Air Pollution" : "Pollution de l'Air Urbain"} <br/>
          <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl block mt-1">
            {isEn ? "Spatio-Temporal Pipeline & Ensembling" : "Pipeline Spatio-Temporel & Ensembling"}
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-sans mb-8 sm:mb-10 text-slate-600 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border)] pb-6 sm:pb-8">
          <div>
            <strong>{isEn ? "Author" : "Auteur"}</strong><br/>
            NDINGA OBA Olivier Vertu
          </div>
          <div>
            <strong>Framework</strong><br/>
            {isEn ? "Statistical Foundations of ML" : "Fondations Statistiques du ML"}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">Time-Series</span>
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">LightGBM</span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 whitespace-nowrap">R / Python</span>
          </div>
        </div>

        <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-8 sm:mb-12 text-left md:text-justify md:hyphens-auto">
          <p>
            <strong>{isEn ? "Project Goal:" : "Le but du projet :"}</strong> {isEn 
              ? "Developed for a Zindi competition, this project tackles the severe sparsity of air quality data in African cities to predict hazardous PM2.5 concentrations. By fusing noisy ground sensors, meteorological weather APIs, and satellite imagery, we designed a robust spatio-temporal machine learning architecture."
              : "Développé dans le cadre d'une compétition Zindi, ce projet s'attaque à l'extrême rareté des données de qualité de l'air dans les villes africaines pour prédire les particules dangereuses PM2.5. En fusionnant des capteurs au sol bruités, des APIs météorologiques et l'imagerie satellite, nous avons conçu une architecture de Machine Learning spatio-temporelle robuste."
            }
          </p>
        </section>
      </header>

      {/* BODY */}
      <main className="max-w-3xl mx-auto px-5 sm:px-6 pb-20 sm:pb-24 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-[var(--text)]">
        
        <div className="flex justify-start sm:justify-end mb-8">
          <button 
            onClick={() => setShowTheory(!showTheory)}
            className="text-sm bg-slate-100 dark:bg-[var(--bg-elevated)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-slate-200 py-2 sm:py-1.5 px-4 sm:px-3 rounded font-sans transition-colors border border-slate-200 dark:border-[var(--border)] shadow-sm w-full sm:w-auto text-center font-semibold"
          >
            {showTheory 
              ? (isEn ? "Hide mathematical formulas" : "Cacher les formules mathématiques") 
              : (isEn ? "Show mathematical formulas" : "Afficher les formules mathématiques")}
          </button>
        </div>

        {/* 1. PROBLEM FORMULATION */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold font-sans mb-4 sm:mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "1. The Data Sparsity Problem" : "1. Le Problème de la Rareté des Données"}
          </h2>
          <div className="space-y-4 sm:space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "Air pollution causes over 4.2 million premature deaths annually. Our dataset contained historical pollution levels, wind speed, temperature, and atmospheric satellite readings. However, real-world sensor data is notoriously noisy with massive temporal gaps."
                : "La pollution de l'air cause plus de 4,2 millions de décès prématurés par an. Notre jeu de données contenait les niveaux historiques de pollution, la vitesse du vent, la température et des relevés atmosphériques par satellite. Cependant, les données de capteurs en monde réel sont notoirement bruitées avec des vides temporels massifs."
              }
            </p>

            <MissingDataTimeline isEn={isEn} />
            
            <p>
              {isEn 
                ? "We discovered that 50% of the features exhibit strong temporal dependencies (autocorrelation > 0.5). This high proportion indicates that past values strongly influence future values, requiring special attention during data imputation."
                : "Nous avons découvert que 50% des variables présentaient de fortes dépendances temporelles (autocorrélation > 0,5). Cette proportion élevée indique que les valeurs passées influencent fortement les valeurs futures, nécessitant une attention particulière lors de l'imputation des données."}
            </p>

            {showTheory && (
              <div className="my-6 sm:my-8 p-4 sm:p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Autocorrelation Function" : "Fonction d'Autocorrélation"}
                </h4>
                <div className="overflow-x-auto pb-4">
                  <BlockMath math="R(\tau) = \frac{\mathbb{E}[(X_t - \mu)(X_{t+\tau} - \mu)]}{\sigma^2}" />
                </div>
                <p className="text-xs sm:text-sm mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn 
                    ? "By measuring how a variable correlates with a delayed copy of itself (lag \\(\\tau\\)), we confirmed the necessity of introducing temporal engineering."
                    : "En mesurant comment une variable est corrélée à une copie retardée d'elle-même (décalage \\(\\tau\\)), nous avons confirmé la nécessité d'introduire une ingénierie temporelle."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 2. FEATURE ENGINEERING & SELECTION */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold font-sans mb-4 sm:mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "2. Feature Engineering & Selection" : "2. Ingénierie des Variables & Sélection"}
          </h2>
          <div className="space-y-4 sm:space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "To enhance the model's ability to capture cyclical patterns, we applied rigorous preprocessing steps:"
                : "Pour améliorer la capacité du modèle à capturer les modèles cycliques, nous avons appliqué des étapes de prétraitement rigoureuses :"
              }
            </p>

            <ul className="list-disc pl-5 space-y-3 sm:space-y-4 font-sans text-sm sm:text-base">
              <li>
                <strong>{isEn ? "Cyclic Encoding:" : "Encodage Cyclique :"}</strong> {isEn 
                ? "Time-related features were transformed into sinusoidal representations (" : "Les caractéristiques liées au temps ont été transformées en représentations sinusoïdales ("}
                <InlineMath math="day_{cos}, week_{sin}, month_{sin}" />
                {isEn ? ") to correctly capture planetary and weekly cycles." : ") pour capturer correctement les cycles planétaires et hebdomadaires."}
              </li>
              <li>
                <strong>{isEn ? "Temporal Shifting (23-days):" : "Décalage Temporel (23 jours) :"}</strong> {isEn 
                ? "We engineered Lead, Lag, and Rolling features over a massive 23-day window. This allowed the models to learn from moving averages, rolling standard deviations, and past maximums."
                : "Nous avons conçu des caractéristiques Lead, Lag et Rolling sur une fenêtre massive de 23 jours. Cela a permis aux modèles d'apprendre des moyennes mobiles, des écarts types glissants et des maximums passés."}
              </li>
              <li>
                <strong>{isEn ? "Information Gain Ranking:" : "Classement par Gain d'Information :"}</strong> {isEn 
                ? "Using Mutual Information (MI), we ranked features based on their uncertainty reduction regarding the PM2.5 target variable."
                : "En utilisant l'Information Mutuelle (MI), nous avons classé les caractéristiques en fonction de leur réduction d'incertitude concernant la variable cible PM2.5."}
              </li>
            </ul>

            <FeatureImportanceChart isEn={isEn} />

            {showTheory && (
              <div className="my-6 sm:my-8 p-4 sm:p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Differential Entropy for Gaussian Distributions" : "Entropie Différentielle pour les Distributions Gaussiennes"}
                </h4>
                <p className="text-xs sm:text-sm mb-4 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "To quantify information, we rely on the continuous entropy of the data. For a Gaussian feature, the differential entropy is defined as:"
                    : "Pour quantifier l'information, nous nous appuyons sur l'entropie continue des données. Pour une variable Gaussienne, l'entropie différentielle est définie comme :"}
                </p>
                <div className="overflow-x-auto pb-4">
                  <BlockMath math="E(X) = H(X_n) = \frac{1}{2}\ln 2\pi e\sigma_X^2" />
                </div>
                <p className="text-xs sm:text-sm mt-4 mb-4 text-slate-600 dark:text-slate-400">
                  {isEn
                    ? "The conditional entropy (the remaining uncertainty of our target given the features) is formulated as:"
                    : "L'entropie conditionnelle (l'incertitude restante de notre cible compte tenu des caractéristiques) se formule comme :"}
                </p>
                <div className="overflow-x-auto pb-4">
                  <BlockMath math="C(X) = H(X_n|X_n^m) = \frac{1}{2}\ln 2\pi\sigma_U^2" />
                </div>
                <p className="text-xs sm:text-sm mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn 
                    ? "Evaluating the reduction between these two entropies allowed us to confirm that the rolling means of HCHO and NO2 were our absolute strongest predictors." 
                    : "L'évaluation de la réduction entre ces deux entropies nous a permis de confirmer que les moyennes glissantes de HCHO et NO2 étaient nos prédicteurs absolus les plus forts."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3. MODEL SELECTION */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold font-sans mb-4 sm:mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "3. The Winning Strategy: LightGBM Ensembling" : "3. La Stratégie Gagnante : Ensemble LightGBM"}
          </h2>
          <div className="space-y-4 sm:space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "We benchmarked multiple architectures, starting from linear robust models (Ridge Regression) to deep recurrent networks (LSTM). Surprisingly, despite being the state-of-the-art for time series, LSTM performed poorly due to our dataset's extensive missingness."
                : "Nous avons comparé plusieurs architectures, allant des modèles linéaires (Régression Ridge) aux réseaux récurrents profonds (LSTM). Étonnamment, bien qu'étant l'état de l'art pour les séries temporelles, le LSTM a mal performé en raison de l'extrême rareté de nos données."}
            </p>
            
            <ArchitectureFlow isEn={isEn} />

            <p>
              {isEn 
                ? "For the final predictive thrust, we abandoned Deep Learning in favor of LightGBM. It was chosen for its efficiency and native ability to handle missing values without massive imputation bias. To ensure extreme robustness against the noisy validation sets, the final predictions were aggregated across 3 distinct configurations."
                : "Pour la phase prédictive finale, nous avons abandonné le Deep Learning en faveur de LightGBM. Il a été choisi pour son efficacité et sa capacité native à traiter les valeurs manquantes. Pour garantir une robustesse extrême, les prédictions finales ont été agrégées à partir de 3 configurations distinctes."}
            </p>

            {showTheory && (
              <div className="my-6 sm:my-8 p-4 sm:p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Root Mean Square Error (RMSE)" : "Erreur Quadratique Moyenne (RMSE)"}
                </h4>
                <div className="overflow-x-auto pb-4">
                  <BlockMath math="\text{RMSE} = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}" />
                </div>
                <p className="text-xs sm:text-sm mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn 
                    ? "The model's final evaluation was strictly based on RMSE, severely penalizing large deviation errors on dangerous PM2.5 pollution spikes."
                    : "L'évaluation finale du modèle était strictement basée sur le RMSE, pénalisant sévèrement les grandes erreurs de déviation lors des dangereux pics de pollution aux PM2.5."}
                </p>
                <div className="my-6 h-px bg-slate-200 dark:bg-[var(--border)]"></div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Bias-Variance Tradeoff (MSE Decomposition)" : "Compromis Biais-Variance (Décomposition du MSE)"}
                </h4>
                <div className="overflow-x-auto pb-4">
                  <BlockMath math="\text{MSE}(\hat{\theta}) = \mathbb{E}[(\hat{\theta} - \theta)^2] = \text{Var}(\hat{\theta}) + [\text{Bias}(\hat{\theta})]^2" />
                </div>
                <p className="text-xs sm:text-sm mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn 
                    ? "In Ensembling, aggregating multiple models drastically reduces the variance component without increasing the bias, producing a much more stable generalization."
                    : "Dans l'approche d'Ensemble, l'agrégation de plusieurs modèles réduit drastiquement la composante de variance sans augmenter le biais, produisant une généralisation beaucoup plus stable."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CONCLUSION */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-sans mb-4 sm:mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "4. Conclusion" : "4. Conclusion"}
          </h2>
          <div className="text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "This rigorous feature engineering and ensemble approach yielded a highly competitive RMSE score of " : "Cette ingénierie rigoureuse et l'approche d'Ensemble ont permis d'obtenir un score RMSE très compétitif de "}
                <strong className="text-blue-600 dark:text-blue-400">30.05</strong> 
              {isEn 
                ? " on the Zindi challenge platform. It proved that thoughtfully designed, tree-based models can outperform complex recurrent networks when dealing with fractured, real-world environmental datasets."
                : " sur la plateforme de compétition Zindi. Cela prouve que des modèles basés sur les arbres de décision, lorsqu'ils sont bien conçus, peuvent surpasser les réseaux récurrents complexes face à des jeux de données environnementaux fragmentés."
              }
            </p>
          </div>
        </section>
      </main>
    </article>
  );
}
