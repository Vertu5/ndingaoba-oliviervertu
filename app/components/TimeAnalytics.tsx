"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import { Activity, AlertTriangle } from "lucide-react";

interface Props {
  isEn?: boolean;
}

export default function TimeAnalytics({ isEn = true }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rawData, error } = await supabase
          .from("vw_time_series_pm25")
          .select("*")
          .order("time_bucket", { ascending: true });

        if (error) throw error;
        
        // Group by time_bucket for Recharts LineChart
        // Recharts likes data in format: { time: '10:00', Paris: 12, London: 14 }
        const grouped: Record<string, any> = {};
        
        rawData?.forEach(row => {
          if (!row.time_bucket || !row.city_name) return;
          // Format date to local time string (HH:MM)
          const date = new Date(row.time_bucket);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          if (!grouped[timeStr]) {
            grouped[timeStr] = { time: timeStr };
          }
          grouped[timeStr][row.city_name] = row.avg_value;
        });

        setData(Object.values(grouped));
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
    DATE_TRUNC('hour', m.measured_at) AS time_bucket,
    ROUND(AVG(m.value), 2) AS avg_value
FROM measurements m
JOIN stations s ON m.station_id = s.station_id
JOIN cities c ON s.city_id = c.city_id
JOIN pollutants p ON m.pollutant_id = p.pollutant_id
WHERE p.code = 'pm25'
GROUP BY city_name, time_bucket
ORDER BY time_bucket ASC;`;

  return (
    <SqlShowcaseLayout 
      isEn={isEn}
      title={isEn ? "Time Series Analysis" : "Analyse Temporelle"}
      description={isEn 
        ? "Aggregating millions of records efficiently. The database groups measurements by hour using DATE_TRUNC() and calculates the average."
        : "Agrégation efficace. La base de données regroupe les mesures par heure via DATE_TRUNC() et calcule la moyenne."}
      sqlQuery={sqlQuery}
    >
      <div className="h-[300px] w-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center animate-pulse"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-red-500"><AlertTriangle className="mb-2" />{error}</div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500">Not enough historical data points gathered yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-slate-500 text-xs" dy={10} />
              <YAxis axisLine={false} tickLine={false} className="text-slate-500 text-xs" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="Paris" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="London" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Brussels" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </SqlShowcaseLayout>
  );
}
