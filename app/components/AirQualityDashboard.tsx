"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database as SupabaseDatabase } from "@/lib/database.types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Activity, CloudRain, AlertTriangle, Database, Code, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface AirQualityDashboardProps {
  isEn?: boolean;
}

interface ChartData {
  city: string;
  value: number;
  quality: string;
  fill: string;
}

type MetricRow = SupabaseDatabase['public']['Views']['vw_latest_city_metrics']['Row'];

const AVAILABLE_CITIES = ["Paris", "London", "Brussels", "Berlin", "Madrid"];

export default function AirQualityDashboard({ isEn = true }: AirQualityDashboardProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Interactive Filters
  const [selectedCities, setSelectedCities] = useState<string[]>(["Paris", "London", "Brussels"]);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch directly from our advanced PostgreSQL view with proper filters!
        const { data: measurements, error: supabaseError } = await supabase
          .from("vw_latest_city_metrics")
          .select("*")
          .in("city_name", selectedCities)
          .eq("pollutant_code", "pm25")
          .limit(10); // Safety limit

        if (supabaseError) throw supabaseError;

        if (measurements && measurements.length > 0) {
          // Format for Recharts
          const chartData: ChartData[] = measurements.map((m: MetricRow) => {
            const city = m.city_name || "";
            const val = m.value || 0;
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
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching air quality data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    if (selectedCities.length > 0) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [isEn, selectedCities]);

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const sqlQuery = `SELECT city_name, pollutant_code, value, measured_at
FROM vw_latest_city_metrics
WHERE pollutant_code = 'pm25'
  AND city_name IN (${selectedCities.map(c => `'${c}'`).join(', ') || 'NULL'})
LIMIT 10;`;

  return (
    <motion.div 
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full mb-12 flex flex-col gap-4"
    >
      {/* Interactive Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mr-2">
            {isEn ? "Filter Cities:" : "Filtrer les Villes:"}
          </span>
          {AVAILABLE_CITIES.map(city => {
            const isSelected = selectedCities.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5
                  ${isSelected 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {city}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => setShowSql(!showSql)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${showSql 
              ? 'bg-slate-800 text-white dark:bg-slate-700' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
        >
          <Code className="w-4 h-4" />
          {isEn ? "Under the hood" : "Sous le capot"}
        </button>
      </div>

      {/* SQL Viewer Panel */}
      {showSql && (
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 shadow-inner overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-3 text-slate-400 border-b border-slate-800 pb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono uppercase tracking-wider">Executed PostgreSQL Query</span>
          </div>
          <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
            {sqlQuery}
          </pre>
        </div>
      )}

      {/* Dashboard Card */}
      <div className="w-full rounded-2xl bg-white dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] p-6 md:p-8 shadow-sm relative overflow-hidden group transition-all duration-300">
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
              {isEn ? "Air Quality Analytics (PM2.5)" : "Analytics Qualité de l'Air (PM2.5)"}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="w-full h-[300px] rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center animate-pulse">
            <Activity className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="w-full h-[300px] rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 flex flex-col items-center justify-center text-center p-6">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-red-800 dark:text-red-400 font-medium">Data Unavailable</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-[300px] rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 dark:text-slate-400">
            {isEn ? "Please select at least one city above." : "Veuillez sélectionner au moins une ville."}
          </div>
        ) : (
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
        )}
        
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-6 flex flex-wrap gap-4 items-center justify-center text-xs md:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4"
        >
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
        </motion.div>
      </div>
    </motion.div>
  );
}
