"use client";

import React, { useState } from "react";
import { Database, Code } from "lucide-react";

interface SqlShowcaseLayoutProps {
  title: string;
  description: string;
  sqlQuery: string;
  isEn?: boolean;
  children: React.ReactNode;
}

export default function SqlShowcaseLayout({
  title,
  description,
  sqlQuery,
  isEn = true,
  children
}: SqlShowcaseLayoutProps) {
  const [showSql, setShowSql] = useState(false);

  return (
    <div className="w-full mb-16 flex flex-col gap-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-[var(--text)] font-sans">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl text-sm">
            {description}
          </p>
        </div>
        <button
          onClick={() => setShowSql(!showSql)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
            ${showSql 
              ? 'bg-slate-800 text-white dark:bg-slate-700' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
        >
          <Code className="w-4 h-4" />
          {isEn ? "Under the hood" : "Sous le capot"}
        </button>
      </div>

      {showSql && (
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 shadow-inner overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-300 z-20">
          <div className="flex items-center gap-2 mb-3 text-slate-400 border-b border-slate-800 pb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono uppercase tracking-wider">Executed PostgreSQL Query</span>
          </div>
          <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
            {sqlQuery}
          </pre>
        </div>
      )}

      <div className="w-full rounded-2xl bg-white dark:bg-[var(--bg-elevated)] border border-slate-200 dark:border-[var(--border)] p-6 shadow-sm relative overflow-hidden group transition-all duration-300">
        {/* Decorative gradient blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
