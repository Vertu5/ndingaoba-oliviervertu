"use client";

import React, { useMemo, useState } from "react";
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
import igamingData from "../../data/igaming.json";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--bg-elevated)",
  borderColor: "var(--border)",
  borderRadius: "8px",
  color: "var(--text)",
  fontSize: "12px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
};

export default function DecisionExplorerSection({ isEn }: { isEn: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSlideSql, setShowSlideSql] = useState(false);

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
          {/* Top Navigation Pills + SQL Toggle */}
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
                      : "bg-slate-100 dark:bg-[var(--bg)] text-slate-700 dark:text-[var(--text-muted)] hover:bg-slate-200 dark:hover:bg-[var(--border)] dark:hover:text-[var(--text)]"
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowSlideSql(!showSlideSql)}
              className="text-xs bg-slate-100 dark:bg-[var(--bg)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-[var(--text)] py-1.5 px-3 rounded border border-slate-200 dark:border-[var(--border)] font-medium transition-colors cursor-pointer"
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
            <pre className="bg-slate-100 dark:bg-[#0f1014] text-emerald-800 dark:text-emerald-300 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-slate-200 dark:border-[var(--border)]">
              {slides[activeSlide].sql}
            </pre>
          )}

          {/* SLIDE 0: MARKETING ROI CHARTS */}
          {activeSlide === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="h-72 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
                  {isEn
                    ? "GGR per Registered vs Active Player (€)"
                    : "Revenu Net (GGR) par Inscrit vs par Actif (€)"}
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={channelChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="channel" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} unit="€" />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
                    />
                    <Bar
                      dataKey="ggrPerPlayer"
                      name={isEn ? "GGR / Signup (€)" : "GGR / Inscrit (€)"}
                      fill="#3b82f6"
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
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} unit="k€" />
                    <YAxis
                      type="category"
                      dataKey="channel"
                      tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
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
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
                  {isEn
                    ? "Pareto Curve: Top 10% Players = 64.2% of Bets"
                    : "Courbe de Pareto : Top 10 % Joueurs = 64,2 % des Mises"}
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <ComposedChart data={paretoChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} unit="%" domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeShare"
                      name={isEn ? "Cumulative Bets (%)" : "Mises Cumulées (%)"}
                      fill="rgba(59,130,246,0.18)"
                      stroke="#3b82f6"
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
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
                  {isEn
                    ? "RFM Segments: Net GGR (k€) vs Bets at Risk (k€)"
                    : "Segments RFM : GGR Net (k€) vs Volume Misé (k€)"}
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={segmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="segment" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} unit="k€" />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
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
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      type="number"
                      domain={[-1, 0.3]}
                      tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                      width={145}
                    />
                    <ReferenceLine x={0} stroke="var(--text-muted)" />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
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
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
                  {isEn
                    ? "K-Means Personas: Total GGR vs GGR at Risk (k€)"
                    : "Personas K-Means : GGR Total vs GGR à Risque (k€)"}
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={personaChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="persona" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} unit="k€" />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
                    />
                    <Bar
                      dataKey="totalGgrK"
                      name={isEn ? "Total GGR (k€)" : "GGR Total (k€)"}
                      fill="#3b82f6"
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
                <div className="text-xs font-bold uppercase text-slate-800 dark:text-[var(--text)]">
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
                    color: "bg-rose-500",
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
                    color: "bg-blue-500",
                  },
                ].map((b, i) => (
                  <div key={i} className="space-y-1 text-xs text-slate-800 dark:text-[var(--text)]">
                    <div className="flex justify-between font-medium">
                      <span>{b.label}</span>
                      <span className="font-mono font-bold">{b.count} sessions</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[var(--border)] overflow-hidden">
                      <div className={`h-full ${b.color}`} style={{ width: b.pct }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7 h-64 bg-slate-50 dark:bg-[var(--bg)] p-4 rounded-lg border border-slate-200 dark:border-[var(--border)]">
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="flag"
                      tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                      width={115}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
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

          {/* Bottom Slider Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[var(--border)]">
            <button
              type="button"
              onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
              disabled={activeSlide === 0}
              className="px-4 py-2 bg-slate-100 dark:bg-[var(--bg)] text-slate-700 dark:text-[var(--text)] hover:bg-slate-200 dark:hover:bg-[var(--border)] disabled:opacity-30 font-bold rounded-lg text-xs transition-colors border border-slate-200 dark:border-[var(--border)] cursor-pointer"
            >
              ⬅ {isEn ? "Prev Board" : "Précédent"}
            </button>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-[var(--text-muted)]">
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
  );
}
