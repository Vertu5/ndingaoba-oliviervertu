"use client";

import React, { useEffect, useState } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';

const TableNode = ({ id, name, columns, isCenter = false }: { id: string, name: string, columns: {name: string, type: string, pk?: boolean, fk?: boolean}[], isCenter?: boolean }) => (
  <div id={id} className={`flex flex-col bg-slate-900 border ${isCenter ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-700'} rounded-lg overflow-hidden text-xs font-mono w-full sm:w-64 z-10 bg-opacity-95`}>
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

export default function CustomERD() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We delay the render of Xarrow until the component is mounted in the browser 
    // so that it can correctly calculate the positions of the divs.
    setMounted(true);
    
    // Also trigger a re-render on resize to keep arrows attached
    const handleResize = () => setMounted(m => !m);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full overflow-x-auto flex flex-col justify-center items-center p-8 bg-slate-950 rounded-xl border border-slate-800 shadow-inner min-h-[400px]">
      <Xwrapper>
        
        {/* ROW 1: Pollutants & Cities */}
        <div className="flex justify-center gap-16 md:gap-32 mb-16 w-full max-w-4xl">
          <TableNode id="node_pollutants" name="pollutants" columns={[
            {name: 'pollutant_id', type: 'serial', pk: true},
            {name: 'code', type: 'varchar'},
            {name: 'display_name', type: 'varchar'},
            {name: 'unit', type: 'varchar'},
            {name: 'who_annual_guideline', type: 'decimal'},
          ]} />
          
          <TableNode id="node_cities" name="cities" columns={[
            {name: 'city_id', type: 'serial', pk: true},
            {name: 'name', type: 'varchar'},
            {name: 'country_code', type: 'char(2)'},
            {name: 'timezone', type: 'varchar'},
            {name: 'latitude', type: 'decimal'},
            {name: 'longitude', type: 'decimal'},
          ]} />
        </div>

        {/* ROW 2: Measurements & Stations */}
        <div className="flex justify-center gap-16 md:gap-32 mb-16 w-full max-w-4xl">
          <TableNode id="node_measurements" name="measurements" isCenter={true} columns={[
            {name: 'measurement_id', type: 'bigserial', pk: true},
            {name: 'station_id', type: 'integer', fk: true},
            {name: 'pollutant_id', type: 'integer', fk: true},
            {name: 'value', type: 'decimal'},
            {name: 'measured_at', type: 'timestamptz'},
            {name: 'source', type: 'varchar'},
          ]} />
          
          <TableNode id="node_stations" name="stations" columns={[
            {name: 'station_id', type: 'serial', pk: true},
            {name: 'openaq_location_id', type: 'integer'},
            {name: 'city_id', type: 'integer', fk: true},
            {name: 'name', type: 'varchar'},
            {name: 'latitude', type: 'decimal'},
            {name: 'longitude', type: 'decimal'},
            {name: 'is_monitor', type: 'boolean'},
          ]} />
        </div>

        {/* ROW 3: Alerts */}
        <div className="flex justify-start w-full max-w-4xl px-4 md:px-0">
          <TableNode id="node_alerts" name="alerts" columns={[
            {name: 'alert_id', type: 'bigserial', pk: true},
            {name: 'measurement_id', type: 'bigint', fk: true},
            {name: 'threshold_type', type: 'varchar'},
            {name: 'threshold_value', type: 'decimal'},
            {name: 'created_at', type: 'timestamptz'},
          ]} />
        </div>

        {/* ARROWS */}
        {mounted && (
          <>
            <Xarrow start="node_pollutants" end="node_measurements" color="#3b82f6" strokeWidth={2} path="straight" dashness={{ strokeLen: 10, nonStrokeLen: 5, animation: -1 }} showHead={true} />
            <Xarrow start="node_cities" end="node_stations" color="#64748b" strokeWidth={2} path="straight" />
            <Xarrow start="node_stations" end="node_measurements" color="#3b82f6" strokeWidth={2} path="straight" dashness={{ strokeLen: 10, nonStrokeLen: 5, animation: -1 }} showHead={true} />
            <Xarrow start="node_measurements" end="node_alerts" color="#ef4444" strokeWidth={2} path="straight" />
          </>
        )}
        
      </Xwrapper>
    </div>
  );
}
