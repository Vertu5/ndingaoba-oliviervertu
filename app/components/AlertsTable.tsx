"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import { Activity, AlertTriangle, AlertOctagon } from "lucide-react";

interface Props {
  isEn?: boolean;
}

export default function AlertsTable({ isEn = true }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rawData, error } = await supabase
          .from("vw_active_alerts")
          .select("*")
          .limit(10);

        if (error) throw error;
        setData(rawData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sqlQuery = `SELECT 
    c.name AS city_name,
    s.name AS station_name,
    p.code AS pollutant_code,
    m.value,
    m.measured_at,
    p.who_24h_guideline AS threshold
FROM measurements m
JOIN stations s ON m.station_id = s.station_id
JOIN cities c ON s.city_id = c.city_id
JOIN pollutants p ON m.pollutant_id = p.pollutant_id
WHERE p.who_24h_guideline IS NOT NULL 
  AND m.value > p.who_24h_guideline
ORDER BY m.measured_at DESC;`;

  return (
    <SqlShowcaseLayout 
      isEn={isEn}
      title={isEn ? "Health Alerts (WHO Guidelines)" : "Alertes Sanitaires (Directives OMS)"}
      description={isEn 
        ? "Finding anomalies. This query joins the measurements table with the pollutants table to dynamically compare live values against WHO threshold guidelines."
        : "Recherche d'anomalies. Cette requête joint la table des mesures avec celle des polluants pour comparer dynamiquement les valeurs en direct aux seuils de l'OMS."}
      sqlQuery={sqlQuery}
    >
      <div className="w-full">
        {loading ? (
          <div className="w-full h-40 flex items-center justify-center animate-pulse"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : error ? (
          <div className="w-full h-40 flex flex-col items-center justify-center text-red-500"><AlertTriangle className="mb-2" />{error}</div>
        ) : data.length === 0 ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-3">
              <span className="text-xl">🌿</span>
            </div>
            <p className="font-semibold">{isEn ? "No active alerts" : "Aucune alerte active"}</p>
            <p className="text-sm opacity-80 mt-1">{isEn ? "All measurements are within WHO safety guidelines." : "Toutes les mesures respectent les seuils de l'OMS."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">{isEn ? "City" : "Ville"}</th>
                  <th className="px-4 py-3">{isEn ? "Station" : "Station"}</th>
                  <th className="px-4 py-3">{isEn ? "Pollutant" : "Polluant"}</th>
                  <th className="px-4 py-3">{isEn ? "Value" : "Valeur"}</th>
                  <th className="px-4 py-3">{isEn ? "Limit" : "Limite"}</th>
                  <th className="px-4 py-3">{isEn ? "Status" : "Statut"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {data.map((alert, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{alert.city_name}</td>
                    <td className="px-4 py-3 text-slate-500">{alert.station_name}</td>
                    <td className="px-4 py-3 uppercase">{alert.pollutant_code}</td>
                    <td className="px-4 py-3 text-red-500 font-semibold">{alert.value}</td>
                    <td className="px-4 py-3 text-slate-500">{alert.threshold}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-semibold">
                        <AlertOctagon className="w-3 h-3" />
                        {isEn ? "EXCEEDED" : "DÉPASSÉ"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SqlShowcaseLayout>
  );
}
