"use client";

import React, { useState } from "react";
import { useLang } from "@/app/lib/i18n";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import igamingData from "@/app/data/igaming.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Database,
  ShieldCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  Cpu,
  GitBranch,
  Terminal,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];

interface SandboxPreset {
  id: string;
  label: { fr: string; en: string };
  question: { fr: string; en: string };
  category: "valid" | "self_corrected" | "blocked";
  firstAttemptSql?: string;
  firstAttemptError?: { fr: string; en: string };
  finalSql: string;
  status: "ok" | "rejected";
  badge: { fr: string; en: string };
  resultRows?: Record<string, string | number>[];
}

const SANDBOX_PRESETS: SandboxPreset[] = [
  {
    id: "vip_top5",
    label: { fr: "Top 5 joueurs VIP (Mises & GGR)", en: "Top 5 VIP Players (Turnover & GGR)" },
    question: {
      fr: "Quels sont les 5 joueurs VIP qui ont généré le plus de mises et quel est leur GGR ?",
      en: "Who are the top 5 VIP players by turnover and what is their GGR?",
    },
    category: "valid",
    finalSql: `SELECT player_id, country, acquisition_channel, turnover, ggr, sessions\nFROM workspace.igaming.gold_player_stats\nWHERE segment = 'VIP'\nORDER BY turnover DESC\nLIMIT 5`,
    status: "ok",
    badge: {
      fr: "Validé AST • Testé sur igaming_dev (5%) • Exécuté sur prod",
      en: "AST Validated • Pre-checked on igaming_dev (5%) • Executed on prod",
    },
    resultRows: igamingData.top_vip.rows.slice(0, 5),
  },
  {
    id: "channel_roi",
    label: { fr: "Rentabilité par canal d'acquisition", en: "Profitability by Acquisition Channel" },
    question: {
      fr: "Quel canal d'acquisition rapporte le plus de GGR par joueur inscrit ?",
      en: "Which acquisition channel generates the highest GGR per registered player?",
    },
    category: "valid",
    finalSql: `SELECT acquisition_channel, registered_players, active_players, ggr, ggr_per_registered_player, hold_rate\nFROM workspace.igaming.gold_channel_performance\nORDER BY ggr_per_registered_player DESC\nLIMIT 100`,
    status: "ok",
    badge: {
      fr: "Validé AST • Testé sur igaming_dev (5%) • Exécuté sur prod",
      en: "AST Validated • Pre-checked on igaming_dev (5%) • Executed on prod",
    },
    resultRows: igamingData.channels.rows,
  },
  {
    id: "self_correct_revenue",
    label: {
      fr: "Auto-Correction : Hallucination colonne 'revenue'",
      en: "Self-Correction: Hallucinated 'revenue' column",
    },
    question: {
      fr: "Donne-moi le chiffre d'affaires moyen par segment de joueur.",
      en: "Show me the average revenue by player segment.",
    },
    category: "self_corrected",
    firstAttemptSql: `SELECT segment, ROUND(AVG(revenue), 2) AS avg_rev\nFROM gold_player_value\nGROUP BY segment`,
    firstAttemptError: {
      fr: "Rejeté par Bouclier 3 (sqlglot AST) : Unknown column (possible hallucination): revenue → Renvoyé au LLM avec le Data Dictionary.",
      en: "Rejected by Shield 3 (sqlglot AST): Unknown column (possible hallucination): revenue → Fed back to LLM with Data Dictionary.",
    },
    finalSql: `SELECT segment, COUNT(*) AS players, ROUND(SUM(ggr), 0) AS ggr, ROUND(SUM(turnover), 0) AS turnover\nFROM workspace.igaming.gold_player_value\nGROUP BY segment\nORDER BY ggr DESC\nLIMIT 100`,
    status: "ok",
    badge: {
      fr: "Auto-corrigé en 2 tentatives (revenue ➔ ggr) • Exécuté sur prod",
      en: "Self-corrected in 2 attempts (revenue ➔ ggr) • Executed on prod",
    },
    resultRows: igamingData.segments.rows,
  },
  {
    id: "blocked_drop",
    label: {
      fr: "Injection bloquée : DROP / Accès Bronze",
      en: "Blocked Injection: DROP / Raw Bronze Access",
    },
    question: {
      fr: "Supprime les sessions à haut risque ou lis directement bronze_spins.",
      en: "Delete high-risk sessions or read directly from bronze_spins.",
    },
    category: "blocked",
    finalSql: `DELETE FROM workspace.igaming.gold_risk_sessions WHERE risk_level = 'High';\nSELECT * FROM workspace.igaming.bronze_spins;`,
    status: "rejected",
    badge: {
      fr: "Bloqué par les Garde-fous AST (Lecture seule SELECT + Isolation Gold uniquement)",
      en: "Blocked by AST Guardrails (Read-only SELECT + Gold-layer isolation only)",
    },
  },
];

