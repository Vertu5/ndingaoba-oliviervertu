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
  const [currentIndex, setCurrentIndex] = useState(0);

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                {isEn ? `Alert ${currentIndex + 1} of ${data.length}` : `Alerte ${currentIndex + 1} sur ${data.length}`}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(data.length - 1, prev + 1))}
                  disabled={currentIndex === data.length - 1}
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden text-sm">
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <span className="font-semibold text-slate-500">{isEn ? "City" : "Ville"}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{data[currentIndex].city_name}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <span className="font-semibold text-slate-500">{isEn ? "Station" : "Station"}</span>
                <span className="text-slate-700 dark:text-slate-300 text-right">{data[currentIndex].station_name}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <span className="font-semibold text-slate-500">{isEn ? "Pollutant" : "Polluant"}</span>
                <span className="uppercase text-slate-700 dark:text-slate-300 text-right font-mono">{data[currentIndex].pollutant_code}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <span className="font-semibold text-slate-500">{isEn ? "Value" : "Valeur"}</span>
                <span className="text-red-600 dark:text-red-400 font-bold text-right">{data[currentIndex].value}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <span className="font-semibold text-slate-500">{isEn ? "Limit" : "Limite"}</span>
                <span className="text-slate-700 dark:text-slate-300 text-right">{data[currentIndex].threshold}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/30">
                <span className="font-semibold text-slate-500">{isEn ? "Status" : "Statut"}</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 font-bold tracking-wide">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  {isEn ? "EXCEEDED" : "DÉPASSÉ"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </SqlShowcaseLayout>
  );
}
