"use client";

import React, { useState } from 'react';
import { useLang } from "@/app/lib/i18n";

// ==============================================================================
// ⚙️ Project: Air Quality System Design (PostgreSQL / FastAPI)
// 👨‍💻 Author: Olivier Vertu Ndingaoba
// ==============================================================================

const dbmlCode = `// =============================================
// Air Quality Monitoring System - ER Diagram
// Data Engineering Project - Pollution
// Optimized for PostgreSQL
// =============================================

Table cities {
  city_id serial [pk]
  name varchar(100) [not null]
  country_code char(2) [not null, note: 'ISO 3166-1 alpha-2']
  timezone varchar(50) [not null]
  latitude decimal(9,6)
  longitude decimal(9,6)
  created_at timestamptz [default: \`now()\`]
}

Table pollutants {
  pollutant_id serial [pk]
  code varchar(20) [unique, not null]
  display_name varchar(50) [not null]
  unit varchar(20) [not null]
  description text
  who_annual_guideline decimal(8,2)
  who_24h_guideline decimal(8,2)
  who_1h_guideline decimal(8,2)
}

Table stations {
  station_id serial [pk]
  openaq_location_id integer [unique, not null]
  city_id integer [not null, ref: > cities.city_id]
  name varchar(200) [not null]
  locality varchar(150)
  latitude decimal(9,6) [not null]
  longitude decimal(9,6) [not null]
  is_mobile boolean [default: false]
  is_monitor boolean [default: true]
  provider_name varchar(150)
  timezone varchar(50)
  last_seen_at timestamptz
  created_at timestamptz [default: \`now()\`]
}

Table measurements {
  measurement_id bigserial [pk]
  station_id integer [not null, ref: > stations.station_id]
  pollutant_id integer [not null, ref: > pollutants.pollutant_id]
  value decimal(10,3) [not null]
  measured_at timestamptz [not null, note: 'UTC']
  measured_at_local timestamptz
  source varchar(50) [default: 'openaq']
  created_at timestamptz [default: \`now()\`]
}

Table alerts {
  alert_id bigserial [pk]
  measurement_id bigint [not null, ref: > measurements.measurement_id]
  threshold_type varchar(30) [not null]
  threshold_value decimal(8,2) [not null]
  created_at timestamptz [default: \`now()\`]
}

// Performance indexes
Indexes {
  (stations.city_id) [name: 'idx_stations_city']
  (measurements.station_id, measurements.measured_at) [name: 'idx_meas_station_time']
  (measurements.pollutant_id, measurements.measured_at) [name: 'idx_meas_pollutant_time']
  (measurements.measured_at) [name: 'idx_meas_time']
  (alerts.measurement_id) [name: 'idx_alerts_measurement']
}`;

const TableNode = ({ name, columns, isCenter = false }: { name: string, columns: {name: string, type: string, pk?: boolean, fk?: boolean}[], isCenter?: boolean }) => (
  <div className={`flex flex-col bg-slate-900 border ${isCenter ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-700'} rounded-lg overflow-hidden text-xs font-mono w-full sm:w-64`}>
    <div className={`px-3 py-2 font-bold text-center ${isCenter ? 'bg-blue-900 text-blue-100' : 'bg-slate-800 text-slate-200'} border-b border-slate-700`}>
      {name.toUpperCase()}
    </div>
    <div className="flex flex-col p-2 gap-1 bg-slate-900/50">
      {columns.map((col, idx) => (
        <div key={idx} className="flex justify-between items-center group hover:bg-slate-800/50 px-1 rounded transition-colors">
          <span className={`flex items-center gap-1.5 ${col.pk ? 'text-amber-400 font-bold' : col.fk ? 'text-purple-400' : 'text-slate-300'}`}>
            {col.pk && <span title="Primary Key">🔑</span>}
            {col.fk && <span title="Foreign Key">🔗</span>}
            {col.name}
          </span>
          <span className="text-slate-500 text-[10px]">{col.type}</span>
        </div>
      ))}
    </div>
  </div>
);

const DatabaseSchema = () => (
  <div className="my-12 p-6 sm:p-8 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl relative overflow-x-auto">
    <h3 className="text-xl font-bold font-sans text-slate-100 mb-8 flex items-center gap-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
      3NF Relational Data Model (PostgreSQL)
    </h3>
    
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-w-[800px]">
      
      {/* Left Column */}
      <div className="flex flex-col gap-12">
        <TableNode name="cities" columns={[
          {name: 'city_id', type: 'serial', pk: true},
          {name: 'name', type: 'varchar'},
          {name: 'country_code', type: 'char(2)'},
          {name: 'timezone', type: 'varchar'},
          {name: 'latitude', type: 'decimal'},
          {name: 'longitude', type: 'decimal'},
        ]} />
        <TableNode name="pollutants" columns={[
          {name: 'pollutant_id', type: 'serial', pk: true},
          {name: 'code', type: 'varchar'},
          {name: 'display_name', type: 'varchar'},
          {name: 'unit', type: 'varchar'},
          {name: 'who_annual_guideline', type: 'decimal'},
        ]} />
      </div>

      {/* Center Column */}
      <div className="flex flex-col gap-12 relative">
        <TableNode name="stations" columns={[
          {name: 'station_id', type: 'serial', pk: true},
          {name: 'openaq_location_id', type: 'integer'},
          {name: 'city_id', type: 'integer', fk: true},
          {name: 'name', type: 'varchar'},
          {name: 'latitude', type: 'decimal'},
          {name: 'longitude', type: 'decimal'},
          {name: 'is_monitor', type: 'boolean'},
        ]} />
        
        {/* The core fact table */}
        <TableNode name="measurements" isCenter={true} columns={[
          {name: 'measurement_id', type: 'bigserial', pk: true},
          {name: 'station_id', type: 'integer', fk: true},
          {name: 'pollutant_id', type: 'integer', fk: true},
          {name: 'value', type: 'decimal'},
          {name: 'measured_at', type: 'timestamptz'},
          {name: 'source', type: 'varchar'},
        ]} />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-12">
        <TableNode name="alerts" columns={[
          {name: 'alert_id', type: 'bigserial', pk: true},
          {name: 'measurement_id', type: 'bigint', fk: true},
          {name: 'threshold_type', type: 'varchar'},
          {name: 'threshold_value', type: 'decimal'},
          {name: 'created_at', type: 'timestamptz'},
        ]} />
      </div>
      
    </div>
  </div>
);

