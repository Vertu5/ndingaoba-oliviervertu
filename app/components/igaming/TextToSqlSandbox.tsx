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
  CheckCircle2,
  XCircle,
  Play,
  Search,
} from "lucide-react";
import {
  compileIgamingQuery,
  getIgamingScenarios,
  type LiveQueryResult,
} from "@/app/lib/igamingScenarios";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--bg-elevated)",
  borderColor: "var(--border)",
  borderRadius: "8px",
  color: "var(--text)",
  fontSize: "12px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
};

export default function TextToSqlSandbox({ isEn }: { isEn: boolean }) {
  const [queryInput, setQueryInput] = useState<string>("");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("vip_churn");
  const [customResult, setCustomResult] = useState<LiveQueryResult | null>(null);
  const [showSqlTrace, setShowSqlTrace] = useState<boolean>(false);

  const scenarios = useMemo(() => getIgamingScenarios(isEn), [isEn]);

  const handleRunCustomQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = queryInput.trim();
    if (!raw) return;
    setCustomResult(compileIgamingQuery(raw, isEn));
  };

  const currentResult = customResult || scenarios[activeScenarioId] || scenarios.vip_churn;

  return (
    <figure className="my-10 -mx-4 sm:-mx-6 md:-mx-12 font-sans">
      <div className="bg-white dark:bg-[var(--bg-elevated)] p-5 sm:p-8 rounded-xl border border-slate-200 dark:border-[var(--border)] shadow-xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[var(--border)] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold block">
              {isEn ? "Interactive Executive Copilot" : "Copilote Exécutif Interactif"}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[var(--text)] mt-0.5">
              {isEn
                ? "Natural Language to Governed Databricks SQL"
                : "Interrogation en Langage Naturel sur Databricks Gold"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowSqlTrace(!showSqlTrace)}
            className="self-start sm:self-auto text-xs bg-slate-100 dark:bg-[var(--bg)] hover:bg-slate-200 dark:hover:bg-[var(--border)] text-slate-700 dark:text-[var(--text)] py-1.5 px-3 rounded border border-slate-200 dark:border-[var(--border)] font-medium transition-colors cursor-pointer"
          >
            {showSqlTrace
              ? isEn
                ? "Hide SQL Trace"
                : "Masquer le code SQL"
              : isEn
              ? "Inspect Generated SQL"
              : "Voir le code SQL généré"}
          </button>
        </div>

        {/* Search Input + Scenario Pills */}
        <form onSubmit={handleRunCustomQuery} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={
                  isEn
                    ? "Ask a business question (e.g. 'VIP churn risk', 'channel revenue', 'fraud', or 'DROP TABLE')..."
                    : "Posez une question métier (ex: 'risque de churn VIP', 'chiffre d'affaires par canal', 'fraude', ou 'DROP TABLE')..."
                }
                className="w-full rounded-lg border border-slate-300 dark:border-[var(--border)] bg-slate-50 dark:bg-[var(--bg)] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-[var(--text)] placeholder:text-slate-400 dark:placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isEn ? "Ask Copilot" : "Interroger"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              {
                id: "vip_churn",
                label: isEn ? "1. VIP Revenue at Risk" : "1. Revenu VIP à Risque",
              },
              {
                id: "hallucination_repair",
                label: isEn
                  ? "2. Auto-Fix Hallucinated 'revenue'"
                  : "2. Auto-Correction Colonne 'revenue'",
              },
              {
                id: "top_vips",
                label: isEn ? "3. Top 8 VIP Whales" : "3. Top 8 Joueurs VIP",
              },
              {
                id: "fraud_sessions",
                label: isEn ? "4. Fraud & Collusion Signals" : "4. Signaux de Fraude",
              },
              {
                id: "destructive_blocked",
                label: isEn ? "5. Security Test: DROP TABLE" : "5. Test Sécurité : DROP TABLE",
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
                  className={`rounded-full px-3 py-1 text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white font-semibold shadow-sm"
                      : "border-slate-200 dark:border-[var(--border)] bg-slate-100 dark:bg-[var(--bg)] text-slate-700 dark:text-[var(--text-muted)] hover:bg-slate-200 dark:hover:bg-[var(--border)] dark:hover:text-[var(--text)]"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </form>

        {/* 4 Guardrail Shields Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              step: isEn ? "1. Data Dictionary" : "1. Dictionnaire Métier",
              status: "OK",
              detail: isEn ? "5 Gold tables mapped" : "5 tables Gold mappées",
            },
            {
              step: isEn ? "2. Few-Shot Context" : "2. Exemples Métier",
              status: "OK",
              detail: currentResult.intentLabel,
            },
            {
              step: isEn ? "3. AST & Self-Repair" : "3. Garde-fou AST",
              status:
                currentResult.status === "blocked"
                  ? "BLOCKED"
                  : currentResult.status === "repaired"
                  ? "REPAIRED"
                  : "OK",
              detail:
                currentResult.status === "blocked"
                  ? isEn
                    ? "Write/DDL blocked (0 ms)"
                    : "Instruction bloquée (0 ms)"
                  : currentResult.status === "repaired"
                  ? isEn
                    ? "'revenue' -> 'ggr'"
                    : "'revenue' corrigé en 'ggr'"
                  : isEn
                  ? "Read-only SELECT verified"
                  : "SELECT lecture seule vérifié",
            },
            {
              step: isEn ? "4. 5% Dev Pre-Check" : "4. Pré-test Dev 5%",
              status: currentResult.status === "blocked" ? "SKIPPED" : "VALIDATED",
              detail:
                currentResult.status === "blocked"
                  ? isEn
                    ? "Cluster untouched"
                    : "Cluster protégé"
                  : `${currentResult.devTimeMs}ms (dev) -> ${currentResult.prodTimeMs}ms (prod)`,
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-2.5 text-xs bg-slate-50 dark:bg-[var(--bg)] border-slate-200 dark:border-[var(--border)] border-l-4 ${
                s.status === "BLOCKED"
                  ? "border-l-rose-500"
                  : s.status === "REPAIRED"
                  ? "border-l-amber-500"
                  : "border-l-emerald-500"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-[var(--text)]">
                <span className="truncate">{s.step}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    s.status === "BLOCKED"
                      ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300"
                      : s.status === "REPAIRED"
                      ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300"
                      : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-600 dark:text-[var(--text-muted)] truncate">
                {s.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Executive Decision Takeaway Box */}
        <div
          className={`rounded-lg border border-slate-200 dark:border-[var(--border)] bg-slate-50 dark:bg-[var(--bg)] border-l-4 p-4 text-sm leading-relaxed text-slate-800 dark:text-[var(--text)] ${
            currentResult.status === "blocked" ? "border-l-rose-500" : "border-l-blue-500"
          }`}
        >
          <strong
            className={`font-bold block mb-1 ${
              currentResult.status === "blocked"
                ? "text-rose-600 dark:text-rose-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {isEn ? "Executive Insight & Action:" : "Décision Business & Action :"}
          </strong>
          {isEn ? currentResult.businessTakeawayEn : currentResult.businessTakeawayFr}
        </div>

        {/* Optional SQL Trace (always shown when repaired/blocked, or when toggled) */}
        {(showSqlTrace || currentResult.status !== "ok") && (
          <div className="space-y-2.5 font-mono text-xs">
            {currentResult.attempt1Error && (
              <div className="rounded-lg border border-slate-200 dark:border-[var(--border)] border-l-4 border-l-amber-500 bg-slate-50 dark:bg-[var(--bg)] p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {currentResult.status === "blocked"
                      ? isEn
                        ? "Attempt 1 Blocked by AST Guardrail:"
                        : "Tentative 1 Bloquée par le Garde-fou AST :"
                      : isEn
                      ? "Attempt 1 Intercepted (Hallucinated Column):"
                      : "Tentative 1 Interceptée (Colonne Hallucinée) :"}
                  </span>
                </div>
                <pre className="bg-slate-100 dark:bg-[#0f1014] text-slate-800 dark:text-slate-200 p-2.5 rounded border border-slate-200 dark:border-[var(--border)] overflow-x-auto">
                  {currentResult.attempt1Sql}
                </pre>
                <div className="text-amber-700 dark:text-amber-300 text-[11px] font-sans font-medium">
                  {currentResult.attempt1Error}
                </div>
              </div>
            )}

            {currentResult.finalSql && (
              <div className="rounded-lg border border-slate-200 dark:border-[var(--border)] border-l-4 border-l-emerald-500 bg-slate-50 dark:bg-[var(--bg)] p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn ? "Validated SQL Executed on Gold:" : "SQL Validé Exécuté sur Gold :"}
                  </span>
                </div>
                <pre className="bg-slate-100 dark:bg-[#0f1014] text-emerald-800 dark:text-emerald-300 p-2.5 rounded border border-slate-200 dark:border-[var(--border)] overflow-x-auto">
                  {currentResult.finalSql}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Visual Chart + Table */}
        {currentResult.rows.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
            {currentResult.chartKeyX && currentResult.chartKeyY && (
              <div className="lg:col-span-5 h-60 bg-slate-50 dark:bg-[var(--bg)] rounded-lg border border-slate-200 dark:border-[var(--border)] p-3">
                <div className="text-xs font-bold text-slate-800 dark:text-[var(--text)] mb-2">
                  {currentResult.chartLabelY}
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart
                    data={currentResult.rows}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey={currentResult.chartKeyX}
                      tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                    />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      contentStyle={TOOLTIP_STYLE}
                      itemStyle={{ color: "var(--text)" }}
                      labelStyle={{ color: "var(--text)", fontWeight: 700, marginBottom: "4px" }}
                    />
                    <Bar
                      dataKey={currentResult.chartKeyY}
                      name={currentResult.chartLabelY}
                      radius={[4, 4, 0, 0]}
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
              } overflow-x-auto rounded-lg border border-slate-200 dark:border-[var(--border)]`}
            >
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[var(--bg)] border-b border-slate-200 dark:border-[var(--border)] text-slate-700 dark:text-[var(--text-muted)]">
                    {currentResult.columns.map((c) => (
                      <th key={c} className="py-2.5 px-3 font-bold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentResult.rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 dark:border-[var(--border)] bg-white dark:bg-[var(--bg-elevated)] hover:bg-slate-50 dark:hover:bg-[var(--bg)] text-slate-800 dark:text-[var(--text)] transition-colors"
                    >
                      {currentResult.columns.map((c) => (
                        <td key={c} className="py-2 px-3">
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
      </div>
      <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-[var(--text-muted)] text-center max-w-2xl mx-auto px-4">
        <strong>
          {isEn
            ? "Figure 3. Interactive Guarded Text-to-SQL Copilot."
            : "Figure 3. Copilote Text-to-SQL Gouverné Interactif."}
        </strong>{" "}
        {isEn
          ? "Allows non-technical directors to query governed Gold tables in 0.3 seconds while blocking destructive commands and auto-correcting hallucinated column names."
          : "Permet aux directeurs non-techniciens d'interroger les tables Gold en 0,3 seconde tout en bloquant les commandes destructrices et en corrigeant automatiquement les colonnes hallucinées."}
      </figcaption>
    </figure>
  );
}