export default function IgamingDatabricks() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const [selectedPresetId, setSelectedPresetId] = useState<string>("self_correct_revenue");

  const kpi = igamingData.kpis.rows[0];
  const netWinners = igamingData.net_winners.rows[0];
  const activePreset = SANDBOX_PRESETS.find((p) => p.id === selectedPresetId) || SANDBOX_PRESETS[0];

  const channelChartData = igamingData.channels.rows.map((r) => ({
    channel: r.acquisition_channel,
    ggrPerPlayer: r.ggr_per_registered_player,
    totalGgr: Math.round(r.ggr),
    holdPct: Number((r.hold_rate * 100).toFixed(2)),
    registered: r.registered_players,
  }));

  const paretoChartData = igamingData.pareto.rows.map((r) => ({
    decile: `${Math.round(r.top_share_of_players * 100)}%`,
    turnoverShare: Number((r.cumulative_share_of_turnover * 100).toFixed(1)),
  }));

  const segmentChartData = igamingData.segments.rows.map((r) => ({
    segment: r.segment,
    ggr: Math.round(r.ggr),
    turnover: Math.round(r.turnover),
    players: r.players,
    sharePct: Number((r.share_of_ggr * 100).toFixed(1)),
  }));

  const churnCoefs = Object.entries(igamingData.churn.standardized_coefficients)
    .map(([feature, coef]) => ({
      feature,
      coef: Number(coef),
    }))
    .sort((a, b) => a.coef - b.coef);

  return (
    <div className="w-full space-y-12 text-[var(--text)]">
      {/* HERO BANNER */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-blue-400 font-semibold">
              Databricks Lakehouse • Unity Catalog
            </span>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-emerald-400 font-semibold">
              Asset Bundles CI/CD (dev 5% ➔ prod 100%)
            </span>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-purple-400 font-semibold">
              ML & Guarded Text-to-SQL
            </span>
          </div>
          <a
            href="https://github.com/Vertu5/igaming-databricks-lakehouse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 font-mono text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-text)]"
          >
            <GitBranch className="w-4 h-4" />
            {isEn ? "GitHub Repository & Databricks Bundle" : "Dépôt GitHub & Bundle Databricks"}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
          {isEn
            ? "iGaming Lakehouse Architecture, Data Science & Guarded Text-to-SQL on Databricks"
            : "Architecture Lakehouse iGaming, Data Science & Text-to-SQL Sécurisé sur Databricks"}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-4xl leading-relaxed">
          {isEn
            ? "End-to-end medallion pipeline (Bronze ➔ Silver ➔ Gold) processing 4.65M slot spins on Databricks Serverless SQL Warehouse. Built as declarative code with automated assert_true quality gates, fast 5% sample dev environment, RFM/KMeans player segmentation, IsolationForest anomaly detection, Churn modeling (AUC 0.75), and a 4-shield Text-to-SQL engine."
            : "Pipeline médaillon complet (Bronze ➔ Silver ➔ Gold) traitant 4,65 millions de tours de machines à sous sur Databricks Serverless SQL Warehouse. Conçu en Infrastructure-as-Code avec contrôles qualité assert_true bloquants, environnement de test rapide à 5 %, segmentation RFM/KMeans, détection d'anomalies IsolationForest, modèle de Churn (AUC 0,75) et moteur Text-to-SQL à 4 boucliers."}
        </p>

        {/* TOP KPIs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: isEn ? "Total Spins (Bronze/Silver)" : "Tours Joués (Bronze/Silver)",
              val: kpi.spins.toLocaleString("en-US"),
              sub: isEn ? "0 lost rows in join" : "0 perte à la jointure",
            },
            {
              label: isEn ? "Sessions Analyzed" : "Sessions Analysées",
              val: kpi.sessions.toLocaleString("en-US"),
              sub: isEn ? "Max duration: 1.5h" : "Durée max : 1,5h",
            },
            {
              label: isEn ? "Registered / Active" : "Inscrits / Actifs",
              val: `${kpi.registered_players.toLocaleString("en-US")} / ${kpi.active_players.toLocaleString("en-US")}`,
              sub: isEn ? "85.7% activation rate" : "85,7 % d'activation",
            },
            {
              label: isEn ? "Total Turnover (Bets)" : "Mises Totales (Turnover)",
              val: `€${(kpi.turnover / 1e6).toFixed(2)}M`,
              sub: isEn ? "Top 10% = 64.2% of bets" : "Top 10 % = 64,2 % des mises",
            },
            {
              label: isEn ? "Net Gaming Revenue (GGR)" : "Revenu Net Casino (GGR)",
              val: `€${(kpi.ggr / 1e3).toFixed(1)}K`,
              sub: isEn ? "69 VIPs = 40.8% of GGR" : "69 VIP = 40,8 % du GGR",
            },
            {
              label: isEn ? "Global RTP / Net Winners" : "RTP Global / Gagnants Nets",
              val: `${(kpi.rtp * 100).toFixed(2)}%`,
              sub: isEn
                ? `${(netWinners.net_winner_share * 100).toFixed(1)}% net winners`
                : `${(netWinners.net_winner_share * 100).toFixed(1)} % gagnants nets`,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-3.5 flex flex-col justify-between"
            >
              <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                {item.label}
              </span>
              <span className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[var(--text)]">
                {item.val}
              </span>
              <span className="mt-1 font-mono text-[11px] text-[var(--accent)]">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MEDALLION + CI/CD ARCHITECTURE */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-xl font-bold">
            {isEn
              ? "1. Medallion Architecture & Declarative CI/CD on Databricks"
              : "1. Architecture Médaillon & CI/CD Déclaratif sur Databricks"}
          </h3>
        </div>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {isEn
            ? "Instead of running manual notebooks on full production tables, the pipeline is packaged as a Databricks Asset Bundle (databricks.yml) with 8 chained tasks (SQL + Serverless MLflow Notebook). Every layer — including MLflow batch scoring — is followed by a blocking quality gate using assert_true(). Developers iterate in seconds on the dev target (5% deterministic modulo sample: player_id % 20 = 0 preserving referential integrity across all tables) before deploying to prod."
            : "Au lieu d'exécuter des notebooks manuels directement en production, le pipeline est industrialisé via Databricks Asset Bundles (databricks.yml) en 8 tâches chaînées (SQL + Notebook Serverless MLflow). Chaque couche — y compris le scoring MLflow en batch — est suivie d'un contrôle qualité bloquant (assert_true()). Les itérations se font en quelques secondes sur l'environnement dev (échantillon déterministe de 5 % : player_id % 20 = 0 préservant l'intégrité référentielle) avant le déploiement en prod."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "BRONZE + GATE",
              title: isEn ? "Raw Delta Ingestion" : "Ingestion Delta Brute",
              desc: isEn
                ? "Ingests players.csv, sessions.csv, and spins.csv from Unity Catalog Volume via read_files(). Gate checks primary key uniqueness, non-empty tables, _rescued_data IS NULL, and zero orphan spins."
                : "Ingère players.csv, sessions.csv et spins.csv depuis un Volume Unity Catalog via read_files(). Le gate vérifie l'unicité des clés, _rescued_data IS NULL et l'absence de spins orphelins.",
              badge: "01_bronze.sql ➔ test_bronze.sql",
            },
            {
              step: "SILVER + GATE",
              title: isEn ? "Cleaned & Joined Activity" : "Jointure & Nettoyage",
              desc: isEn
                ? "Joins players, sessions, and spins into silver_player_activity, computes net_revenue (bet - win), filters invalid bets. Gate verifies zero join fan-out and 100% spin conservation."
                : "Relie joueurs, sessions et tours dans silver_player_activity, calcule net_revenue (bet - win) et filtre les mises invalides. Le gate vérifie l'absence de duplication et 100 % des tours conservés.",
              badge: "02_silver.sql ➔ test_silver.sql",
            },
            {
              step: "GOLD + GATE",
              title: isEn ? "4 Business Tables" : "4 Tables Métier Gold",
              desc: isEn
                ? "Builds gold_channel_performance, gold_player_value (RFM), gold_risk_sessions (p99 thresholds + shared IP/device), and gold_player_stats. Gate reconciles Gold sums against Silver."
                : "Construit gold_channel_performance, gold_player_value (RFM), gold_risk_sessions (seuils p99 + partage IP/appareil) et gold_player_stats. Le gate réconcilie les sommes Gold avec Silver.",
              badge: "03_gold.sql ➔ test_gold.sql",
            },
            {
              step: "MLFLOW + UC + GATE",
              title: isEn ? "MLflow Registry & Batch Scoring" : "Registre MLflow UC & Scoring",
              desc: isEn
                ? "Tracks Challenger vs Champion churn runs in MLflow, registers workspace.igaming.igaming_churn_model@champion in Unity Catalog, writes gold_player_ml_scores, and validates probabilities via test_ml.sql."
                : "Suit les modèles Challenger vs Champion dans MLflow, enregistre workspace.igaming.igaming_churn_model@champion dans Unity Catalog, écrit gold_player_ml_scores et vérifie les scores via test_ml.sql.",
              badge: "04_mlflow_production.py ➔ test_ml.sql",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                  {card.step}
                </span>
                <h4 className="mt-1 font-semibold text-base">{card.title}</h4>
                <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-2 border-t border-[var(--border)] font-mono text-[11px] text-emerald-400">
                {card.badge}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SQL SHOWCASE 1: MARKETING CHANNEL ROI */}
      <SqlShowcaseLayout
        isEn={isEn}
        sqlLabel="Executed Databricks SQL Query (Gold Layer)"
        title={
          isEn
            ? "2. Marketing Lever: Acquisition Channel Profitability (GGR per Player vs Volume)"
            : "2. Levier Marketing : Rentabilité par Canal d'Acquisition (GGR par Joueur vs Volume)"
        }
        description={
          isEn
            ? "Using a LEFT JOIN from bronze_players preserves the 1,143 registered players who never spun. Activation is uniform across channels (84.8%–86.4%), proving that profitability differences come from player quality: Organic yields €90.57/player (8.76% hold) vs €67.70 for Affiliate and €41.72 for Referral."
            : "L'utilisation d'un LEFT JOIN depuis bronze_players conserve les 1 143 inscrits sans activité. Le taux d'activation étant uniforme (84,8 % à 86,4 %), l'écart de rentabilité provient de la qualité des joueurs acquis : Organic génère 90,57 €/inscrit (hold 8,76 %) contre 67,70 € pour Affiliate et 41,72 € pour Referral."
        }
        sqlQuery={igamingData.channels.sql}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="channel" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} unit="€" />
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
                  name={isEn ? "GGR / Registered Player (€)" : "GGR / Joueur Inscrit (€)"}
                  radius={[6, 6, 0, 0]}
                >
                  {channelChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                  <th className="py-2 pr-3">{isEn ? "Channel" : "Canal"}</th>
                  <th className="py-2 px-3">{isEn ? "Registered" : "Inscrits"}</th>
                  <th className="py-2 px-3">{isEn ? "Activation" : "Activation"}</th>
                  <th className="py-2 px-3">{isEn ? "Total GGR" : "GGR Total"}</th>
                  <th className="py-2 px-3">{isEn ? "GGR / Reg." : "GGR / Inscrit"}</th>
                  <th className="py-2 pl-3">Hold</th>
                </tr>
              </thead>
              <tbody>
                {igamingData.channels.rows.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--border)]/50">
                    <td className="py-2.5 pr-3 font-semibold text-[var(--text)]">
                      {r.acquisition_channel}
                    </td>
                    <td className="py-2.5 px-3">{r.registered_players}</td>
                    <td className="py-2.5 px-3">{(r.activation_rate * 100).toFixed(1)}%</td>
                    <td className="py-2.5 px-3">€{r.ggr.toLocaleString("en-US")}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      €{r.ggr_per_registered_player}
                    </td>
                    <td className="py-2.5 pl-3">{(r.hold_rate * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SqlShowcaseLayout>

      {/* SQL SHOWCASE 2: VIP CONCENTRATION & RFM SEGMENTS */}
      <SqlShowcaseLayout
        isEn={isEn}
        sqlLabel="Executed Databricks SQL Query (RFM & Window Functions)"
        title={
          isEn
            ? "3. VIP & Customer Value Lever: Pareto Concentration & RFM Segmentation"
            : "3. Levier VIP & Valeur Client : Loi de Pareto & Segmentation RFM"
        }
        description={
          isEn
            ? "The top 10% of active players generate 64.2% of all bets, and the 69 VIP players (top 1%) generate 40.8% of total casino GGR (€234.4K). Meanwhile, 413 high-value players are flagged as 'At risk (high value)' (€553.8K in historical bets) — the #1 priority for CRM reactivation."
            : "Les 10 % de joueurs les plus actifs génèrent 64,2 % des mises, et les 69 joueurs VIP (top 1 %) concentrent 40,8 % du GGR total (234,4 k€). En parallèle, 413 gros joueurs sont identifiés comme « At risk (high value) » (553,8 k€ de mises) : la cible prioritaire pour une campagne de réactivation CRM."
        }
        sqlQuery={`${igamingData.segments.sql}\n\n-- Pareto decile query:\n${igamingData.pareto.sql}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
              {isEn
                ? "Cumulative Share of Turnover by Player Decile"
                : "Part Cumulée des Mises par Décile de Joueurs"}
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paretoChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="decile" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
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
                    dataKey="turnoverShare"
                    name={isEn ? "Cumulative Turnover (%)" : "Mises Cumulées (%)"}
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                  <th className="py-2 pr-3">Segment RFM</th>
                  <th className="py-2 px-3">{isEn ? "Players" : "Joueurs"}</th>
                  <th className="py-2 px-3">{isEn ? "Turnover" : "Mises"}</th>
                  <th className="py-2 px-3">GGR</th>
                  <th className="py-2 pl-3">{isEn ? "GGR Share" : "Part GGR"}</th>
                </tr>
              </thead>
              <tbody>
                {segmentChartData.map((s, i) => (
                  <tr key={i} className="border-b border-[var(--border)]/50">
                    <td className="py-2.5 pr-3 font-semibold text-[var(--text)]">{s.segment}</td>
                    <td className="py-2.5 px-3">{s.players}</td>
                    <td className="py-2.5 px-3">€{s.turnover.toLocaleString("en-US")}</td>
                    <td className="py-2.5 px-3">€{s.ggr.toLocaleString("en-US")}</td>
                    <td className="py-2.5 pl-3 font-bold text-blue-400">{s.sharePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SqlShowcaseLayout>

      {/* SQL SHOWCASE 3: RISK & DATA SCIENCE (ISOLATION FOREST + CHURN + KMEANS) */}
      <SqlShowcaseLayout
        isEn={isEn}
        sqlLabel="Executed Databricks SQL Query (99th Percentile Risk Signals)"
        title={
          isEn
            ? "4. Risk, Compliance & Machine Learning (IsolationForest Anomalies & Churn AUC 0.75)"
            : "4. Risque, Conformité & Machine Learning (Anomalies IsolationForest & Churn AUC 0,75)"
        }
        description={
          isEn
            ? "A naive '> 10 hours' duration threshold returns 0 rows because the longest session in the dataset is 1.5 hours (5,400s). Replacing arbitrary rules with empirical 99th-percentile thresholds (duration ≥ 2,938s, pace ≥ 20 spins/min, max bet ≥ €627.3), geo_mismatch, and multi-account shared device/IP signals isolates an actionable queue of 10 High-risk and 389 Medium-risk sessions."
            : "Un seuil naïf « > 10 heures » renvoie 0 ligne car la plus longue session dure 1,5 h (5 400 s). En remplaçant ce seuil arbitraire par les 99e percentiles empiriques (durée ≥ 2 938 s, cadence ≥ 20 tours/min, mise max ≥ 627,3 €), geo_mismatch et le partage d'appareil/IP entre comptes, on isole une file exploitable de 10 sessions High-risk et 389 Medium-risk."
        }
        sqlQuery={igamingData.risk_levels.sql}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Queue & Flags */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {isEn
                  ? "Rule-Based vs IsolationForest ML"
                  : "Règles Métier vs ML IsolationForest"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isEn
                ? `IsolationForest (1% contamination on log-transformed session features) flags ${igamingData.anomalies.ml_anomalies} sessions vs ${igamingData.anomalies.rule_based_high_medium} High/Medium rule-based sessions. Only ${igamingData.anomalies.overlap} overlap: rules catch multi-accounting & geo mismatches, while ML catches multivariate pace/bet intensity.`
                : `IsolationForest (contamination 1 % sur variables log-transformées) détecte ${igamingData.anomalies.ml_anomalies} sessions atypiques contre ${igamingData.anomalies.rule_based_high_medium} par les règles (High/Medium). Seules ${igamingData.anomalies.overlap} se recoupent : les deux approches sont complémentaires.`}
            </p>
            <div className="space-y-1.5 pt-2 font-mono text-xs">
              {igamingData.risk_levels.rows.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 border-b border-[var(--border)]/40"
                >
                  <span className="font-semibold">{r.risk_level}</span>
                  <span>
                    {r.sessions.toLocaleString("en-US")} sessions ({r.players}{" "}
                    {isEn ? "players" : "joueurs"})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KMeans Behavioural Clustering */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Users className="w-4 h-4" />
              <span>
                {isEn ? "KMeans Behavioural Clusters (k=4)" : "Clusters Comportementaux KMeans (k=4)"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isEn
                ? "Unsupervised clustering on log-scaled behavioural features separates high-frequency bonus buyers (Cluster 1: 11.4% of players ➔ 41.9% of GGR) from high-roller bettors (Cluster 2: avg bet €6.18 ➔ 45.8% of GGR)."
                : "Le clustering non supervisé sépare les acheteurs intensifs de bonus (Cluster 1 : 11,4 % des joueurs ➔ 41,9 % du GGR) des joueurs à fortes mises unitaires (Cluster 2 : mise moy. 6,18 € ➔ 45,8 % du GGR)."}
            </p>
            <div className="space-y-1.5 pt-1 font-mono text-[11px]">
              {igamingData.clusters.map((c) => (
                <div
                  key={c.cluster}
                  className="flex items-center justify-between py-1 border-b border-[var(--border)]/40"
                >
                  <span>
                    C{c.cluster} ({c.players}p • avg €{c.avg_bet})
                  </span>
                  <span className="text-purple-400 font-bold">
                    {(c.share_of_ggr * 100).toFixed(1)}% GGR
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Churn Logistic Regression Baseline */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>
                {isEn
                  ? `30-Day Churn Model (Test AUC = ${igamingData.churn.auc_test})`
                  : `Modèle de Churn à 30j (AUC Test = ${igamingData.churn.auc_test})`}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isEn
                ? `Trained on ${igamingData.churn.players.toLocaleString("en-US")} players (${(igamingData.churn.churn_rate * 100).toFixed(1)}% churn in final 30 days). Regularity (active_days: -0.88, sessions: -0.61) protects against churn far more than raw betting volume.`
                : `Entraîné sur ${igamingData.churn.players.toLocaleString("en-US")} joueurs (${(igamingData.churn.churn_rate * 100).toFixed(1)} % d'inactifs sur les 30 derniers jours). La régularité (active_days : -0,88, sessions : -0,61) protège beaucoup plus contre le départ que le volume misé.`}
            </p>
            <div className="space-y-1 pt-1 font-mono text-[11px]">
              {churnCoefs.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-0.5 border-b border-[var(--border)]/40"
                >
                  <span>{item.feature}</span>
                  <span className={item.coef < 0 ? "text-emerald-400" : "text-rose-400"}>
                    {item.coef > 0 ? `+${item.coef}` : item.coef}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MLflow Experiment Tracking & Unity Catalog Model Registry (@champion) */}
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isEn
                ? "MLflow Production Pipeline • Unity Catalog Model Registry (@champion)"
                : "Pipeline MLflow en Production • Registre de Modèles Unity Catalog (@champion)"}
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              workspace.igaming.igaming_churn_model@champion (v1) ➔ gold_player_ml_scores
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {isEn
              ? "Executed automatically by the 04_mlflow_production.py notebook task inside the Databricks workflow (Run ID 884183058684485): compares Logistic Regression (Test ROC-AUC 0.7437, Brier 0.1875) vs. Gradient Boosting (Test ROC-AUC 0.7395, Brier 0.1878), promotes the best calibrated model to @champion in Unity Catalog, and scores all 6,857 active players into workspace.igaming.gold_player_ml_scores (verified by test_ml.sql)."
              : "Exécuté automatiquement par la tâche notebook 04_mlflow_production.py du workflow Databricks (Run ID 884183058684485) : compare Logistic Regression (ROC-AUC Test 0,7437, Brier 0,1875) face à Gradient Boosting (ROC-AUC Test 0,7395, Brier 0,1878), promeut le modèle le mieux calibré sous l'alias @champion dans Unity Catalog, et score les 6 857 joueurs actifs dans workspace.igaming.gold_player_ml_scores (validé par test_ml.sql)."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono text-xs">
            {igamingData.mlflow.risk_tiers.map((t, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/60 p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text)]">{t.churn_risk_tier}</span>
                  <span className="text-[var(--accent)]">
                    {t.players.toLocaleString("en-US")} {isEn ? "players" : "joueurs"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>
                    {isEn ? "Avg Churn Prob:" : "Prob. Churn Moy.:"}{" "}
                    {(t.avg_churn_prob * 100).toFixed(1)}%
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    €{t.total_ggr_at_risk.toLocaleString("en-US")} {isEn ? "at risk" : "à risque"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SqlShowcaseLayout>

      {/* INTERACTIVE GUARDED TEXT-TO-SQL SANDBOX */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold">
              {isEn
                ? "5. Guarded Text-to-SQL Engine: The 4 Precision Shields & Interactive Demo"
                : "5. Moteur Text-to-SQL Sécurisé : Les 4 Boucliers de Précision & Démo Interactive"}
            </h3>
          </div>
          <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
            {isEn ? "14/14 AST Guardrail Tests Passed" : "14/14 Tests Garde-fous AST Réussis"}
          </span>
        </div>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {isEn
            ? "Connecting an LLM directly to a warehouse is dangerous if it hallucinates columns (e.g., inventing 'revenue' instead of 'ggr') or runs expensive/destructive queries. Our engine wraps the LLM in 4 shields and pre-tests queries on the 5% dev sample before touching production."
            : "Brancher un LLM directement sur un entrepôt de données est risqué s'il hallucine une colonne (ex. inventer « revenue » au lieu de « ggr ») ou lance une requête lourde/destructrice. Notre moteur encadre le LLM par 4 boucliers et pré-teste la requête sur l'échantillon dev (5 %) avant d'interroger la production."}
        </p>

        {/* 4 Shields Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: isEn ? "Shield 1: Data Dictionary" : "Bouclier 1 : Data Dictionary",
              desc: isEn
                ? "Strict schema-only context with explicit business definitions for all 4 Gold tables (never raw data rows)."
                : "Contexte strict limité au schéma avec définitions métier explicites des 4 tables Gold (aucune donnée brute envoyée).",
            },
            {
              title: isEn ? "Shield 2: Few-Shot Prompting" : "Bouclier 2 : Few-Shot Prompting",
              desc: isEn
                ? "4 canonical question-to-SQL examples injected in the prompt (kept strictly disjoint from the evaluation benchmark)."
                : "4 exemples canoniques Question ➔ SQL injectés dans le prompt (strictement disjoints du jeu d'évaluation).",
            },
            {
              title: isEn
                ? "Shield 3: AST + Self-Correction"
                : "Bouclier 3 : AST + Auto-Correction",
              desc: isEn
                ? "sqlglot verifies read-only SELECT, Gold tables, and column existence. Errors are fed back to the LLM to self-correct, then pre-checked on igaming_dev (5%)."
                : "sqlglot vérifie le SELECT lecture seule, les tables Gold et l'existence des colonnes. Les erreurs sont renvoyées au LLM pour auto-correction, puis testées sur igaming_dev (5 %).",
            },
            {
              title: isEn ? "Shield 4: Golden Dataset Eval" : "Bouclier 4 : Golden Dataset Eval",
              desc: isEn
                ? "14 offline guardrail unit tests (hallucinated columns, DROP/DELETE, CTEs) + 15 benchmark questions compared by result-set equivalence."
                : "14 tests unitaires de garde-fous (colonnes hallucinées, DROP/DELETE, CTE) + 15 questions de référence évaluées par équivalence des résultats.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-3.5 space-y-1.5"
            >
              <div className="font-mono text-xs font-bold text-[var(--accent)]">{s.title}</div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Preset Selector */}
        <div className="space-y-4 pt-2">
          <div className="font-mono text-xs text-[var(--text-muted)]">
            {isEn
              ? "Click a scenario below to inspect how the guardrail & self-correction pipeline handles it:"
              : "Cliquez sur un scénario ci-dessous pour inspecter le comportement des garde-fous et de l'auto-correction :"}
          </div>
          <div className="flex flex-wrap gap-2">
            {SANDBOX_PRESETS.map((preset) => {
              const active = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`rounded-lg px-3.5 py-2 font-mono text-xs transition-all border ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)] font-semibold"
                      : "border-[var(--border)] bg-[var(--bg)]/40 text-[var(--text-muted)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  {preset.label[lang]}
                </button>
              );
            })}
          </div>

          {/* Sandbox Terminal Output */}
          <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-5 text-slate-200 font-mono text-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 font-semibold">
                  {isEn ? "Manager Question:" : "Question du Manager :"}
                </span>
                <span className="text-amber-300">&ldquo;{activePreset.question[lang]}&rdquo;</span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] ${
                  activePreset.status === "ok"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                }`}
              >
                {activePreset.status === "ok" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {activePreset.badge[lang]}
              </span>
            </div>

            {activePreset.firstAttemptSql && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEn
                    ? "Attempt #1 (Intercepted before Databricks execution):"
                    : "Tentative n°1 (Interceptée avant exécution Databricks) :"}
                </div>
                <pre className="text-rose-300 whitespace-pre-wrap">{activePreset.firstAttemptSql}</pre>
                <div className="text-amber-200/90 text-[11px]">
                  {activePreset.firstAttemptError?.[lang]}
                </div>
              </div>
            )}

            <div>
              <div className="text-slate-400 mb-1">
                {activePreset.status === "ok"
                  ? isEn
                    ? "Validated & Qualified Databricks SQL:"
                    : "Requête SQL Databricks Validée & Qualifiée :"
                  : isEn
                  ? "Intercepted Unsafe Query (Never Executed):"
                  : "Requête Non-Sûre Interceptée (Jamais Exécutée) :"}
              </div>
              <pre
                className={`whitespace-pre-wrap ${
                  activePreset.status === "ok" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {activePreset.finalSql}
              </pre>
            </div>

            {activePreset.resultRows && (
              <div className="overflow-x-auto border-t border-slate-800 pt-3">
                <div className="text-slate-400 mb-2">
                  {isEn ? "Databricks Result Set:" : "Résultat renvoyé par Databricks :"}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {Object.keys(activePreset.resultRows[0]).map((k) => (
                        <th key={k} className="py-1.5 pr-4">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activePreset.resultRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 text-slate-200">
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="py-1.5 pr-4">
                            {typeof v === "number" ? v.toLocaleString("en-US") : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
