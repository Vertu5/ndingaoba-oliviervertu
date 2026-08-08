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

  return (
    <article lang={isEn ? "en" : "fr"} className="bg-[#fafafa] dark:bg-[var(--bg)] text-[#222222] dark:text-[var(--text)] font-serif selection:bg-blue-200 rounded-lg overflow-hidden border border-slate-200 dark:border-[var(--border)] shadow-xl relative">
      
      {/* HEADER */}
      <header className="max-w-3xl mx-auto pt-16 pb-12 px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
          {isEn ? "Urban Air Pollution" : "Pollution de l'Air Urbain"} <br/>
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
              ? "Developed for a Zindi competition, this project tackles the severe sparsity of air quality data in African cities to predict hazardous PM2.5 concentrations. By fusing noisy ground sensors, meteorological weather APIs, and satellite imagery, we designed a robust spatio-temporal machine learning architecture."
              : "Développé dans le cadre d'une compétition Zindi, ce projet s'attaque à l'extrême rareté des données de qualité de l'air dans les villes africaines pour prédire les particules dangereuses PM2.5. En fusionnant des capteurs au sol bruités, des APIs météorologiques et l'imagerie satellite, nous avons conçu une architecture de Machine Learning spatio-temporelle robuste."
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

        {/* 1. PROBLEM FORMULATION */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "1. Problem Formulation & Autocorrelation" : "1. Formulation du Problème & Autocorrélation"}
          </h2>
          <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "Air pollution causes over 4.2 million premature deaths annually. Our dataset contained historical pollution levels, wind speed, temperature, and atmospheric satellite readings. However, real-world sensor data is notoriously noisy. To decide whether to use standard regression or time-series forecasting, we analyzed the autocorrelation of our features."
                : "La pollution de l'air cause plus de 4,2 millions de décès prématurés par an. Notre jeu de données contenait les niveaux historiques de pollution, la vitesse du vent, la température et des relevés atmosphériques par satellite. Cependant, les données de capteurs en monde réel sont notoirement bruitées. Pour décider s'il fallait utiliser une régression standard ou une prévision de séries temporelles, nous avons analysé l'autocorrélation."
              }
            </p>
            
            <p>
              {isEn 
                ? "We discovered that 50% of the features exhibit strong temporal dependencies (autocorrelation > 0.5). This high proportion indicates that past values strongly influence future values, requiring special attention during data imputation."
                : "Nous avons découvert que 50% des variables présentaient de fortes dépendances temporelles (autocorrélation > 0,5). Cette proportion élevée indique que les valeurs passées influencent fortement les valeurs futures, nécessitant une attention particulière lors de l'imputation des données."}
            </p>

            {showTheory && (
              <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Autocorrelation Function" : "Fonction d'Autocorrélation"}
                </h4>
                <BlockMath math="R(\tau) = \frac{\mathbb{E}[(X_t - \mu)(X_{t+\tau} - \mu)]}{\sigma^2}" />
                <p className="text-sm mt-4 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "By measuring how a variable correlates with a delayed copy of itself (lag \(\tau\)), we confirmed the necessity of introducing temporal engineering."
                    : "En mesurant comment une variable est corrélée à une copie retardée d'elle-même (décalage \(\tau\)), nous avons confirmé la nécessité d'introduire une ingénierie temporelle."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 2. FEATURE ENGINEERING & SELECTION */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "2. Feature Engineering & Entropy" : "2. Ingénierie des Variables & Entropie"}
          </h2>
          <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "To enhance the model's ability to capture cyclical patterns, we applied rigorous preprocessing steps:"
                : "Pour améliorer la capacité du modèle à capturer les modèles cycliques, nous avons appliqué des étapes de prétraitement rigoureuses :"
              }
            </p>

            <ul className="list-disc pl-5 space-y-4 font-sans text-base">
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

            {showTheory && (
              <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Differential Entropy for Gaussian Distributions" : "Entropie Différentielle pour les Distributions Gaussiennes"}
                </h4>
                <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "To quantify information, we rely on the continuous entropy of the data. For a Gaussian feature, the differential entropy is defined as:"
                    : "Pour quantifier l'information, nous nous appuyons sur l'entropie continue des données. Pour une variable Gaussienne, l'entropie différentielle est définie comme :"}
                </p>
                <BlockMath math="E(X) = H(X_n) = \frac{1}{2}\ln 2\pi e\sigma_X^2" />
                <p className="text-sm mt-6 mb-4 text-slate-600 dark:text-slate-400">
                  {isEn
                    ? "The conditional entropy (the remaining uncertainty of our target given the features) is formulated as:"
                    : "L'entropie conditionnelle (l'incertitude restante de notre cible compte tenu des caractéristiques) se formule comme :"}
                </p>
                <BlockMath math="C(X) = H(X_n|X_n^m) = \frac{1}{2}\ln 2\pi\sigma_U^2" />
                <p className="text-sm mt-6 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "Evaluating the reduction between these two entropies allowed us to confirm that " : "L'évaluation de la réduction entre ces deux entropies nous a permis de confirmer que "}
                  <code className="bg-slate-200 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-xs">L3_HCHO_..._rolling_mean_2</code>
                  {isEn 
                    ? " was our absolute strongest predictor." : " était notre prédicteur absolu le plus fort."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3. MODEL SELECTION */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "3. Model Selection Architecture" : "3. Architecture & Modélisation"}
          </h2>
          <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "We benchmarked multiple architectures, starting from linear robust models to deep recurrent networks:"
                : "Nous avons comparé plusieurs architectures, allant des modèles linéaires robustes aux réseaux récurrents profonds :"}
            </p>

            <ul className="list-disc pl-5 space-y-4 font-sans text-base">
              <li>
                <strong className="text-slate-900 dark:text-white">{isEn ? "Ridge Regression:" : "Régression Ridge :"}</strong> {isEn 
                ? "Used to counter multicollinearity in meteorological satellite data. By adding a degree of bias to the regression estimates, it reduces standard errors." 
                : "Utilisée pour contrer la multicolinéarité dans les données satellitaires. En ajoutant un degré de biais aux estimations de régression, elle réduit les erreurs standards."}
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">{isEn ? "LSTM Networks:" : "Réseaux LSTM :"}</strong> {isEn 
                ? "Despite being the state-of-the-art for time series, LSTM performed poorly. The network struggled heavily with our dataset's extensive missingness and discontinuous temporal gaps, leading to severe overfitting."
                : "Bien qu'étant l'état de l'art pour les séries temporelles, le LSTM a mal performé. Le réseau a lourdement échoué face à l'extrême rareté de nos données et aux sauts temporels, entraînant un sur-apprentissage massif."}
              </li>
            </ul>

            {showTheory && (
              <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Bias-Variance Tradeoff (MSE Decomposition)" : "Compromis Biais-Variance (Décomposition du MSE)"}
                </h4>
                <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "In Ridge Regression, we optimize the balance between the variance of the estimator and its squared bias to minimize the overall Mean Squared Error:"
                    : "Dans la régression Ridge, nous optimisons l'équilibre entre la variance de l'estimateur et son biais au carré pour minimiser l'erreur quadratique moyenne globale :"}
                </p>
                <BlockMath math="\text{MSE}(\hat{\theta}) = \mathbb{E}[(\hat{\theta} - \theta)^2] = \text{Var}(\hat{\theta}) + [\text{Bias}(\hat{\theta})]^2" />
                <p className="text-sm mt-6 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "By accepting a slight deliberate bias, Ridge regression significantly reduces the variance caused by highly correlated spatial weather features, producing a much more stable model than standard OLS."
                    : "En acceptant un léger biais délibéré, la régression Ridge réduit considérablement la variance causée par des caractéristiques météorologiques spatiales hautement corrélées, produisant un modèle beaucoup plus stable que les moindres carrés ordinaires (OLS)."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. LIGHTGBM & ENSEMBLING */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "4. The Winning Strategy: LightGBM Ensembling" : "4. La Stratégie Gagnante : Ensemble LightGBM"}
          </h2>
          <div className="space-y-6 text-left md:text-justify md:hyphens-auto">
            <p>
              {isEn 
                ? "For the final predictive thrust, we abandoned Deep Learning in favor of LightGBM. It was chosen for its efficiency, scalability, and crucial native ability to handle missing values without massive imputation bias."
                : "Pour la phase prédictive finale, nous avons abandonné le Deep Learning en faveur de LightGBM. Il a été choisi pour son efficacité, sa scalabilité, et sa capacité native cruciale à traiter les valeurs manquantes sans imposer un biais d'imputation massif."}
            </p>
            <p>
              {isEn 
                ? "To ensure extreme robustness against the noisy validation sets, the final predictions were aggregated (ensembled) across 3 distinct LightGBM configurations. We computed the mean of these three predictions to find the best possible result."
                : "Pour garantir une robustesse extrême face aux ensembles de validation bruités, les prédictions finales ont été agrégées (Ensemble) à partir de 3 configurations distinctes de LightGBM. Nous avons calculé la moyenne de ces trois prédictions pour trouver le meilleur résultat possible."}
            </p>

            {showTheory && (
              <div className="my-8 p-6 bg-slate-50 dark:bg-[#111] rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
                  {isEn ? "Root Mean Square Error (RMSE)" : "Erreur Quadratique Moyenne (RMSE)"}
                </h4>
                <BlockMath math="\text{RMSE} = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}" />
                <p className="text-sm mt-4 text-slate-600 dark:text-slate-400">
                  {isEn 
                    ? "The model's final evaluation was strictly based on RMSE, severely penalizing large deviation errors on dangerous PM2.5 pollution spikes."
                    : "L'évaluation finale du modèle était strictement basée sur le RMSE, pénalisant sévèrement les grandes erreurs de déviation lors des dangereux pics de pollution aux PM2.5."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CONCLUSION */}
        <section>
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn ? "5. Conclusion" : "5. Conclusion"}
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
