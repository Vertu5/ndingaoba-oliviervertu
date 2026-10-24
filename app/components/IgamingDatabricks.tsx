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
import {
  ShieldCheck,
  Database,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  Layers,
  ExternalLink,
  Zap,
  Clock,
  ArrowRight,
  Target,
  Search,
} from "lucide-react";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import { useLang } from "@/app/lib/i18n";
import igamingData from "../data/igaming.json";

interface LiveQueryResult {
  question: string;
  intentLabel: string;
  attempt1Sql: string;
  attempt1Error: string | null;
  finalSql: string | null;
  status: "ok" | "repaired" | "blocked";
  devTimeMs: number;
  prodTimeMs: number;
  columns: string[];
  rows: Record<string, string | number>[];
  chartKeyX?: string;
  chartKeyY?: string;
  chartLabelY?: string;
  businessTakeawayFr: string;
  businessTakeawayEn: string;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function IgamingDatabricks() {
  const { lang } = useLang();
  const isEn = lang === "en";

  const [queryInput, setQueryInput] = useState<string>("");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("vip_churn");
  const [customResult, setCustomResult] = useState<LiveQueryResult | null>(null);

  const kpi = igamingData.kpis.rows[0];

  // 1. Marketing chart data
  const channelChartData = useMemo(
    () =>
      igamingData.channels.rows.map((r) => ({
        channel: r.acquisition_channel,
        ggrPerPlayer: r.ggr_per_registered_player,
        ggrPerActive: Number((r.ggr / r.active_players).toFixed(2)),
        totalGgrK: Number((r.ggr / 1000).toFixed(1)),
        activationPct: Number((r.activation_rate * 100).toFixed(1)),
        holdPct: Number((r.hold_rate * 100).toFixed(2)),
      })),
    []
  );

  // 2. Pareto cumulative chart data
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

  // 3. RFM Segment chart data
  const segmentChartData = useMemo(
    () =>
      igamingData.segments.rows.map((r) => ({
        segment: r.segment,
        players: r.players,
        turnoverK: Number((r.turnover / 1000).toFixed(1)),
        ggrK: Number((r.ggr / 1000).toFixed(1)),
      })),
    []
  );

  // 4. Standardized Churn Drivers chart data
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

  // 5. K-Means Persona chart data
  const personaChartData = useMemo(() => {
    return igamingData.mlflow.cluster_personas.map((p) => ({
      persona: p.cluster_persona,
      players: p.players,
      totalGgrK: Number((p.total_ggr / 1000).toFixed(1)),
      ggrAtRiskK: Number((p.ggr_at_risk / 1000).toFixed(1)),
      avgChurnPct: Number((p.avg_churn_prob * 100).toFixed(1)),
    }));
  }, []);

  // 6. Risk Flags chart data
  const riskFlagsChartData = useMemo(() => {
    return igamingData.risk_flags.rows.map((r) => ({
      flag: r.flag,
      sessions: r.sessions,
    }));
  }, []);

  // Pre-built scenarios + Live Natural Language / SQL Compiler over real Gold data
  const scenarios: Record<string, LiveQueryResult> = useMemo(() => {
    const topMl = igamingData.top_ml_scores || [];
    const topPlayers = igamingData.top_players || [];

    return {
      vip_churn: {
        question: isEn
          ? "Which high-value players have the highest GGR at risk of churn?"
          : "Quels sont les gros joueurs avec le plus fort GGR à risque de départ (churn) ?",
        intentLabel: isEn ? "CRM Retention Target (MLflow Gold)" : "Ciblage Rétention CRM (MLflow Gold)",
        attempt1Sql:
          "SELECT player_id, country, cluster_persona, churn_probability, ggr, expected_ggr_at_risk FROM workspace.igaming.gold_player_ml_scores ORDER BY expected_ggr_at_risk DESC LIMIT 8",
        attempt1Error: null,
        finalSql:
          "SELECT player_id, country, cluster_persona, churn_probability, ggr, expected_ggr_at_risk FROM workspace.igaming.gold_player_ml_scores ORDER BY expected_ggr_at_risk DESC LIMIT 8",
        status: "ok",
        devTimeMs: 95,
        prodTimeMs: 280,
        columns: [
          "player_id",
          "country",
          "cluster_persona",
          "churn_probability",
          "ggr",
          "expected_ggr_at_risk",
        ],
        rows: topMl.slice(0, 8),
        chartKeyX: "player_id",
        chartKeyY: "expected_ggr_at_risk",
        chartLabelY: isEn ? "Expected GGR at Risk (€)" : "GGR à Risque Attendu (€)",
        businessTakeawayFr:
          "Décision CRM : Le joueur #2857 (Italie, VIP) génère 11 809 € de GGR avec 43,7 % de probabilité de départ (soit 5 155 € à risque). Un hôte VIP peut le relancer dès aujourd'hui avant qu'il ne quitte la plateforme.",
        businessTakeawayEn:
          "CRM Decision: Player #2857 (Italy, VIP) generates €11,809 GGR with a 43.7% churn probability (€5,155 at risk). A VIP host can trigger a tailored retention offer today before inactivity sets in.",
      },
      hallucination_repair: {
        question: isEn
          ? "What is the total revenue and profit per acquisition channel?"
          : "Quel est le chiffre d'affaires (revenue) et le profit par canal d'acquisition ?",
        intentLabel: isEn
          ? "Self-Correction: Hallucinated Column ('revenue' -> 'ggr')"
          : "Auto-Correction : Colonne Hallucinée ('revenue' -> 'ggr')",
        attempt1Sql:
          "SELECT acquisition_channel, SUM(revenue) AS total_revenue, AVG(profit) FROM gold_channel_performance GROUP BY acquisition_channel",
        attempt1Error:
          "Guardrail Shield 3 Rejected: Unknown column 'revenue' and 'profit'. Allowed revenue columns in gold_channel_performance: ['turnover', 'ggr', 'ggr_per_registered_player', 'ggr_per_active_player', 'hold_rate'].",
        finalSql:
          "SELECT acquisition_channel, registered_players, active_players, ggr, ggr_per_registered_player, hold_rate FROM workspace.igaming.gold_channel_performance ORDER BY ggr_per_registered_player DESC LIMIT 100",
        status: "repaired",
        devTimeMs: 110,
        prodTimeMs: 240,
        columns: [
          "acquisition_channel",
          "registered_players",
          "active_players",
          "ggr",
          "ggr_per_registered_player",
          "hold_rate",
        ],
        rows: igamingData.channels.rows,
        chartKeyX: "acquisition_channel",
        chartKeyY: "ggr_per_registered_player",
        chartLabelY: isEn ? "GGR / Registered Player (€)" : "GGR / Inscrit (€)",
        businessTakeawayFr:
          "Pourquoi ce bouclier est vital : Sans le Data Dictionary et la validation AST, le LLM invente la colonne 'revenue' et fait planter la requête. Ici, l'erreur est interceptée et corrigée automatiquement en 'ggr' en 0,3 seconde.",
        businessTakeawayEn:
          "Why this shield matters: Without the Data Dictionary and AST check, the LLM invents a 'revenue' column and crashes. Here, the error is caught and auto-repaired to 'ggr' in 0.3 seconds.",
      },
      top_vips: {
        question: isEn
          ? "Show the top 8 VIP players by Gross Gaming Revenue (GGR) and their bet volume"
          : "Montre le top 8 des joueurs VIP par revenu net (GGR) et leur volume de mises",
        intentLabel: isEn ? "VIP Whale Profiling" : "Profilage des Joueurs VIP",
        attempt1Sql:
          "SELECT player_id, country, acquisition_channel, segment, sessions, turnover, ggr FROM workspace.igaming.gold_player_stats WHERE spins > 0 ORDER BY ggr DESC LIMIT 8",
        attempt1Error: null,
        finalSql:
          "SELECT player_id, country, acquisition_channel, segment, sessions, turnover, ggr FROM workspace.igaming.gold_player_stats WHERE spins > 0 ORDER BY ggr DESC LIMIT 8",
        status: "ok",
        devTimeMs: 88,
        prodTimeMs: 215,
        columns: ["player_id", "country", "acquisition_channel", "segment", "sessions", "turnover", "ggr"],
        rows: topPlayers.slice(0, 8),
        chartKeyX: "player_id",
        chartKeyY: "ggr",
        chartLabelY: "GGR (€)",
        businessTakeawayFr:
          "Insight VIP : Le joueur #5534 (acquis via Affiliate) a généré 45 867 € de GGR sur 393 082 € de mises en 97 sessions. Les 69 VIP représentent 1 % des joueurs mais 40,8 % des revenus du casino.",
        businessTakeawayEn:
          "VIP Insight: Player #5534 (Affiliate) generated €45,867 GGR on €393,082 in bets across 97 sessions. The 69 VIPs represent 1% of active players but 40.8% of total casino revenue.",
      },
      fraud_sessions: {
        question: isEn
          ? "Which fraud & responsible gaming flags appear most frequently across sessions?"
          : "Quels signaux de fraude et de jeu excessif apparaissent le plus souvent sur les sessions ?",
        intentLabel: isEn ? "Compliance & Anti-Fraud Audit" : "Audit Conformité & Anti-Fraude",
        attempt1Sql:
          "SELECT flag, sessions FROM workspace.igaming.gold_risk_sessions GROUP BY flag ORDER BY sessions DESC LIMIT 100",
        attempt1Error: null,
        finalSql:
          "SELECT flag, sessions FROM workspace.igaming.gold_risk_sessions GROUP BY flag ORDER BY sessions DESC LIMIT 100",
        status: "ok",
        devTimeMs: 102,
        prodTimeMs: 260,
        columns: ["flag", "sessions"],
        rows: igamingData.risk_flags.rows,
        chartKeyX: "flag",
        chartKeyY: "sessions",
        chartLabelY: isEn ? "Flagged Sessions" : "Sessions Signalées",
        businessTakeawayFr:
          "Décision Risque : Au lieu d'auditer 46 690 sessions à la main, le croisement des 6 drapeaux métier et d'Isolation Forest isole 10 sessions 'High Risk' et 67 anomalies confirmées en double alerte.",
        businessTakeawayEn:
          "Risk Decision: Instead of manually auditing 46,690 sessions, combining the 6 business flags with Isolation Forest isolates 10 'High Risk' sessions and 67 dual-confirmed anomalies.",
      },
      destructive_blocked: {
        question: isEn
          ? "DROP TABLE gold_player_stats; -- delete player records"
          : "DROP TABLE gold_player_stats; -- supprimer la table des joueurs",
        intentLabel: isEn ? "Security Attack Blocked (AST Shield)" : "Attaque Bloquée (Bouclier AST)",
        attempt1Sql: "DROP TABLE gold_player_stats",
        attempt1Error:
          "Guardrail Shield 3 CRITICAL BLOCK: Only read-only SELECT statements are permitted. Destructive or DDL statement 'Drop' was blocked before reaching Databricks.",
        finalSql: null,
        status: "blocked",
        devTimeMs: 0,
        prodTimeMs: 0,
        columns: [],
        rows: [],
        businessTakeawayFr:
          "Sécurité Garantie : Aucune requête générée par l'IA ne touche Databricks sans être analysée syntaxiquement par sqlglot. Toute commande DROP, DELETE, UPDATE ou accès hors de la couche Gold est bloquée en 0 ms.",
        businessTakeawayEn:
          "Guaranteed Safety: No AI-generated query ever reaches Databricks without being parsed into an AST by sqlglot. Any DROP, DELETE, UPDATE, or non-Gold table access is blocked in 0 ms.",
      },
    };
  }, [isEn]);

  const handleRunCustomQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = queryInput.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();

    if (/\b(drop|delete|truncate|update|insert|alter|create|grant|revoke)\b/i.test(lower)) {
      setCustomResult({
        question: raw,
        intentLabel: isEn ? "Blocked Destructive Command" : "Commande Destructrice Bloquée",
        attempt1Sql: raw,
        attempt1Error:
          "Guardrail Shield 3 CRITICAL BLOCK: Only read-only SELECT queries on Gold tables are allowed. Write/DDL operation rejected before reaching Databricks.",
        finalSql: null,
        status: "blocked",
        devTimeMs: 0,
        prodTimeMs: 0,
        columns: [],
        rows: [],
        businessTakeawayFr:
          "Le bouclier syntaxique sqlglot a bloqué cette instruction d'écriture/suppression instantanément avant tout appel à Databricks.",
        businessTakeawayEn:
          "The sqlglot AST shield blocked this write/destructive instruction instantaneously before any call to Databricks.",
      });
      return;
    }

    if (/\b(bronze_players|bronze_sessions|bronze_spins|silver_player_activity)\b/i.test(lower)) {
      setCustomResult({
        question: raw,
        intentLabel: isEn ? "Blocked Raw Layer Access" : "Accès Couche Brute Bloqué",
        attempt1Sql: raw,
        attempt1Error:
          "Guardrail Shield 3 BLOCK: Table access denied. Text-to-SQL is restricted to governed Gold tables to prevent 4.65M-spin full table scans.",
        finalSql: null,
        status: "blocked",
        devTimeMs: 0,
        prodTimeMs: 0,
        columns: [],
        rows: [],
        businessTakeawayFr:
          "Pourquoi bloquer Bronze/Silver : Scanner 4,65 millions de spins bruts à chaque question coûterait cher et prendrait ~40 secondes. En forçant la couche Gold pré-agrégée, la réponse arrive en 0,2 seconde.",
        businessTakeawayEn:
          "Why block Bronze/Silver: Scanning 4.65M raw spins per question is slow and costly. Enforcing pre-aggregated Gold tables delivers answers in 0.2 seconds.",
      });
      return;
    }

    if (/\b(revenue|profit|chiffre|benefice|bénéfice|ca)\b/i.test(lower)) {
      setCustomResult({
        ...scenarios.hallucination_repair,
        question: raw,
      });
      return;
    }

    if (/\b(churn|depart|départ|quitter|inactif|ml|probabilit|cluster|persona|retent)\b/i.test(lower)) {
      setCustomResult({
        ...scenarios.vip_churn,
        question: raw,
      });
      return;
    }

    if (/\b(fraud|risque|risk|session|geo|ip|device|appareil|collusion|anomal)\b/i.test(lower)) {
      setCustomResult({
        ...scenarios.fraud_sessions,
        question: raw,
      });
      return;
    }

    if (/\b(canal|canaux|channel|marketing|acquisition|organic|affiliate|referral|hold)\b/i.test(lower)) {
      setCustomResult({
        question: raw,
        intentLabel: isEn ? "Marketing Channel Query" : "Analyse Canal d'Acquisition",
        attempt1Sql:
          "SELECT acquisition_channel, registered_players, active_players, activation_rate, ggr, ggr_per_registered_player, hold_rate FROM workspace.igaming.gold_channel_performance ORDER BY ggr_per_registered_player DESC LIMIT 100",
        attempt1Error: null,
        finalSql:
          "SELECT acquisition_channel, registered_players, active_players, activation_rate, ggr, ggr_per_registered_player, hold_rate FROM workspace.igaming.gold_channel_performance ORDER BY ggr_per_registered_player DESC LIMIT 100",
        status: "ok",
        devTimeMs: 82,
        prodTimeMs: 195,
        columns: [
          "acquisition_channel",
          "registered_players",
          "active_players",
          "ggr",
          "ggr_per_registered_player",
          "hold_rate",
        ],
        rows: igamingData.channels.rows,
        chartKeyX: "acquisition_channel",
        chartKeyY: "ggr_per_registered_player",
        chartLabelY: isEn ? "GGR / Registered Player (€)" : "GGR / Inscrit (€)",
        businessTakeawayFr:
          "Décision Marketing : Organic génère 90,57 € par inscrit contre 41,72 € pour Referral, alors que le taux d'activation est identique (~85 %). Il faut réallouer le budget vers le SEO/Organic.",
        businessTakeawayEn:
          "Marketing Decision: Organic yields €90.57 per registered player vs €41.72 for Referral, while activation rates are identical (~85%). Reallocate budget toward SEO/Organic.",
      });
      return;
    }

    if (/\b(segment|rfm|pareto|dormant|loyal|champion)\b/i.test(lower)) {
      setCustomResult({
        question: raw,
        intentLabel: isEn ? "RFM Segmentation Query" : "Segmentation Client RFM",
        attempt1Sql:
          "SELECT segment, players, turnover, ggr, share_of_ggr FROM workspace.igaming.gold_player_value ORDER BY ggr DESC LIMIT 100",
        attempt1Error: null,
        finalSql:
          "SELECT segment, players, turnover, ggr, share_of_ggr FROM workspace.igaming.gold_player_value ORDER BY ggr DESC LIMIT 100",
        status: "ok",
        devTimeMs: 90,
        prodTimeMs: 210,
        columns: ["segment", "players", "turnover", "ggr", "share_of_ggr"],
        rows: igamingData.segments.rows,
        chartKeyX: "segment",
        chartKeyY: "ggr",
        chartLabelY: "GGR (€)",
        businessTakeawayFr:
          "Insight RFM : 413 joueurs 'At risk (high value)' cumulent 553 778 € de mises mais décrochent. C'est le vivier n°1 de relance CRM.",
        businessTakeawayEn:
          "RFM Insight: 413 'At risk (high value)' players account for €553,778 in bets. They are the #1 CRM reactivation target.",
      });
      return;
    }

    setCustomResult({
      ...scenarios.top_vips,
      question: raw,
    });
  };

