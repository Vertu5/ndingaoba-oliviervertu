"use client";

import React, { useState } from "react";
import { BlockMath } from "react-katex";
import igamingData from "../../data/igaming.json";

export default function ExecutiveLeversSection({ isEn }: { isEn: boolean }) {
  const [showTheory, setShowTheory] = useState(false);
  const kpi = igamingData.kpis.rows[0];

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
        <h2 className="text-2xl font-bold font-sans">
          {isEn
            ? "1. Executive Value Flow & Strategic Levers"
            : "1. Flux Financier du Casino & Leviers Stratégiques"}
        </h2>
        <button
          type="button"
          onClick={() => setShowTheory(!showTheory)}
          className="text-sm bg-slate-100 dark:bg-[var(--bg-elevated)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-[var(--text)] py-1.5 px-3 rounded font-sans transition-colors border border-slate-200 dark:border-[var(--border)] mt-4 md:mt-0 shadow-sm cursor-pointer"
        >
          {showTheory
            ? isEn
              ? "Hide mathematical formulas"
              : "Cacher les formules mathématiques"
            : isEn
            ? "Show mathematical formulas"
            : "Voir les formules mathématiques"}
        </button>
      </div>

      <p className="mb-8 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
        {isEn
          ? "Out of 8,000 registered players, 1,143 never placed a single spin (14.3% unactivated). Among the 6,857 active players, 92.92% of all wagered money is returned as winnings (RTP), leaving a 7.08% gross margin (GGR) that is heavily concentrated on a tiny fraction of VIP players."
          : "Sur 8 000 inscrits, 1 143 n'ont jamais effectué un seul tour (14,3 % d'inactifs). Parmi les 6 857 joueurs actifs, 92,92 % des mises sont redistribuées en gains (RTP), laissant une marge nette (GGR) de 7,08 % extrêmement concentrée sur une minorité de joueurs VIP."}
      </p>

      {/* FIGURE 1: VISUAL CASINO P&L WATERFALL */}
      <figure className="my-10 bg-slate-50 dark:bg-[var(--bg-elevated)] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-[var(--border)] font-sans shadow-sm">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-[var(--text)] mb-5 flex items-center justify-between">
          <span>
            {isEn
              ? "Figure 1. Casino Revenue Waterfall (From Signups to GGR at Risk)"
              : "Figure 1. Cascade Financière du Casino (Des Inscriptions au GGR à Risque)"}
          </span>
          <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
            4,646,999 Spins
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white dark:bg-[var(--bg)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] border-t-4 border-t-slate-400 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-[var(--text-muted)]">
              {isEn ? "1. Signups" : "1. Inscrits"}
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-[var(--text)] mt-1">
              8,000
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              85.7% {isEn ? "activated" : "activés"}
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--bg)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] border-t-4 border-t-blue-500 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-[var(--text-muted)]">
              {isEn ? "2. Total Bets" : "2. Mises (Turnover)"}
            </div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              €{(kpi.turnover / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[var(--text-muted)] mt-0.5">
              46,690 sessions
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--bg)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] border-t-4 border-t-indigo-500 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-[var(--text-muted)]">
              {isEn ? "3. Player Wins" : "3. Gains Joueurs"}
            </div>
            <div className="text-xl font-bold text-slate-800 dark:text-[var(--text)] mt-1">
              €7.54M
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[var(--text-muted)] mt-0.5">
              92.92% RTP
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--bg)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] border-t-4 border-t-emerald-500 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold">
              {isEn ? "4. Net GGR" : "4. Revenu Net (GGR)"}
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              €{(kpi.ggr / 1000).toFixed(1)}K
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              7.08% Hold
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[var(--bg)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] border-t-4 border-t-rose-500 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400 font-bold">
              {isEn ? "5. GGR at Risk" : "5. GGR à Risque"}
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              €221.5K
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
              {isEn ? "30d Churn ML" : "Churn 30j ML"}
            </div>
          </div>
        </div>
      </figure>

      {/* 4 Executive Levers Cards */}
      <ul className="space-y-4 mb-8">
        <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
          <strong className="font-sans text-slate-900 dark:text-[var(--text)]">
            1.{" "}
            {isEn
              ? "Acquisition Profitability: Organic (€90.57/player) vs Referral (€41.72/player)"
              : "Rentabilité Marketing : Organic (90,57 €/inscrit) vs Referral (41,72 €/inscrit)"}
          </strong>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "By keeping unactivated signups via a LEFT JOIN, we prove that activation is identical across channels (~85%), but Organic players generate 2.2x more revenue and a higher hold rate (8.76% vs 5.25% for Referral)."
              : "En conservant les inscrits inactifs via un LEFT JOIN, on démontre que l'activation est identique partout (~85 %), mais qu'un joueur Organic rapporte 2,2 fois plus qu'un joueur Referral (marge de 8,76 % contre 5,25 %)."}
          </p>
          {showTheory && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center font-sans text-slate-800 dark:text-[var(--text)]">
              <em>{isEn ? "Gross Gaming Revenue & Hold Rate:" : "Revenu Brut des Jeux (GGR) & Taux de Marge :"}</em>
              <div className="my-2 flex justify-center">
                <BlockMath
                  math={String.raw`\text{GGR}_c = \sum_{i \in c} (\text{Bet}_i - \text{Win}_i), \quad \text{Hold}_c = \frac{\text{GGR}_c}{\sum_{i \in c} \text{Bet}_i}`}
                />
              </div>
            </div>
          )}
        </li>

        <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
          <strong className="font-sans text-slate-900 dark:text-[var(--text)]">
            2.{" "}
            {isEn
              ? "VIP Pareto Concentration: 1% of Players Generate 40.8% of Total Casino Revenue"
              : "Concentration Pareto VIP : 1 % des Joueurs Génèrent 40,8 % du Revenu du Casino"}
          </strong>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "Because 32.7% of active players are net winners (GGR < 0) over a 4-month window, segmenting by GGR fails. Ranking by Turnover + RFM isolates the 69 VIP whales (€234.4K GGR) and 413 high-value players currently slipping into inactivity (€553.8K in bets)."
              : "Comme 32,7 % des joueurs actifs sont gagnants nets (GGR < 0), segmenter sur le GGR fausse l'analyse. Le classement sur le volume misé (Turnover) + RFM isole les 69 VIP (234,4 k€ de GGR) et 413 gros joueurs en train de décrocher (553,8 k€ de mises)."}
          </p>
          {showTheory && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center font-sans text-slate-800 dark:text-[var(--text)]">
              <em>{isEn ? "Empirical vs Theoretical GGR:" : "GGR Réel vs GGR Théorique Attendu :"}</em>
              <div className="my-2 flex justify-center">
                <BlockMath
                  math={String.raw`\mathbb{E}[\text{GGR}_p] = \sum_{s \in p} \text{Bet}_s \cdot (1 - \text{RTP}_{\text{slot}}) = 575.3\text{ k€} \approx \text{GGR}_{\text{actual}} (574.3\text{ k€})`}
                />
              </div>
            </div>
          )}
        </li>

        <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
          <strong className="font-sans text-slate-900 dark:text-[var(--text)]">
            3.{" "}
            {isEn
              ? "MLflow Churn Prediction: Regularity Protects Revenue Far Better Than Spend (AUC = 0.75)"
              : "Prédiction du Churn MLflow : La Régularité Protège Mieux le Revenu que la Mise (AUC = 0,75)"}
          </strong>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "Trained without temporal leakage (first 60 days features -> final 30 days inactivity) and registered in Unity Catalog as @champion, our model scores €221.5K of expected GGR at risk across all 6,857 active players."
              : "Entraîné sans fuite temporelle (60 premiers jours -> inactivité sur les 30 derniers) et promu dans Unity Catalog sous l'alias @champion, le modèle chiffre à 221,5 k€ le GGR pondéré par le risque de départ sur les 6 857 joueurs actifs."}
          </p>
          {showTheory && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center font-sans text-slate-800 dark:text-[var(--text)]">
              <em>{isEn ? "Expected GGR at Risk Formula:" : "Formule du GGR Attendu à Risque :"}</em>
              <div className="my-2 flex justify-center">
                <BlockMath
                  math={String.raw`\text{GGR}_{\text{at\_risk}}(p) = \max(\text{GGR}_p, 0) \cdot \sigma\!\left(\beta_0 + \sum_{j=1}^{8} \beta_j \tilde{x}_{pj}\right)`}
                />
              </div>
            </div>
          )}
        </li>

        <li className="bg-white dark:bg-[var(--bg-elevated)] p-5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
          <strong className="font-sans text-slate-900 dark:text-[var(--text)]">
            4.{" "}
            {isEn
              ? "Anti-Fraud & Responsible Gaming: Hybrid Rules (399) + Isolation Forest (467)"
              : "Anti-Fraude & Jeu Responsable : Hybride Règles Métier (399) + Isolation Forest (467)"}
          </strong>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "Calibrating session thresholds on the empirical 99th percentile (duration >= 49 min, pace >= 20 spins/min, max bet >= €627) and crossing them with shared IP/device detection and Isolation Forest isolates 67 Priority-1 sessions."
              : "Le calibrage sur le 99e centile réel (durée >= 49 min, cadence >= 20 tours/min, mise max >= 627 €) croisé avec la détection d'IP/appareils partagés et Isolation Forest isole 67 sessions critiques en priorité absolue."}
          </p>
        </li>
      </ul>
    </section>
  );
}
