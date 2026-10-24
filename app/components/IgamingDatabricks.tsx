"use client";

import React, { useMemo } from "react";
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
import {
  Database,
  TrendingUp,
  Sparkles,
  Layers,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import TextToSqlSandbox from "./igaming/TextToSqlSandbox";
import { useLang } from "@/app/lib/i18n";
import igamingData from "../data/igaming.json";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function IgamingDatabricks() {
  const { lang } = useLang();
  const isEn = lang === "en";
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

  return (
    <div className="space-y-10 text-[var(--text)]">
      {/* HERO: CONCISE EXECUTIVE SUMMARY + 6 VISUAL KPIs */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isEn
                ? "Databricks Lakehouse • Business Insights, MLflow & Live Text-to-SQL"
                : "Databricks Lakehouse • Insights Business, MLflow & Text-to-SQL Interactif"}
            </span>
          </div>

          <a
            href="https://github.com/Vertu5/igaming-databricks-lakehouse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-1.5 text-xs font-mono text-[var(--text)] hover:border-[var(--accent)] transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>GitHub: igaming-databricks-lakehouse</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
            {isEn
              ? "From 4.65M Slot Spins to Executive Decisions"
              : "De 4,65 Millions de Spins aux Décisions Stratégiques"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl">
            {isEn
              ? "How do we optimize acquisition spend, retain VIPs before they churn, detect collusion, and let non-technical managers query Databricks safely in 3 seconds?"
              : "Comment optimiser le budget marketing, retenir les VIP avant leur départ, détecter la fraude et permettre aux managers d'interroger Databricks en 3 secondes sans connaître le SQL ?"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: isEn ? "Net Casino Revenue (GGR)" : "Revenu Net Casino (GGR)",
              val: `€${(kpi.ggr / 1000).toFixed(1)}K`,
              sub: isEn ? "7.08% Hold Rate" : "Marge (Hold) : 7,08 %",
              color: "text-emerald-400",
            },
            {
              label: isEn ? "Total Bets (Turnover)" : "Volume Total Misé",
              val: `€${(kpi.turnover / 1_000_000).toFixed(2)}M`,
              sub: "92.92% RTP",
              color: "text-blue-400",
            },
            {
              label: isEn ? "VIP Concentration" : "Concentration VIP",
              val: "40.8%",
              sub: isEn ? "of GGR from 1% players (69 VIPs)" : "du GGR par 1 % des joueurs (69 VIP)",
              color: "text-amber-400",
            },
            {
              label: isEn ? "GGR at Churn Risk (ML)" : "GGR à Risque (MLflow)",
              val: "€221.5K",
              sub: isEn ? "Scored by @champion model" : "Scoré par le modèle @champion",
              color: "text-rose-400",
            },
            {
              label: isEn ? "Best Channel ROI" : "Meilleur Canal (Organic)",
              val: "€90.57",
              sub: isEn ? "GGR/player (vs €41.72 Referral)" : "GGR/inscrit (vs 41,72 € Referral)",
              color: "text-purple-400",
            },
            {
              label: isEn ? "High-Risk Sessions" : "Sessions Critiques",
              val: "10 High / 389 Med",
              sub: isEn ? "Out of 46,690 sessions" : "Sur 46 690 sessions",
              color: "text-cyan-400",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-3.5 flex flex-col justify-between"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {item.label}
              </span>
              <span className={`mt-1 font-display text-xl sm:text-2xl font-bold ${item.color}`}>
                {item.val}
              </span>
              <span className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE TEXT-TO-SQL TESTER */}
      <TextToSqlSandbox isEn={isEn} />

      {/* SECTION 2: MARKETING CHANNEL ROI */}
      <SqlShowcaseLayout
        isEn={isEn}
        sqlLabel="Gold Table: gold_channel_performance"
        title={
          isEn
            ? "2. Marketing Decision: Quality Beats Volume (Organic Yields 2.2x More Than Referral)"
            : "2. Décision Marketing : La Qualité Bat le Volume (Organic Rapporte 2,2x Plus que Referral)"
        }
        description={
          isEn
            ? "Activation rate is identical across all channels (~85%), proving that ROI differences come purely from player betting intensity and hold rate."
            : "Le taux d'activation est identique sur tous les canaux (~85 %) : l'écart de rentabilité provient donc uniquement de la valeur des joueurs acquis."
        }
        sqlQuery={igamingData.channels.sql}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-3.5">
              <div className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                {isEn ? "Why We Used LEFT JOIN" : "Pourquoi un LEFT JOIN"}
              </div>
              <div className="mt-1 font-semibold">
                {isEn
                  ? "1,143 registered players never spun (14.3%)"
                  : "1 143 inscrits n'ont jamais joué (14,3 %)"}
              </div>
              <p className="mt-1 text-[var(--text-muted)]">
                {isEn
                  ? "An INNER JOIN hides unactivated signups and artificially inflates channel ARPU."
                  : "Un INNER JOIN classique masque les inscrits inactifs et gonfle artificiellement le revenu moyen."}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
              <div className="font-mono text-[10px] uppercase text-emerald-400">
                {isEn ? "Key Data Finding" : "Constat Chiffré"}
              </div>
              <div className="mt-1 font-semibold text-emerald-300">
                {isEn
                  ? "Organic: €90.57/signup vs Referral: €41.72"
                  : "Organic : 90,57 €/inscrit contre 41,72 € en Referral"}
              </div>
              <p className="mt-1 text-[var(--text-muted)]">
                {isEn
                  ? "Organic generates €208.0K GGR (8.76% hold) while Referral has the lowest hold (5.25%)."
                  : "Organic génère 208,0 k€ de GGR (marge 8,76 %) tandis que Referral tombe à 5,25 % de marge."}
              </p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3.5">
              <div className="font-mono text-[10px] uppercase text-blue-400">
                {isEn ? "Business Action" : "Décision Business"}
              </div>
              <div className="mt-1 font-semibold text-blue-300">
                {isEn
                  ? "Shift budget to SEO/Organic & cap Referral bonuses"
                  : "Réallouer le budget vers SEO/Organic & plafonner Referral"}
              </div>
              <p className="mt-1 text-[var(--text-muted)]">
                {isEn
                  ? "Referral attracts low-margin bonus hunters; Affiliate & Organic bring the real whales."
                  : "Le parrainage attire des chasseurs de bonus à faible marge ; Organic et Affiliate apportent les vrais VIP."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="h-72 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-2">
                {isEn
                  ? "GGR per Registered vs Active Player (€)"
                  : "GGR par Joueur Inscrit vs Joueur Actif (€)"}
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={channelChartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="channel" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="€" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar
                    dataKey="ggrPerPlayer"
                    name={isEn ? "GGR / Registered (€)" : "GGR / Inscrit (€)"}
                    fill="#10b981"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="ggrPerActive"
                    name={isEn ? "GGR / Active (€)" : "GGR / Actif (€)"}
                    fill="#3b82f6"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-72 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-2">
                {isEn
                  ? "Total Channel GGR (in € Thousands)"
                  : "Contribution au GGR Total par Canal (en k€)"}
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={channelChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} unit="k€" />
                  <YAxis
                    type="category"
                    dataKey="channel"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    width={85}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar
                    dataKey="totalGgrK"
                    name={isEn ? "Total GGR (k€)" : "GGR Total (k€)"}
                    radius={[0, 6, 6, 0]}
                  >
                    {channelChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SqlShowcaseLayout>

      {/* SECTION 3: PARETO VIP CONCENTRATION & RFM SEGMENTS */}
      <SqlShowcaseLayout
        isEn={isEn}
        sqlLabel="Gold Table: gold_player_value (RFM & Pareto)"
        title={
          isEn
            ? "3. VIP & Retention Decision: 1% of Players Drive 40.8% of Revenue, and 413 High-Value Players Are Slipping Away"
            : "3. Décision VIP & Rétention : 1 % des Joueurs Génèrent 40,8 % du Revenu, et 413 Gros Joueurs Décrochent"
        }
        description={
          isEn
            ? "Because 32.7% of active players are net winners (negative GGR), ranking players by GGR distorts concentration. Ranking by Turnover + RFM exposes both the 69 VIP whales and the 413 high-value players at risk."
            : "Comme 32,7 % des joueurs actifs sont gagnants nets (GGR négatif), segmenter sur les mises (Turnover) + scores RFM permet d'isoler les 69 VIP et les 413 gros joueurs en train de décrocher."
        }
        sqlQuery={`${igamingData.segments.sql}\n\n-- Pareto decile query:\n${igamingData.pareto.sql}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="h-80 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {isEn
                  ? "Pareto Curve: Top 10% Players = 64.2% of All Bets"
                  : "Courbe de Pareto : Top 10 % Joueurs = 64,2 % des Mises"}
              </span>
              <span className="font-mono text-[11px] text-amber-400 font-bold">Top 20% = 80.1%</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart data={paretoChartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeShare"
                  name={isEn ? "Cumulative Turnover (%)" : "Mises Cumulées (%)"}
                  fill="rgba(59,130,246,0.18)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="turnoverShare"
                  name={isEn ? "Decile Share (%)" : "Part du Décile (%)"}
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {isEn
                  ? "RFM Segments: GGR (k€) vs Bets at Risk (k€)"
                  : "Segments RFM : GGR (k€) vs Mises des Joueurs à Risque (k€)"}
              </span>
              <span className="font-mono text-[11px] text-rose-400 font-bold">
                {isEn ? "413 At-Risk Whales (€553.8k bets)" : "413 Gros Joueurs à Risque (553,8 k€ misés)"}
              </span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={segmentChartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="segment" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="k€" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar
                  dataKey="ggrK"
                  name={isEn ? "Net GGR (k€)" : "GGR Net (k€)"}
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="turnoverK"
                  name={isEn ? "Total Bets (k€)" : "Volume Misé (k€)"}
                  fill="#f59e0b"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SqlShowcaseLayout>

      {/* SECTION 4: WHY MLFLOW IN PRODUCTION? CHURN DRIVERS & K-MEANS PERSONAS */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold">
              {isEn
                ? "4. Data Science & MLflow in Production: Predicting Churn Before It Happens (AUC = 0.75)"
                : "4. Data Science & MLflow en Production : Prédire le Départ Avant qu'il n'Arrive (AUC = 0,75)"}
            </h3>
          </div>
          <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
            Unity Catalog: igaming_churn_model@champion (v1)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4 space-y-2">
            <div className="font-mono text-xs font-bold text-emerald-400">
              {isEn
                ? "Insight #1: Regularity Protects Against Churn Far More Than Spend"
                : "Insight #1 : L'Habitude de Jeu Fidélise Beaucoup Plus que le Montant Misé"}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {isEn
                ? "Standardized logistic regression weights: green negative bars retain the player, red positive bars increase 30-day churn."
                : "Poids standardisés du modèle @champion : les barres vertes réduisent le risque de départ, le rouge l'augmente."}
            </p>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={churnDriversData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis type="number" domain={[-1, 0.3]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    width={150}
                  />
                  <ReferenceLine x={0} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
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
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4 space-y-2">
            <div className="font-mono text-xs font-bold text-purple-400">
              {isEn
                ? "Insight #2: K-Means Personas & Expected GGR at Risk (gold_player_ml_scores)"
                : "Insight #2 : Personas K-Means & GGR à Risque Scoré en Batch (gold_player_ml_scores)"}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {isEn
                ? "Why K-Means + MLflow? It separates High-Frequency Grinders from VIP High-Rollers and quantifies exact € at risk per persona."
                : "Pourquoi K-Means + MLflow ? Pour distinguer les joueurs réguliers des gros parieurs VIP et chiffrer le GGR à risque en euros."}
            </p>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personaChartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="persona" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="k€" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar
                    dataKey="totalGgrK"
                    name={isEn ? "Total GGR (k€)" : "GGR Total (k€)"}
                    fill="#8b5cf6"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="ggrAtRiskK"
                    name={isEn ? "GGR at Risk of Churn (k€)" : "GGR à Risque de Churn (k€)"}
                    fill="#f43f5e"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: FRAUD, COLLUSION & RESPONSIBLE GAMING */}
      <SqlShowcaseLayout
        isEn={isEn}
        sqlLabel="Gold Table: gold_risk_sessions + Isolation Forest ML"
        title={
          isEn
            ? "5. Fraud & Compliance Decision: Why Combine Business Rules (399 Sessions) With Unsupervised ML (467 Anomalies)?"
            : "5. Décision Fraude & Conformité : Pourquoi Combiner Règles Métier (399 Sessions) et Isolation Forest (467 Anomalies) ?"
        }
        description={
          isEn
            ? "A naive 10-hour session rule returns 0 rows because the longest session is 1.5h (5,400s). Calibrating rules on 99th percentiles + shared IP/device and crossing them with Isolation Forest isolates the 67 highest-priority sessions."
            : "Un filtre naïf de 10 heures renvoie 0 résultat car la plus longue session dure 1h30 (5 400 s). Le calibrage sur le 99e centile + partage d'IP/appareil croisé avec Isolation Forest isole 67 sessions critiques prioritaires."
        }
        sqlQuery={igamingData.risk_levels.sql}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-3">
              <div className="font-mono text-xs font-bold uppercase text-amber-400">
                {isEn
                  ? "Rule-Based vs Isolation Forest Overlap"
                  : "Croisement Règles SQL vs ML Isolation Forest"}
              </div>
              {[
                {
                  label: isEn
                    ? "Priority 1: Flagged by BOTH Rules & ML"
                    : "Priorité 1 : Double Alerte (Règles SQL + ML)",
                  count: igamingData.anomalies.overlap,
                  pct: "100%",
                  color: "bg-rose-500",
                  desc: isEn
                    ? "Immediate compliance investigation"
                    : "Audit immédiat par l'équipe fraude",
                },
                {
                  label: isEn
                    ? "Priority 2: Discrete Collusion (Rules Only)"
                    : "Priorité 2 : Collusion Discrète (Règles SQL seules)",
                  count: igamingData.anomalies.rules_only,
                  pct: "83%",
                  color: "bg-amber-500",
                  desc: isEn
                    ? "Shared IP/device or geo mismatch with normal bet pace"
                    : "Partage d'IP/appareil ou pays incohérent à rythme normal",
                },
                {
                  label: isEn
                    ? "Priority 3: Atypical Pace/Bet (ML Only)"
                    : "Priorité 3 : Comportement Atypique (ML seul)",
                  count: igamingData.anomalies.ml_only,
                  pct: "85%",
                  color: "bg-blue-500",
                  desc: isEn
                    ? "Extreme multivariate bet/duration without shared IP"
                    : "Combinaison durée/cadence/mise extrême sans partage d'IP",
                },
              ].map((b, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold">{b.label}</span>
                    <span className="font-bold">{b.count} sessions</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${b.color}`} style={{ width: b.pct }} />
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-72 rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4">
            <div className="font-mono text-xs text-[var(--text-muted)] mb-2">
              {isEn
                ? "Sessions Triggering Each Risk Signal (out of 46,690 sessions)"
                : "Nombre de Sessions par Signal de Risque (sur 46 690 sessions)"}
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={riskFlagsChartData}
                layout="vertical"
                margin={{ top: 5, right: 25, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="flag"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar
                  dataKey="sessions"
                  name={isEn ? "Flagged Sessions" : "Sessions Signalées"}
                  radius={[0, 6, 6, 0]}
                >
                  {riskFlagsChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SqlShowcaseLayout>

      {/* SECTION 6: VISUAL LAKEHOUSE & CI/CD PIPELINE FLOW */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-lg sm:text-xl font-bold">
              {isEn
                ? "6. Under the Hood: 8-Task Databricks Pipeline & 5% Dev Sandbox"
                : "6. Architecture Industrielle : Pipeline Databricks en 8 Tâches & Sandbox Dev à 5 %"}
            </h3>
          </div>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {isEn
              ? "Why a 5% sample? Test changes in 3s instead of re-scanning 4.65M spins"
              : "Pourquoi l'échantillon 5 % ? Tester en 3s au lieu de rescanner 4,65M de spins"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: "1. BRONZE + GATE",
              title: isEn ? "Raw Ingestion" : "Ingestion Brute",
              metric: "8K players • 4.65M spins",
              gate: "test_bronze.sql (PK & Orphans)",
            },
            {
              step: "2. SILVER + GATE",
              title: isEn ? "Clean & Join" : "Nettoyage & Jointure",
              metric: "net_revenue = bet - win",
              gate: "test_silver.sql (0 spin lost)",
            },
            {
              step: "3. GOLD + GATE",
              title: isEn ? "4 Business Tables" : "4 Tables Métier Gold",
              metric: "€574.3K GGR reconciled",
              gate: "test_gold.sql (Silver == Gold)",
            },
            {
              step: "4. MLFLOW + GATE",
              title: isEn ? "UC Registry & Scoring" : "Registre UC & Scoring",
              metric: "6,857 players scored",
              gate: "test_ml.sql (probs in [0, 1])",
            },
          ].map((stage, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  {stage.step}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div className="font-semibold text-sm">{stage.title}</div>
              <div className="font-mono text-xs text-emerald-400 font-bold">{stage.metric}</div>
              <div className="pt-2 border-t border-[var(--border)] font-mono text-[10px] text-[var(--text-muted)]">
                Gate: {stage.gate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