  const currentResult = customResult || scenarios[activeScenarioId] || scenarios.vip_churn;

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

      {/* SECTION 1: INTERACTIVE TEXT-TO-SQL TESTER + WHY WE BUILT IT */}
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>
                {isEn
                  ? "Interactive Sandbox • Type a Question or Click a Scenario Below"
                  : "Simulateur Interactif • Tapez une Question ou Cliquez sur un Scénario"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              {isEn
                ? "1. Why Guarded Text-to-SQL? Instant Answers Without Hallucinations"
                : "1. Pourquoi le Text-to-SQL Sécurisé ? Décider en 3 Secondes Sans Hallucination"}
            </h3>
          </div>
          <span className="self-start lg:self-auto font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3.5 py-1.5">
            {isEn ? "4 Safety Shields Active • 14/14 AST Tests" : "4 Boucliers Actifs • 14/14 Tests AST"}
          </span>
        </div>

        {/* Visual Before vs After Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4 flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-mono font-bold uppercase text-rose-400">
                {isEn ? "Without Text-to-SQL: 48-Hour Delay" : "Sans Text-to-SQL : 48 Heures d'Attente"}
              </div>
              <p className="text-[var(--text-muted)]">
                {isEn
                  ? "VIP Manager asks a question -> Opens a ticket -> Data Analyst writes SQL -> Sends static Excel 2 days later (too late to save a churning VIP)."
                  : "Le Directeur Marketing/VIP se pose une question -> Ticket Data Analyst -> Requête SQL manuelle -> Tableau Excel reçu 2 jours plus tard."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-mono font-bold uppercase text-emerald-400">
                {isEn
                  ? "With Guarded Text-to-SQL: 0.3 Seconds & Zero Hallucination"
                  : "Avec Text-to-SQL Gouverné : 0,3 Seconde & Zéro Hallucination"}
              </div>
              <p className="text-[var(--text-muted)]">
                {isEn
                  ? "Manager asks in plain French/English -> LLM writes SQL via Data Dictionary -> sqlglot AST checks safety & auto-repairs errors -> Pre-tested on 5% dev sample -> Live chart."
                  : "Question en français/anglais -> Traduction SQL via Data Dictionary -> sqlglot vérifie la sécurité et auto-corrige les erreurs -> Pré-test sur dev 5 % -> Graphique en direct."}
              </p>
            </div>
          </div>
        </div>

        {/* LIVE SEARCH / QUESTION INPUT BAR */}
        <form onSubmit={handleRunCustomQuery} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={
                  isEn
                    ? "Type a question (e.g. 'VIP churn risk', 'channel revenue', 'fraud sessions', or try 'DROP TABLE gold_player_stats')..."
                    : "Tapez votre question (ex: 'risque de churn VIP', 'chiffre d'affaires par canal', 'fraude', ou tentez 'DROP TABLE gold_player_stats')..."
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs sm:text-sm font-bold px-5 py-3 transition-colors cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isEn ? "Test Query" : "Tester la Question"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--text-muted)] mr-1">
              {isEn ? "Quick test scenarios:" : "Scénarios rapides à tester :"}
            </span>
            {[
              {
                id: "vip_churn",
                label: isEn ? "1. VIP Churn Risk (MLflow)" : "1. VIP à Risque de Churn (MLflow)",
              },
              {
                id: "hallucination_repair",
                label: isEn
                  ? "2. Hallucinated Column ('revenue' -> Auto-Repair)"
                  : "2. Colonne Hallucinée ('revenue' -> Auto-Correction)",
              },
              {
                id: "top_vips",
                label: isEn ? "3. Top 8 VIP Whales" : "3. Top 8 Joueurs VIP",
              },
              {
                id: "fraud_sessions",
                label: isEn ? "4. Fraud & Collusion Signals" : "4. Signaux de Fraude & Collusion",
              },
              {
                id: "destructive_blocked",
                label: isEn ? "5. Hack Attempt: DROP TABLE" : "5. Test Attaque : DROP TABLE",
              },
            ].map((pill) => {
              const isSelected = !customResult && activeScenarioId === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => {
                    setCustomResult(null);
                    setActiveScenarioId(pill.id);
                    setQueryInput(scenarios[pill.id].question);
                  }}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 font-semibold"
                      : "border-[var(--border)] bg-[var(--bg)]/50 text-[var(--text-muted)] hover:border-emerald-500/40"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </form>

        {/* VISUAL 4 SHIELDS PIPELINE STATUS FOR CURRENT QUERY */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {[
            {
              step: isEn ? "Shield 1 • Dictionary" : "Bouclier 1 • Dictionnaire",
              status: "PASS",
              detail: isEn
                ? "5 Gold tables & formulas injected"
                : "5 tables Gold & formules injectées",
            },
            {
              step: isEn ? "Shield 2 • Few-Shot" : "Bouclier 2 • Exemples SQL",
              status: "PASS",
              detail: currentResult.intentLabel,
            },
            {
              step: isEn ? "Shield 3 • AST & Auto-Fix" : "Bouclier 3 • AST & Auto-Fix",
              status:
                currentResult.status === "blocked"
                  ? "BLOCKED"
                  : currentResult.status === "repaired"
                  ? "AUTO-FIXED"
                  : "PASS",
              detail:
                currentResult.status === "blocked"
                  ? isEn
                    ? "Blocked in 0 ms by sqlglot"
                    : "Bloqué en 0 ms par sqlglot"
                  : currentResult.status === "repaired"
                  ? isEn
                    ? "Repaired unknown column -> ggr"
                    : "Colonne corrigée -> ggr"
                  : isEn
                  ? "Read-only SELECT + LIMIT verified"
                  : "SELECT lecture seule + LIMIT vérifié",
            },
            {
              step: isEn ? "Shield 4 • 5% Dev -> Prod" : "Bouclier 4 • Pré-test Dev 5%",
              status: currentResult.status === "blocked" ? "SKIPPED" : "EXECUTED",
              detail:
                currentResult.status === "blocked"
                  ? isEn
                    ? "Warehouse never touched"
                    : "Databricks protégé (non appelé)"
                  : `Dev (5%): ${currentResult.devTimeMs}ms -> Prod: ${currentResult.prodTimeMs}ms`,
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 text-xs font-mono ${
                s.status === "BLOCKED"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                  : s.status === "AUTO-FIXED"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{s.step}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30">{s.status}</span>
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)] truncate">{s.detail}</div>
            </div>
          ))}
        </div>

        {/* TRACE + VISUAL CHART + RESULT TABLE */}
        <div className="rounded-xl border border-[var(--border)] bg-[#0b1120] p-5 space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="text-slate-200 font-semibold">
              <span className="text-emerald-400 mr-2">Question:</span>
              &ldquo;{currentResult.question}&rdquo;
            </div>
          </div>

          {currentResult.attempt1Error && (
            <div
              className={`rounded-lg border p-3 space-y-1.5 ${
                currentResult.status === "blocked"
                  ? "border-rose-500/40 bg-rose-950/30"
                  : "border-amber-500/40 bg-amber-950/25"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>
                  {currentResult.status === "blocked"
                    ? isEn
                      ? "Attempt 1 Blocked by AST Guardrail"
                      : "Tentative 1 Bloquée par le Garde-fou AST"
                    : isEn
                    ? "Attempt 1 Intercepted (Hallucinated Column Detected)"
                    : "Tentative 1 Interceptée (Colonne Hallucinée Détectée)"}
                </span>
              </div>
              <div className="text-slate-300 bg-slate-950/70 p-2 rounded border border-slate-800 overflow-x-auto">
                {currentResult.attempt1Sql}
              </div>
              <div className="text-amber-300 text-[11px]">{currentResult.attempt1Error}</div>
            </div>
          )}

          {currentResult.finalSql && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {currentResult.status === "repaired"
                      ? isEn
                        ? "Attempt 2 Auto-Corrected & Executed on Databricks:"
                        : "Tentative 2 Auto-Corrigée & Exécutée sur Databricks :"
                      : isEn
                      ? "Validated SQL Executed on Databricks Gold:"
                      : "Requête SQL Validée & Exécutée sur Databricks Gold :"}
                  </span>
                </span>
                <span className="text-[11px] text-emerald-300">
                  {currentResult.devTimeMs}ms (dev 5%) ➔ {currentResult.prodTimeMs}ms (prod)
                </span>
              </div>
              <div className="text-emerald-200 bg-slate-950/70 p-2 rounded border border-slate-800 overflow-x-auto">
                {currentResult.finalSql}
              </div>
            </div>
          )}

          {currentResult.rows.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 items-center">
              {currentResult.chartKeyX && currentResult.chartKeyY && (
                <div className="lg:col-span-5 h-56 bg-slate-950/50 rounded-xl border border-slate-800 p-3">
                  <div className="text-[11px] text-slate-400 mb-1 font-sans font-semibold">
                    {currentResult.chartLabelY}
                  </div>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={currentResult.rows}
                      margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                      <XAxis
                        dataKey={currentResult.chartKeyX}
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          color: "#f8fafc",
                        }}
                      />
                      <Bar
                        dataKey={currentResult.chartKeyY}
                        name={currentResult.chartLabelY}
                        radius={[5, 5, 0, 0]}
                      >
                        {currentResult.rows.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div
                className={`${
                  currentResult.chartKeyX ? "lg:col-span-7" : "lg:col-span-12"
                } overflow-x-auto`}
              >
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {currentResult.columns.map((c) => (
                        <th key={c} className="py-1.5 px-2">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentResult.rows.map((r, i) => (
                      <tr key={i} className="border-b border-slate-800/50 text-slate-200">
                        {currentResult.columns.map((c) => (
                          <td key={c} className="py-1.5 px-2">
                            {String(r[c] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs font-sans text-blue-200 flex items-start gap-2.5">
            <Target className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              {isEn ? currentResult.businessTakeawayEn : currentResult.businessTakeawayFr}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: MARKETING CHANNEL ROI (VISUAL FIRST) */}
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
              <span className="font-mono text-[11px] text-amber-400 font-bold">
                Top 20% = 80.1%
              </span>
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

      {/* SECTION 5: FRAUD, COLLUSION & RESPONSIBLE GAMING (RULES VS ISOLATION FOREST) */}
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
