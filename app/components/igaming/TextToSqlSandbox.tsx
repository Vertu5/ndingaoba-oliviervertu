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
} from "recharts";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Zap,
  Clock,
  Target,
  Search,
} from "lucide-react";
import {
  compileIgamingQuery,
  getIgamingScenarios,
  type LiveQueryResult,
} from "@/app/lib/igamingScenarios";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function TextToSqlSandbox({ isEn }: { isEn: boolean }) {
  const [queryInput, setQueryInput] = useState<string>("");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("vip_churn");
  const [customResult, setCustomResult] = useState<LiveQueryResult | null>(null);

  const scenarios = useMemo(() => getIgamingScenarios(isEn), [isEn]);

  const handleRunCustomQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = queryInput.trim();
    if (!raw) return;
    setCustomResult(compileIgamingQuery(raw, isEn));
  };

  const currentResult = customResult || scenarios[activeScenarioId] || scenarios.vip_churn;

  return (
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

      {/* Live Search / Question Input Bar */}
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

      {/* 4 Shields Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {[
          {
            step: isEn ? "Shield 1 • Dictionary" : "Bouclier 1 • Dictionnaire",
            status: "PASS",
            detail: isEn ? "5 Gold tables & formulas injected" : "5 tables Gold & formules injectées",
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

      {/* Trace + Chart + Table */}
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
          <span>{isEn ? currentResult.businessTakeawayEn : currentResult.businessTakeawayFr}</span>
        </div>
      </div>
    </div>
  );
}
