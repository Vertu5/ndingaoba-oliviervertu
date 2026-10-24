"use client";

import React, { useMemo, useState } from "react";
import { BlockMath } from "react-katex";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Area,
  ReferenceLine,
} from "recharts";
import { useLang } from "@/app/lib/i18n";
import TextToSqlSandbox from "./igaming/TextToSqlSandbox";
import igamingData from "../data/igaming.json";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function IgamingDatabricks() {
  const { lang } = useLang();
  const isEn = lang === "en";

  const [showTheory, setShowTheory] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSlideSql, setShowSlideSql] = useState(false);

  const kpi = igamingData.kpis.rows[0];

  const channelChartData = useMemo(
    () =>
      igamingData.channels.rows.map((r) => ({
        channel: r.acquisition_channel,
        ggrPerPlayer: r.ggr_per_registered_player,
        ggrPerActive: Number((r.ggr / r.active_players).toFixed(2)),
        totalGgrK: Number((r.ggr / 1000).toFixed(1)),
      })),
    []
  );

  const paretoChartData = useMemo(() => {
    return igamingData.pareto.rows.map((r, idx, arr) => {
      const prevCum = idx > 0 ? arr[idx - 1].cumulative_share_of_turnover : 0;
      const decileShare = (r.cumulative_share_of_turnover - prevCum) * 100;
      return {
        label: `Top ${Math.round(r.top_share_of_players * 100)}%`,
        turnoverShare: Number(decileShare.toFixed(1)),
        cumulativeShare: Number((r.cumulative_share_of_turnover * 100).toFixed(1)),
      };
    });
  }, []);

  const segmentChartData = useMemo(
    () =>
      igamingData.segments.rows.map((r) => ({
        segment: r.segment,
        turnoverK: Number((r.turnover / 1000).toFixed(1)),
        ggrK: Number((r.ggr / 1000).toFixed(1)),
      })),
    []
  );

  const churnDriversData = useMemo(() => {
    const entries = Object.entries(igamingData.churn.standardized_coefficients);
    const labelMapFr: Record<string, string> = {
      active_days: "Jours actifs (Régularité)",
      sessions: "Nombre de sessions",
      turnover: "Volume misé (€)",
      feature_buys: "Achats de bonus",
      avg_bet: "Mise moyenne (€)",
      days_idle_before_cutoff: "Jours d'inactivité récents",
      spins: "Nombre de tours",
      tenure_days: "Ancienneté (jours)",
    };
    const labelMapEn: Record<string, string> = {
      active_days: "Active days (Regularity)",
      sessions: "Session count",
      turnover: "Total turnover (€)",
      feature_buys: "Bonus feature buys",
      avg_bet: "Average bet (€)",
      days_idle_before_cutoff: "Recent idle days",
      spins: "Spin count",
      tenure_days: "Tenure (days)",
    };
    return entries
      .map(([k, v]) => ({
        feature: isEn ? labelMapEn[k] || k : labelMapFr[k] || k,
        coef: Number(v),
      }))
      .sort((a, b) => a.coef - b.coef);
  }, [isEn]);

  const personaChartData = useMemo(
    () =>
      igamingData.mlflow.cluster_personas.map((p) => ({
        persona: p.cluster_persona,
        totalGgrK: Number((p.total_ggr / 1000).toFixed(1)),
        ggrAtRiskK: Number((p.ggr_at_risk / 1000).toFixed(1)),
      })),
    []
  );

  const riskFlagsChartData = useMemo(
    () => igamingData.risk_flags.rows.map((r) => ({ flag: r.flag, sessions: r.sessions })),
    []
  );

  const slides = [
    {
      badge: isEn ? "Decision 1 / 4 • Marketing Budget" : "Décision 1 / 4 • Budget Marketing",
      title: isEn
        ? "Acquisition ROI: Organic Yields 2.2x More Than Referral"
        : "Rentabilité Acquisition : Organic Rapporte 2,2x Plus que Referral",
      takeaway: isEn
        ? "Activation is uniform (~85% across all channels), proving that ROI differences come purely from player quality. Reallocate budget from Referral (€41.72/signup, 5.25% hold) to Organic (€90.57/signup, 8.76% hold) and Affiliate."
        : "Le taux d'activation étant identique partout (~85 %), l'écart de rentabilité provient uniquement de la qualité des joueurs. Décision : réallouer le budget de Referral (41,72 €/inscrit, marge 5,25 %) vers Organic (90,57 €/inscrit, marge 8,76 %) et Affiliate.",
      sql: igamingData.channels.sql,
    },
    {
      badge: isEn ? "Decision 2 / 4 • VIP & CRM Retention" : "Décision 2 / 4 • VIP & Rétention CRM",
      title: isEn
        ? "Pareto Concentration: 69 VIPs Drive 40.8% of GGR & 413 Whales Are Slipping"
        : "Loi de Pareto : 69 VIP Génèrent 40,8 % du GGR et 413 Gros Joueurs Décrochent",
      takeaway: isEn
        ? "The top 10% of players generate 64.2% of all bets, and 69 VIPs (1%) generate €234.4K in net GGR. Meanwhile, RFM scoring isolates 413 high-value players ('At risk') representing €553.8K in bets who must be contacted immediately."
        : "Le top 10 % des joueurs concentre 64,2 % des mises, et 69 VIP (1 %) génèrent 234,4 k€ de GGR. Parallèlement, la segmentation RFM isole 413 gros joueurs à risque (553,8 k€ de mises) à relancer immédiatement par les hôtes VIP.",
      sql: `${igamingData.segments.sql}\n\n-- Pareto decile query:\n${igamingData.pareto.sql}`,
    },
    {
      badge: isEn ? "Decision 3 / 4 • MLflow Churn Scoring" : "Décision 3 / 4 • Scoring Churn MLflow",
      title: isEn
        ? "Protecting €221.5K of GGR at Risk: Habit Beats Raw Spend (AUC = 0.75)"
        : "Protéger 221,5 k€ de GGR à Risque : L'Habitude Fidélise Plus que la Mise (AUC = 0,75)",
      takeaway: isEn
        ? "Our @champion model in Unity Catalog proves that play regularity (active_days: -0.88, sessions: -0.61) protects against 30-day churn far more than bet volume. Daily missions retain players better than one-off deposit bonuses."
        : "Le modèle @champion enregistré dans Unity Catalog prouve que la régularité (jours actifs : -0,88, sessions : -0,61) protège bien plus contre le départ à 30 jours que le montant misé. Des missions quotidiennes fidélisent mieux qu'un gros bonus ponctuel.",
      sql: "SELECT player_id, country, cluster_persona, churn_probability, ggr, expected_ggr_at_risk\nFROM workspace.igaming.gold_player_ml_scores\nORDER BY expected_ggr_at_risk DESC\nLIMIT 25;",
    },
    {
      badge: isEn ? "Decision 4 / 4 • Anti-Fraud & Compliance" : "Décision 4 / 4 • Anti-Fraude & Conformité",
      title: isEn
        ? "Crossing 99th-Percentile Rules (399) with Isolation Forest ML (467)"
        : "Croiser Règles Centiles 99 % (399) et Isolation Forest ML (467)",
      takeaway: isEn
        ? "Instead of auditing 46,690 sessions blindly, crossing rule-based flags (shared IP/device, geo mismatch) with Isolation Forest isolates 67 Priority-1 sessions flagged by both engines for immediate compliance review."
        : "Au lieu d'auditer 46 690 sessions à l'aveugle, le croisement des règles métier (partage d'IP/appareil, incohérence pays) et d'Isolation Forest isole 67 sessions Priorité 1 signalées simultanément par les deux moteurs.",
      sql: igamingData.risk_levels.sql,
    },
  ];

  return (
    <article
      lang={isEn ? "en" : "fr"}
      className="bg-[#fafafa] dark:bg-[var(--bg)] text-[#222222] dark:text-[var(--text)] font-serif selection:bg-blue-200 rounded-lg overflow-hidden border border-slate-200 dark:border-[var(--border)] shadow-xl relative"
    >
      {/* HEADER / TITRE (Matches GeneticOptimizer & UrbanAirPollution) */}
      <header className="max-w-3xl mx-auto pt-12 sm:pt-16 pb-10 sm:pb-12 px-5 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
          {isEn ? "iGaming Executive Intelligence" : "Intelligence Décisionnelle iGaming"} <br />
          <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl block mt-1">
            {isEn
              ? "Databricks Lakehouse, MLflow & Guarded Text-to-SQL"
              : "Lakehouse Databricks, MLflow & Text-to-SQL Gouverné"}
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-sans mb-10 text-slate-600 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border)] pb-8">
          <div>
            <strong>{isEn ? "Author" : "Auteur"}</strong>
            <br />
            NDINGA OBA Olivier Vertu
          </div>
          <div>
            <strong>Framework</strong>
            <br />
            {isEn ? "Databricks Unity Catalog & MLflow" : "Databricks Unity Catalog & MLflow"}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">
              Delta Lake
            </span>
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">
              MLflow @champion
            </span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 whitespace-nowrap">
              Text-to-SQL
            </span>
          </div>
        </div>

        {/* ABSTRACT */}
        <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-6 text-left md:text-justify md:hyphens-auto">
          <p>
            <strong>{isEn ? "Business Goal:" : "Objectif Exécutif :"}</strong>{" "}
            {isEn
              ? "Transforming 4.65 million raw slot spins (€8.11M in bets, €574.3K in net casino revenue) into an automated decision engine for casino executives: reallocating marketing spend toward high-margin channels, rescuing churning VIP whales before they leave, isolating multi-account collusion, and enabling directors to query Databricks in plain language in 0.3 seconds."
              : "Transformer 4,65 millions de spins bruts (8,11 M€ de mises, 574,3 k€ de revenu net casino) en un moteur de décision pour la direction : réallouer le budget marketing vers les canaux à forte marge, retenir les joueurs VIP avant leur départ, isoler la fraude multi-comptes et permettre aux directeurs d'interroger Databricks en langage naturel en 0,3 seconde."}
          </p>
        </section>
      </header>

      {/* MAIN ARTICLE BODY */}
      <main className="max-w-3xl mx-auto px-5 sm:px-6 pb-24 text-base sm:text-lg leading-relaxed sm:text-justify text-slate-800 dark:text-[var(--text)]">
        {/* SECTION 1: THE 4 EXECUTIVE LEVERS */}
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
              className="text-sm bg-slate-100 dark:bg-[var(--bg-elevated)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded font-sans transition-colors border border-slate-200 dark:border-[var(--border)] mt-4 md:mt-0 shadow-sm cursor-pointer"
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
          <figure className="my-10 bg-slate-50 dark:bg-[#151515] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-[var(--border)] font-sans shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center justify-between">
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
              <div className="bg-white dark:bg-[var(--bg-elevated)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  {isEn ? "1. Signups" : "1. Inscrits"}
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">8,000</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  85.7% {isEn ? "activated" : "activés"}
                </div>
              </div>

              <div className="bg-white dark:bg-[var(--bg-elevated)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  {isEn ? "2. Total Bets" : "2. Mises (Turnover)"}
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  €{(kpi.turnover / 1_000_000).toFixed(2)}M
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">46,690 sessions</div>
              </div>

              <div className="bg-white dark:bg-[var(--bg-elevated)] p-3.5 rounded-lg border border-slate-200 dark:border-[var(--border)] shadow-sm">
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  {isEn ? "3. Player Wins" : "3. Gains Joueurs"}
                </div>
                <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">
                  €7.54M
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">92.92% RTP</div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-sm">
                <div className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold">
                  {isEn ? "4. Net GGR" : "4. Revenu Net (GGR)"}
                </div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  €{(kpi.ggr / 1000).toFixed(1)}K
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-300 mt-0.5">
                  7.08% Hold
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-rose-50 dark:bg-rose-950/30 p-3.5 rounded-lg border border-rose-300 dark:border-rose-800 shadow-sm">
                <div className="text-[10px] font-mono uppercase text-rose-700 dark:text-rose-400 font-bold">
                  {isEn ? "5. GGR at Risk" : "5. GGR à Risque"}
                </div>
                <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  €221.5K
                </div>
                <div className="text-[11px] text-rose-600 dark:text-rose-300 mt-0.5">
                  {isEn ? "30d Churn ML" : "Churn 30j ML"}
                </div>
              </div>
            </div>
          </figure>

          {/* 4 Executive Levers Cards (Matches GeneticOptimizer Objective Cards) */}
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
                <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center font-sans">
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
                <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center font-sans">
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
                <div className="mt-4 p-4 bg-slate-50 dark:bg-[var(--bg)] border border-slate-200 dark:border-[var(--border)] rounded text-sm overflow-x-auto text-center font-sans">
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

        {/* SECTION 2: INTERACTIVE EXECUTIVE DECISION EXPLORER (Matches Figure 2 of GeneticOptimizer) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn
              ? "2. Interactive Executive Decision Explorer"
              : "2. Explorateur Interactif des Décisions Stratégiques"}
          </h2>
          <p className="mb-8 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "Navigate through the 4 core executive boards below to inspect the visual evidence and exact Databricks SQL queries behind each strategic recommendation."
              : "Naviguez à travers les 4 tableaux de bord exécutifs ci-dessous pour inspecter les preuves visuelles et les requêtes SQL Databricks associées à chaque recommandation."}
          </p>

          <figure className="mb-12 -mx-4 sm:-mx-6 md:-mx-12 font-sans">
            <div className="bg-white dark:bg-[var(--bg-elevated)] p-5 sm:p-8 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-xl space-y-6">
              {/* Top Navigation Pills + Prev/Next */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-[var(--border)] pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    isEn ? "1. Marketing ROI" : "1. ROI Marketing",
                    isEn ? "2. VIP & Pareto" : "2. VIP & Pareto",
                    isEn ? "3. MLflow Churn" : "3. Churn MLflow",
                    isEn ? "4. Fraud & Risk" : "4. Fraude & Risque",
                  ].map((tabLabel, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        activeSlide === idx
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-[var(--bg)] text-slate-600 dark:text-[var(--text-muted)] hover:bg-slate-200"
                      }`}
                    >
                      {tabLabel}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowSlideSql(!showSlideSql)}
                  className="text-xs bg-slate-100 dark:bg-[var(--bg)] hover:bg-slate-200 text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded border border-slate-200 dark:border-[var(--border)] font-medium cursor-pointer"
                >
                  {showSlideSql
                    ? isEn
                      ? "Hide Databricks SQL"
                      : "Masquer le SQL"
                    : isEn
                    ? "View Executed SQL"
                    : "Voir la requête SQL"}
                </button>
              </div>

              {/* Active Slide Header & Takeaway */}
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">
                  {slides[activeSlide].badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[var(--text)]">
                  {slides[activeSlide].title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-[var(--text-muted)] leading-relaxed">
                  {slides[activeSlide].takeaway}
                </p>
              </div>

              {showSlideSql && (
                <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
                  {slides[activeSlide].sql}
                </pre>
              )}

              {/* SLIDE 0: MARKETING ROI CHARTS */}
              {activeSlide === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "GGR per Registered vs Active Player (€)"
                        : "Revenu Net (GGR) par Inscrit vs par Actif (€)"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <BarChart data={channelChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="channel" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="€" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="ggrPerPlayer"
                          name={isEn ? "GGR / Signup (€)" : "GGR / Inscrit (€)"}
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="ggrPerActive"
                          name={isEn ? "GGR / Active (€)" : "GGR / Actif (€)"}
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "Total Net Casino Revenue by Channel (k€)"
                        : "Contribution au Revenu Total du Casino par Canal (k€)"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <BarChart
                        data={channelChartData}
                        layout="vertical"
                        margin={{ left: 15, right: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} unit="k€" />
                        <YAxis
                          type="category"
                          dataKey="channel"
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="totalGgrK"
                          name={isEn ? "Total GGR (k€)" : "GGR Total (k€)"}
                          radius={[0, 5, 5, 0]}
                        >
                          {channelChartData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* SLIDE 1: PARETO & RFM SEGMENTS */}
              {activeSlide === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "Pareto Curve: Top 10% Players = 64.2% of Bets"
                        : "Courbe de Pareto : Top 10 % Joueurs = 64,2 % des Mises"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <ComposedChart data={paretoChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeShare"
                          name={isEn ? "Cumulative Bets (%)" : "Mises Cumulées (%)"}
                          fill="rgba(37,99,235,0.15)"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                        <Bar
                          dataKey="turnoverShare"
                          name={isEn ? "Decile Share (%)" : "Part du Décile (%)"}
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "RFM Segments: Net GGR (k€) vs Bets at Risk (k€)"
                        : "Segments RFM : GGR Net (k€) vs Volume Misé (k€)"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <BarChart data={segmentChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="segment" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="k€" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="ggrK"
                          name={isEn ? "Net GGR (k€)" : "GGR Net (k€)"}
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="turnoverK"
                          name={isEn ? "Total Bets (k€)" : "Volume Misé (k€)"}
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* SLIDE 2: MLFLOW CHURN DRIVERS & K-MEANS PERSONAS */}
              {activeSlide === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "Churn Drivers (Green = Retains, Red = Drives Churn)"
                        : "Facteurs de Churn (Vert = Fidélise, Rouge = Départ)"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <BarChart
                        data={churnDriversData}
                        layout="vertical"
                        margin={{ left: 20, right: 15 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis
                          type="number"
                          domain={[-1, 0.3]}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="feature"
                          tick={{ fill: "#64748b", fontSize: 10 }}
                          width={145}
                        />
                        <ReferenceLine x={0} stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="coef"
                          name={isEn ? "Standardized Weight" : "Impact Standardisé"}
                          radius={[4, 4, 4, 4]}
                        >
                          {churnDriversData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.coef < 0 ? "#10b981" : "#f43f5e"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "K-Means Personas: Total GGR vs GGR at Risk (k€)"
                        : "Personas K-Means : GGR Total vs GGR à Risque (k€)"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <BarChart data={personaChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="persona" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="k€" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="totalGgrK"
                          name={isEn ? "Total GGR (k€)" : "GGR Total (k€)"}
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="ggrAtRiskK"
                          name={isEn ? "GGR at Risk (k€)" : "GGR à Risque (k€)"}
                          fill="#f43f5e"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* SLIDE 3: FRAUD & RESPONSIBLE GAMING */}
              {activeSlide === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                  <div className="lg:col-span-5 space-y-3 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                      {isEn
                        ? "Rules (399) vs Isolation Forest (467)"
                        : "Croisement Règles SQL (399) vs ML (467)"}
                    </div>
                    {[
                      {
                        label: isEn
                          ? "Priority 1: Flagged by BOTH"
                          : "Priorité 1 : Double Alerte (SQL + ML)",
                        count: igamingData.anomalies.overlap,
                        pct: "100%",
                        color: "bg-red-600",
                      },
                      {
                        label: isEn
                          ? "Priority 2: Collusion (Rules Only)"
                          : "Priorité 2 : Partage IP/Device (SQL seul)",
                        count: igamingData.anomalies.rules_only,
                        pct: "82%",
                        color: "bg-amber-500",
                      },
                      {
                        label: isEn
                          ? "Priority 3: Atypical Pace (ML Only)"
                          : "Priorité 3 : Cadence Extrême (ML seul)",
                        count: igamingData.anomalies.ml_only,
                        pct: "85%",
                        color: "bg-blue-600",
                      },
                    ].map((b, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between font-medium">
                          <span>{b.label}</span>
                          <span className="font-mono font-bold">{b.count} sessions</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full ${b.color}`} style={{ width: b.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-7 h-64 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEn
                        ? "Sessions Flagged by Risk Signal"
                        : "Nombre de Sessions par Signal d'Alerte"}
                    </div>
                    <ResponsiveContainer width="100%" height="88%">
                      <BarChart
                        data={riskFlagsChartData}
                        layout="vertical"
                        margin={{ left: 25, right: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <YAxis
                          type="category"
                          dataKey="flag"
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          width={115}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="sessions"
                          name={isEn ? "Sessions" : "Sessions"}
                          radius={[0, 5, 5, 0]}
                        >
                          {riskFlagsChartData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Bottom Slider Controls (Matches GeneticOptimizer Pareto Slider) */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="px-4 py-2 bg-slate-100 dark:bg-[var(--bg)] text-slate-700 dark:text-slate-200 hover:bg-slate-200 disabled:opacity-30 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  ⬅ {isEn ? "Prev Board" : "Précédent"}
                </button>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
                  {isEn ? "Executive Board" : "Tableau Exécutif"} {activeSlide + 1} / 4
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSlide(Math.min(3, activeSlide + 1))}
                  disabled={activeSlide === 3}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                >
                  {isEn ? "Next Board" : "Suivant"} ➡
                </button>
              </div>
            </div>
            <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] text-center max-w-2xl mx-auto px-4">
              <strong>
                {isEn
                  ? "Figure 2. Executive Decision Boards."
                  : "Figure 2. Tableaux de Décision Exécutifs."}
              </strong>{" "}
              {isEn
                ? "Use the buttons above to switch between Marketing ROI, VIP Pareto Concentration, MLflow Churn Drivers, and Anti-Fraud Compliance."
                : "Utilisez les boutons ci-dessus pour naviguer entre le ROI Marketing, la Concentration VIP Pareto, les Facteurs de Churn MLflow et l'Audit Anti-Fraude."}
            </figcaption>
          </figure>
        </section>

        {/* SECTION 3: HOW THE MEDALLION + MLOPS PIPELINE WORKS (Matches 5-Step Flow in GeneticOptimizer) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn
              ? "3. How the Automated Databricks Pipeline Works"
              : "3. Comment Fonctionne le Pipeline Automatisé sur Databricks ?"}
          </h2>
          <p className="mb-8 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "To guarantee that executives never make decisions on corrupted data, the entire pipeline is deployed as a declarative Databricks Asset Bundle (8 chained tasks) where every transformation is guarded by an automated SQL quality gate."
              : "Pour garantir que la direction ne prenne jamais de décision sur des données corrompues, le pipeline est déployé via Databricks Asset Bundles (8 tâches chaînées) où chaque étape est verrouillée par un contrôle qualité SQL bloquant."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 relative font-sans">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>

            <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">
                1
              </div>
              <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
                Bronze
              </strong>
              <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
                {isEn
                  ? "Raw CSV ingestion (4.65M spins) + orphan check."
                  : "Ingestion CSV brute (4,65M spins) + contrôle d'intégrité."}
              </p>
            </div>

            <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">
                2
              </div>
              <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
                Silver
              </strong>
              <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
                {isEn
                  ? "Player-Session-Spin join & net_revenue calculation."
                  : "Jointure Joueur-Session-Spin & calcul du revenu net."}
              </p>
            </div>

            <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">
                3
              </div>
              <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
                Gold
              </strong>
              <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
                {isEn
                  ? "4 business tables reconciled to the cent with Silver."
                  : "4 tables métier réconciliées au centime près avec Silver."}
              </p>
            </div>

            <div className="bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">
                4
              </div>
              <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
                MLflow UC
              </strong>
              <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
                {isEn
                  ? "Registers @champion model & scores 6,857 active players."
                  : "Enregistre le modèle @champion & score les 6 857 actifs."}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-white dark:bg-[var(--bg-elevated)] p-4 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-sm text-center relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold mb-3 border-2 border-white shadow">
                5
              </div>
              <strong className="text-sm text-slate-900 dark:text-[var(--text)] block mb-1">
                Text-to-SQL
              </strong>
              <p className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
                {isEn
                  ? "4 AST safety shields for 0.3s self-service queries."
                  : "4 boucliers AST pour interroger Gold en 0,3 seconde."}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center font-sans">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[var(--bg-elevated)] text-slate-600 dark:text-[var(--text-muted)] rounded-full text-xs sm:text-sm font-medium border border-slate-200 dark:border-[var(--border)]">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isEn
                ? "Fast CI/CD Loop: Validated on a 5% deterministic sample (igaming_dev) in 3s before production deployment"
                : "Boucle CI/CD rapide : Validé sur un échantillon déterministe de 5 % (igaming_dev) en 3s avant déploiement en production"}
            </span>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE TEXT-TO-SQL COPILOT */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-sans mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            {isEn
              ? "4. Self-Service Executive Copilot (Guarded Text-to-SQL)"
              : "4. Copilote Décisionnel en Libre-Service (Text-to-SQL Gouverné)"}
          </h2>
          <p className="mb-6 text-sm sm:text-base text-slate-600 dark:text-[var(--text-muted)]">
            {isEn
              ? "Why build Text-to-SQL? When a VIP Director asks 'Which whales are at risk of churning this week?', waiting 48 hours for a Data Analyst to send an Excel file means losing the player. Our copilot translates natural language into Databricks SQL in 0.3 seconds, while 4 safety shields prevent any hallucinated column or destructive query."
              : "Pourquoi avoir conçu ce moteur Text-to-SQL ? Lorsqu'un Directeur VIP demande « Quels gros joueurs risquent de partir cette semaine ? », attendre 48 heures un export Excel fait perdre le joueur. Ce copilote traduit la question en SQL Databricks en 0,3 seconde, tandis que 4 boucliers bloquent toute colonne inventée ou requête dangereuse."}
          </p>

          <TextToSqlSandbox isEn={isEn} />
        </section>

        {/* CONCLUSION / REPO (Matches GeneticOptimizer Conclusion Card) */}
        <section className="bg-slate-900 text-slate-300 p-8 rounded-xl font-sans shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">
            {isEn
              ? "Production Governance, CI/CD & Open Source"
              : "Gouvernance en Production, CI/CD & Open Source"}
          </h3>
          <p className="text-sm mb-6 leading-relaxed text-left md:text-justify">
            {isEn ? (
              <>
                Every commit is verified by a local CI gate (
                <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">
                  make check
                </code>
                ) that runs 14 AST guardrail tests, validates SQL syntax with{" "}
                <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">
                  sqlglot
                </code>
                , and dry-runs{" "}
                <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">
                  databricks bundle sync
                </code>{" "}
                before deploying the 8-task workflow to Unity Catalog.
              </>
            ) : (
              <>
                Chaque modification est vérifiée par une porte CI automatisée (
                <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">
                  make check
                </code>
                ) qui exécute 14 tests de sécurité AST, valide la syntaxe SQL avec{" "}
                <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">
                  sqlglot
                </code>{" "}
                et vérifie la synchronisation du bundle Databricks avant de déployer le workflow de 8
                tâches dans Unity Catalog.
              </>
            )}
          </p>
          <a
            href="https://github.com/Vertu5/igaming-databricks-lakehouse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-slate-900 font-bold px-6 py-2.5 rounded shadow hover:bg-slate-100 transition-colors"
          >
            {isEn
              ? "View Full Source Code (SQL, MLflow & Text-to-SQL) on GitHub"
              : "Voir le code source complet (SQL, MLflow & Text-to-SQL) sur GitHub"}
          </a>
        </section>
      </main>
    </article>
  );
}