export default function SystemDesign() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  
  const [activeTab, setActiveTab] = useState<'dbml' | 'sql'>('dbml');

  return (
    <article lang={isEn ? "en" : "fr"} className="bg-[#fafafa] dark:bg-[var(--bg)] text-[#222222] dark:text-[var(--text)] font-serif selection:bg-blue-200 rounded-lg overflow-hidden border border-slate-200 dark:border-[var(--border)] shadow-xl relative">
      
      {/* HEADER */}
      <header className="max-w-3xl mx-auto pt-16 pb-12 px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 font-sans tracking-tight text-slate-900 dark:text-[var(--text)]">
          {isEn ? "Real-Time Air Quality System Design" : "Architecture Système & Analytics Qualité de l'Air"} <br/>
          <span className="text-slate-500 dark:text-[var(--text-muted)] font-light text-xl sm:text-2xl md:text-3xl">(PostgreSQL & Data Engineering)</span>
        </h1>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-sans mb-10 text-slate-600 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border)] pb-8">
          <div>
            <strong>{isEn ? "Author" : "Auteur"}</strong><br/>
            NDINGA OBA Olivier Vertu
          </div>
          <div>
            <strong>Framework</strong><br/>
            {isEn ? "Relational Data Modeling (3NF)" : "Modélisation Relationnelle (3NF)"}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">PostgreSQL</span>
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">Data Engineering</span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 whitespace-nowrap">SQL DDL</span>
          </div>
        </div>

        {/* ABSTRACT */}
        <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-12 text-left md:text-justify md:hyphens-auto">
          <p>
            <strong>{isEn ? "Project Goal:" : "Le but du projet :"}</strong> {isEn 
              ? "Design an end-to-end event-driven data platform for monitoring global air quality. It leverages the OpenAQ API to ingest real-time data into a highly optimized, 3NF normalized PostgreSQL database, handling millions of measurements with strategic indexing."
              : "Concevoir une plateforme de données événementielle de A à Z pour surveiller la qualité de l'air mondial. Elle utilise l'API OpenAQ pour ingérer des données en temps réel dans une base PostgreSQL hautement optimisée (norme 3NF), capable de gérer des millions de mesures grâce à une indexation stratégique."
            }
          </p>
        </section>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 text-lg leading-relaxed text-slate-800 dark:text-[var(--text)]">
        
        {/* SECTION 1: DATABASE SCHEMA */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            <h2 className="text-2xl font-bold font-sans">
              {isEn ? "1. Relational Database Modeling (3NF)" : "1. Modélisation de la Base de Données (3NF)"}
            </h2>
          </div>
          
          <p className="mb-8 text-base text-slate-600 dark:text-[var(--text-muted)] text-left md:text-justify md:hyphens-auto">
            {isEn 
              ? "To ensure data integrity and query efficiency, the database was strictly normalized to the Third Normal Form (3NF). We separated entities into dimension tables (cities, stations, pollutants) and a central fact table (measurements). Foreign keys guarantee referential integrity." 
              : "Pour garantir l'intégrité des données et l'efficacité des requêtes, la base a été strictement normalisée en 3ème Forme Normale (3NF). Nous avons séparé les entités en tables de dimension (villes, stations, polluants) et une table de faits centrale (mesures). Les clés étrangères garantissent l'intégrité référentielle."
            }
          </p>

          <DatabaseSchema />
        </section>

        {/* SECTION 2: CODE IMPLEMENTATION */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            <h2 className="text-2xl font-bold font-sans">
              {isEn ? "2. Database Schema Definition" : "2. Définition du Schéma de Base de Données"}
            </h2>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden mt-8 font-sans">
            <div className="flex items-center border-b border-slate-800 bg-slate-900 px-4 pt-3 gap-2">
              <button 
                onClick={() => setActiveTab('dbml')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'dbml' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                schema.dbml
              </button>
              <button 
                onClick={() => setActiveTab('sql')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'sql' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                init.sql (PostgreSQL)
              </button>
            </div>
            
            <div className="p-4 bg-slate-950 overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono leading-relaxed text-slate-300">
                {activeTab === 'dbml' ? (
                  <code>{dbmlCode}</code>
                ) : (
                  <code className="text-slate-500 italic">
                    {isEn ? "-- Waiting for the PostgreSQL DDL script..." : "-- En attente du script SQL de création complet (CREATE TABLE, contraintes, index)..."}
                  </code>
                )}
              </pre>
            </div>
          </div>
        </section>
        
      </main>
    </article>
  );
}
