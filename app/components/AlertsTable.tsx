"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import { Activity, AlertTriangle, AlertOctagon } from "lucide-react";

interface Props {
  isEn?: boolean;
}

type AlertRow = Database['public']['Views']['vw_active_alerts']['Row'];

export default function AlertsTable({ isEn = true }: Props) {
  const [data, setData] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -250 : 250,
        behavior: 'smooth'
      });
    }
  };

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

  const sqlQuery = `-- 1. The PostgreSQL Trigger Function
CREATE OR REPLACE FUNCTION trg_check_thresholds()
RETURNS TRIGGER AS $$
DECLARE
    v_who_24h DECIMAL(8,2);
BEGIN
    SELECT who_24h_guideline INTO v_who_24h FROM pollutants WHERE pollutant_id = NEW.pollutant_id;

    IF v_who_24h IS NOT NULL AND NEW.value > v_who_24h THEN
        INSERT INTO alerts (measurement_id, threshold_type, threshold_value, created_at)
        VALUES (NEW.measurement_id, 'who_24h', v_who_24h, NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attaching the trigger to the table
CREATE TRIGGER trg_measurement_alert
AFTER INSERT ON measurements
FOR EACH ROW EXECUTE FUNCTION trg_check_thresholds();`;

  return (
    <SqlShowcaseLayout 
      isEn={isEn}
      title={isEn ? "Health Alerts (WHO Guidelines)" : "Alertes Sanitaires (Directives OMS)"}
      description={isEn 
        ? "Database Automation. Instead of checking thresholds manually, a PostgreSQL Trigger automatically inserts a row into the 'alerts' table whenever a new measurement exceeds the WHO limits."
        : "Automatisation Base de Données. Au lieu de vérifier les seuils manuellement, un Trigger PostgreSQL insère automatiquement une alerte dès qu'une nouvelle mesure dépasse les limites de l'OMS."}
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
          <div className="w-full">
            <div className="flex justify-end gap-2 mb-2">
              <button onClick={() => scroll('left')} className="p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 active:scale-95 transition-transform shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button onClick={() => scroll('right')} className="p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 active:scale-95 transition-transform shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            <div className="w-full overflow-x-auto scrollbar-hide rounded-lg border border-slate-200 dark:border-slate-800" ref={scrollRef}>
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">{isEn ? "City" : "Ville"}</th>
                  <th className="px-4 py-3 whitespace-nowrap">{isEn ? "Station" : "Station"}</th>
                  <th className="px-4 py-3 whitespace-nowrap">{isEn ? "Pollutant" : "Polluant"}</th>
                  <th className="px-4 py-3 whitespace-nowrap">{isEn ? "Value" : "Valeur"}</th>
                  <th className="px-4 py-3 whitespace-nowrap">{isEn ? "Limit" : "Limite"}</th>
                  <th className="px-4 py-3 whitespace-nowrap">{isEn ? "Status" : "Statut"}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 md:bg-transparent">
                {data.map((alert, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-800/50 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <span className="truncate max-w-[60%]">{alert.city_name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <span className="truncate max-w-[60%]">{alert.station_name}</span>
                    </td>
                    <td className="px-4 py-3 uppercase">
                      <span className="truncate max-w-[60%]">{alert.pollutant_code}</span>
                    </td>
                    <td className="px-4 py-3 text-red-500 font-semibold">
                      <span>{alert.value}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <span>{alert.threshold}</span>
                    </td>
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
          </div>
        )}
      </div>
    </SqlShowcaseLayout>
  );
}
