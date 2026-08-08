"use client";

import React, { useState } from 'react';
import { useLang } from "@/app/lib/i18n";
import { Database, Code2, Play, Download, Globe, Server, Check, ArrowRight } from "lucide-react";
import CustomERD from "./CustomERD";
import AirQualityDashboard from "./AirQualityDashboard";
import TimeAnalytics from "./TimeAnalytics";
import PollutantDistribution from "./PollutantDistribution";
import AlertsTable from "./AlertsTable";

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

const sqlCode = `-- =============================================
-- Air Quality Monitoring System
-- PostgreSQL Schema - Complete Script
-- =============================================

-- 1. CITIES
CREATE TABLE cities (
    city_id         SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    country_code    CHAR(2) NOT NULL,                  -- ISO 3166-1 alpha-2
    timezone        VARCHAR(50) NOT NULL,
    latitude        DECIMAL(9,6),
    longitude       DECIMAL(9,6),
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uq_cities_name_country UNIQUE (name, country_code)
);

-- 2. POLLUTANTS
CREATE TABLE pollutants (
    pollutant_id            SERIAL PRIMARY KEY,
    code                    VARCHAR(20) NOT NULL UNIQUE,   -- pm25, no2, pm10...
    display_name            VARCHAR(50) NOT NULL,
    unit                    VARCHAR(20) NOT NULL,
    description             TEXT,
    who_annual_guideline    DECIMAL(8,2),
    who_24h_guideline       DECIMAL(8,2),
    who_1h_guideline        DECIMAL(8,2)
);

-- 3. STATIONS
CREATE TABLE stations (
    station_id              SERIAL PRIMARY KEY,
    openaq_location_id      INTEGER NOT NULL UNIQUE,       -- OpenAQ location ID
    city_id                 INTEGER NOT NULL REFERENCES cities(city_id),
    name                    VARCHAR(200) NOT NULL,
    locality                VARCHAR(150),
    latitude                DECIMAL(9,6) NOT NULL,
    longitude               DECIMAL(9,6) NOT NULL,
    is_mobile               BOOLEAN DEFAULT FALSE,
    is_monitor              BOOLEAN DEFAULT TRUE,
    provider_name           VARCHAR(150),
    timezone                VARCHAR(50),
    last_seen_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEASUREMENTS (fact table)
CREATE TABLE measurements (
    measurement_id          BIGSERIAL PRIMARY KEY,
    station_id              INTEGER NOT NULL REFERENCES stations(station_id),
    pollutant_id            INTEGER NOT NULL REFERENCES pollutants(pollutant_id),
    value                   DECIMAL(10,3) NOT NULL,
    measured_at             TIMESTAMPTZ NOT NULL,          -- UTC
    measured_at_local       TIMESTAMPTZ,
    source                  VARCHAR(50) DEFAULT 'openaq',
    created_at              TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uq_measurement UNIQUE (station_id, pollutant_id, measured_at)
);

-- 5. ALERTS
CREATE TABLE alerts (
    alert_id                BIGSERIAL PRIMARY KEY,
    measurement_id          BIGINT NOT NULL REFERENCES measurements(measurement_id) ON DELETE CASCADE,
    threshold_type          VARCHAR(30) NOT NULL,
    threshold_value         DECIMAL(8,2) NOT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_threshold_type 
        CHECK (threshold_type IN ('who_24h', 'who_annual', 'who_1h', 'custom')),
    
    CONSTRAINT uq_alert_measurement_type 
        UNIQUE (measurement_id, threshold_type)
);

-- =============================================
-- INDEXES (performance)
-- =============================================

CREATE INDEX idx_stations_city 
    ON stations (city_id);

CREATE INDEX idx_meas_station_time 
    ON measurements (station_id, measured_at DESC);

CREATE INDEX idx_meas_pollutant_time 
    ON measurements (pollutant_id, measured_at DESC);

CREATE INDEX idx_meas_time 
    ON measurements (measured_at DESC);

CREATE INDEX idx_alerts_measurement 
    ON alerts (measurement_id);

CREATE INDEX idx_alerts_created 
    ON alerts (created_at DESC);

-- =============================================
-- SEED DATA
-- =============================================

-- Cities
INSERT INTO cities (name, country_code, timezone, latitude, longitude) VALUES
('Brussels', 'BE', 'Europe/Brussels', 50.8503, 4.3517),
('Paris',    'FR', 'Europe/Paris',    48.8566, 2.3522),
('London',   'GB', 'Europe/London',   51.5074, -0.1278);

-- Pollutants + WHO 2021 guidelines
INSERT INTO pollutants (code, display_name, unit, who_annual_guideline, who_24h_guideline, who_1h_guideline) VALUES
('pm25', 'PM2.5', 'µg/m³', 5,   15,  NULL),
('pm10', 'PM10',  'µg/m³', 15,  45,  NULL),
('no2',  'NO₂',   'µg/m³', 10,  25,  NULL),
('o3',   'O₃',    'µg/m³', NULL, 100, NULL),   -- 8-hour mean
('so2',  'SO₂',   'µg/m³', NULL, 40,  NULL);

-- =============================================
-- Useful comments
-- =============================================

COMMENT ON TABLE cities IS 'Monitored cities';
COMMENT ON TABLE pollutants IS 'Pollutants and WHO 2021 air quality guidelines';
COMMENT ON TABLE stations IS 'Air quality monitoring stations (from OpenAQ)';
COMMENT ON TABLE measurements IS 'Hourly air quality measurements (fact table)';
COMMENT ON TABLE alerts IS 'Alerts generated when WHO thresholds are exceeded';`;

