"use client";

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      fontFamily: 'monospace',
    });

    if (chart) {
      const renderChart = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const result = await mermaid.render(id, chart);
          setSvgContent(result.svg);
        } catch (err) {
          console.error("Mermaid parsing error:", err);
        }
      };
      renderChart();
    }
  }, [chart]);

  return (
    <div 
      className="w-full overflow-x-auto flex justify-center items-center p-8 bg-slate-950 rounded-xl border border-slate-800 shadow-inner min-h-[400px]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
