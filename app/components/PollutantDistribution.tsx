"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import SqlShowcaseLayout from "./SqlShowcaseLayout";
import { Activity, AlertTriangle } from "lucide-react";

interface Props {
  isEn?: boolean;
}

export default function PollutantDistribution({ isEn = true }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rawData, error } = await supabase
          .from("vw_pollutant_distribution")
          .select("*");

        if (error) throw error;
        
        // Let's just group all cities together for a total distribution
        const pollutantCounts: Record<string, number> = {};
        rawData?.forEach(row => {
          if (!row.pollutant_code) return;
          const code = row.pollutant_code.toUpperCase();
          pollutantCounts[code] = (pollutantCounts[code] || 0) + parseInt((row.measurement_count || 0).toString());
        });

        const formatted = Object.keys(pollutantCounts).map((key, i) => ({
          name: key,
          value: pollutantCounts[key],
          fill: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]
        }));

        setData(formatted);
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
    p.code AS pollutant_code,
    COUNT(m.measurement_id) AS measurement_count,
    ROUND(AVG(m.value), 2) AS avg_value
FROM measurements m
JOIN stations s ON m.station_id = s.station_id
JOIN cities c ON s.city_id = c.city_id
JOIN pollutants p ON m.pollutant_id = p.pollutant_id
GROUP BY city_name, pollutant_code;`;

  return (
    <SqlShowcaseLayout 
      isEn={isEn}
      title={isEn ? "Pollutant Distribution" : "Répartition des Polluants"}
      description={isEn 
        ? "Using COUNT() and GROUP BY to analyze the data distribution. Notice the performance of aggregating across 4 joined tables."
        : "Utilisation de COUNT() et GROUP BY pour analyser la répartition des données. Notez la performance de l'agrégation sur 4 tables jointes."}
      sqlQuery={sqlQuery}
    >
      <div className="h-[300px] w-full flex items-center justify-center">
        {loading ? (
          <Activity className="w-8 h-8 text-blue-500 animate-spin" />
        ) : error ? (
          <div className="text-red-500 flex items-center gap-2"><AlertTriangle /> {error}</div>
        ) : data.length === 0 ? (
          <div className="text-slate-500">No data available.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </SqlShowcaseLayout>
  );
}