const dockerComposeCode = `version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: air_quality_db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: adminpassword
      POSTGRES_DB: air_quality
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # Automatically run init.sql on startup to create the schema and seed data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

volumes:
  postgres_data:`;

const advancedSqlCode = `-- =============================================
-- ADVANCED ANALYTICS VIEWS
-- =============================================

-- Using Window Functions to find the latest measurement per city and pollutant.
-- This offloads the heavy aggregation from the frontend to the database.
CREATE OR REPLACE VIEW vw_latest_city_metrics AS
WITH RankedMeasurements AS (
    SELECT 
        c.name AS city_name,
        p.code AS pollutant_code,
        m.value,
        m.measured_at,
        ROW_NUMBER() OVER (
            PARTITION BY c.city_id, p.pollutant_id 
            ORDER BY m.measured_at DESC
        ) as rn
    FROM measurements m
    INNER JOIN stations s ON m.station_id = s.station_id
    INNER JOIN cities c ON s.city_id = c.city_id
    INNER JOIN pollutants p ON m.pollutant_id = p.pollutant_id
)
SELECT 
    city_name,
    pollutant_code,
    value,
    measured_at
FROM RankedMeasurements
WHERE rn = 1;

-- Grant public read access to the view
GRANT SELECT ON vw_latest_city_metrics TO anon;
GRANT SELECT ON vw_latest_city_metrics TO authenticated;`;

export default function SystemDesign() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  
  const [activeTab, setActiveTab] = useState<'erd' | 'sql' | 'docker' | 'advanced-sql'>('erd');

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
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">Supabase (PostgreSQL)</span>
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">Python</span>
            <span className="bg-slate-100 dark:bg-[var(--bg-elevated)] px-2 py-1 rounded border border-slate-200 dark:border-[var(--border)] whitespace-nowrap">GitHub Actions (CI/CD)</span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 whitespace-nowrap">SQL DDL</span>
          </div>
        </div>

        {/* ABSTRACT */}
        <section className="text-base md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-12 text-left md:text-justify md:hyphens-auto">
          <p className="mb-4">
            <strong>{isEn ? "Project Goal:" : "Le but du projet :"}</strong> {isEn 
              ? "Design an end-to-end event-driven data platform for monitoring global air quality. It leverages the OpenAQ API to ingest real-time data into a highly optimized, 3NF normalized PostgreSQL database, handling millions of measurements with strategic indexing."
              : "Concevoir une plateforme de données événementielle de A à Z pour surveiller la qualité de l'air mondial. Elle utilise l'API OpenAQ pour ingérer des données en temps réel dans une base PostgreSQL hautement optimisée (norme 3NF), capable de gérer des millions de mesures grâce à une indexation stratégique."
            }
          </p>
          <p className="text-sm md:text-base border-l-4 border-blue-500 pl-4 text-slate-600 dark:text-slate-400">
            <strong>{isEn ? "☁️ Cloud & Serverless Architecture:" : "☁️ Architecture Cloud & Serverless :"}</strong> {isEn
              ? "To ensure a fully autonomous and free data pipeline, the database is hosted on Supabase and the Python data ingestion script runs automatically via GitHub Actions CI/CD cron jobs."
              : "Pour garantir un flux de données (Data Pipeline) 100% autonome, la base de données est hébergée sur Supabase et le script Python d'ingestion est exécuté automatiquement par les serveurs CI/CD de GitHub Actions."
            }
          </p>
        </section>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 text-lg leading-relaxed text-slate-800 dark:text-[var(--text)]">
        
        {/* DASHBOARD COMPONENT */}
        <AirQualityDashboard isEn={isEn} />

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

        </section>

        {/* SECTION 2: CODE IMPLEMENTATION */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            <h2 className="text-2xl font-bold font-sans">
              {isEn ? "2. Database Schema Definition" : "2. Définition du Schéma de Base de Données"}
            </h2>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden mt-8 font-sans">
            <div className="flex bg-slate-900 border-b border-slate-800">
              <button 
                onClick={() => setActiveTab('erd')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'erd' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                {isEn ? "Entity-Relationship Diagram (ERD)" : "Diagramme Entité-Association (ERD)"}
              </button>
              <button 
                onClick={() => setActiveTab('sql')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'sql' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                init.sql (PostgreSQL)
              </button>
              <button 
                onClick={() => setActiveTab('docker')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'docker' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                docker-compose.yml
              </button>
              <button 
                onClick={() => setActiveTab('advanced-sql')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'advanced-sql' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                Advanced SQL (Views)
              </button>
            </div>
            
            <div className="bg-slate-950 overflow-x-auto">
              {activeTab === 'erd' && (
                <div className="p-4">
                  <CustomERD isEn={isEn} />
                </div>
              )}
              {(activeTab === 'sql' || activeTab === 'docker' || activeTab === 'advanced-sql') && (
                <div className="p-4">
                  <pre className="text-xs sm:text-sm font-mono leading-relaxed text-slate-300">
                    {activeTab === 'sql' && <code>{sqlCode}</code>}
                    {activeTab === 'docker' && <code>{dockerComposeCode}</code>}
                    {activeTab === 'advanced-sql' && <code>{advancedSqlCode}</code>}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: DATA ENGINEERING USE CASES */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 border-b border-slate-200 dark:border-[var(--border)] pb-2">
            <h2 className="text-2xl font-bold font-sans">
              {isEn ? "3. Data Engineering Use Cases" : "3. Cas d'Usage Data Engineering"}
            </h2>
          </div>
          
          <TimeAnalytics isEn={isEn} />
          <PollutantDistribution isEn={isEn} />
          <AlertsTable isEn={isEn} />
          
        </section>
        
      </main>
    </article>
  );
}
