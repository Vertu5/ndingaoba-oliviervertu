"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Activity, CloudRain, AlertTriangle } from "lucide-react";

interface AirQualityDashboardProps {
  isEn?: boolean;
}

interface ChartData {
  city: string;
  value: number;
  quality: string;
  fill: string;
}

export default function AirQualityDashboard({ isEn = true }: AirQualityDashboardProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch the latest PM2.5 measurements for our cities
        const { data: measurements, error: supabaseError } = await supabase
          .from("measurements")
          .select(`
            value,
            pollutants!inner(code),
            stations!inner(
              cities!inner(name)
            )
          `)
          .eq("pollutants.code", "pm25")
          .order("measured_at", { ascending: false })
          .limit(200);

        if (supabaseError) throw supabaseError;

        if (measurements && measurements.length > 0) {
          // Aggregate the latest value per city
          const latestPerCity: Record<string, number> = {};
          
          measurements.forEach((m: { value: number; stations?: { cities?: { name: string } } | null }) => {
            const cityName = m.stations?.cities?.name;
            if (cityName && !latestPerCity[cityName]) {
              latestPerCity[cityName] = m.value;
            }
          });

          // Format for Recharts
          const chartData: ChartData[] = Object.keys(latestPerCity).map((city) => {
            const val = latestPerCity[city];
            // WHO Guideline for PM2.5 is 15 µg/m³ (24h)
            let quality = isEn ? "Good" : "Bon";
            let fill = "#10b981"; // emerald-500
            
            if (val > 15) {
              quality = isEn ? "Moderate" : "Moyen";
              fill = "#f59e0b"; // amber-500
            }
            if (val > 35) {
              quality = isEn ? "Poor" : "Mauvais";
              fill = "#ef4444"; // red-500
            }

            return {
              city,
              value: parseFloat(val.toFixed(1)),
              quality,
              fill
            };
          });
          
          // Sort alphabetically
          chartData.sort((a, b) => a.city.localeCompare(b.city));
          setData(chartData);
        }
      } catch (err) {
        console.error("Error fetching air quality data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isEn]);

  if (loading) {
    return (
      <div className="w-full h-80 rounded-2xl bg-slate-100 dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] animate-pulse flex items-center justify-center mb-12 shadow-sm">
        <Activity className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-6 mb-12 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
          {isEn ? "Live Data Unavailable" : "Données en direct indisponibles"}
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm max-w-md mt-2">
          {isEn 
            ? "Ensure your Supabase project is running and the database has been populated with the Python ingestion script." 
            : "Assurez-vous que votre projet Supabase est actif et que la base de données a été remplie avec le script Python."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider text-green-600 dark:text-green-400 uppercase">
              {isEn ? "Live Data" : "Données en direct"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-[var(--text)] font-sans flex items-center gap-3">
            <CloudRain className="w-7 h-7 text-blue-500" />
            {isEn ? "Global Air Quality (PM2.5)" : "Qualité de l'Air Mondiale (PM2.5)"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
            {isEn 
              ? "Real-time measurements pulled directly from the Supabase database. WHO recommends staying below 15 µg/m³ for 24-hour exposure."
              : "Mesures en temps réel tirées de la base de données Supabase. L'OMS recommande de rester en dessous de 15 µg/m³ pour une exposition de 24h."}
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
            <XAxis 
              dataKey="city" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 13 }}
              className="text-slate-500 dark:text-slate-400"
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 13 }}
              className="text-slate-500 dark:text-slate-400"
            />
            <Tooltip 
              cursor={{ fill: 'currentColor', opacity: 0.04 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl">
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{data.city}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                        PM2.5: <span className="font-semibold">{data.value} µg/m³</span>
                      </p>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ backgroundColor: data.fill }}>
                        {data.quality}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center text-xs md:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>{isEn ? "Good (≤ 15)" : "Bon (≤ 15)"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>{isEn ? "Moderate (16-35)" : "Moyen (16-35)"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>{isEn ? "Poor (> 35)" : "Mauvais (> 35)"}</span>
        </div>
      </div>
    </div>
  );
}
