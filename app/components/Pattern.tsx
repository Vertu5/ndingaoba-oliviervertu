// Motifs flat-design, un par catégorie. Pas de photos (le contenu réel viendra plus
// tard) : chaque motif traduit visuellement le thème de la tuile, en cohérence avec
// la palette et l'esprit "flat" du site de référence.

function Swarm() {
  const nodes = [
    [14, 20], [38, 10], [58, 26], [80, 14], [92, 32],
    [22, 46], [64, 48], [46, 30], [8, 60], [72, 62],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [2, 7],
    [7, 1], [5, 6], [6, 9], [5, 8], [6, 2],
  ];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.35" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--accent)" fillOpacity="0.7" />
      ))}
    </svg>
  );
}

function Waveform() {
  const bars = Array.from({ length: 22 }, (_, i) => {
    const h = 8 + Math.abs(Math.sin(i * 0.9)) * 42 + (i % 5 === 0 ? 10 : 0);
    return h;
  });
  return (
    <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {bars.map((h, i) => (
        <rect key={i} x={i * 4.6} y={30 - h / 2} width="2.4" height={h} rx="1.2"
          fill="var(--accent)" fillOpacity={0.25 + (h / 60) * 0.5} />
      ))}
    </svg>
  );
}

function PlayGrid() {
  const cells = Array.from({ length: 9 });
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {cells.map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cx = 22 + col * 28;
        const cy = 16 + row * 22;
        return (
          <g key={i} opacity={i === 4 ? 1 : 0.28}>
            <rect x={cx - 11} y={cy - 9} width="22" height="18" rx="2"
              fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <path d={`M ${cx - 3} ${cy - 4.5} L ${cx - 3} ${cy + 4.5} L ${cx + 5} ${cy} Z`}
              fill="var(--accent)" />
          </g>
        );
      })}
    </svg>
  );
}

function CodeBrackets() {
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <text x="6" y="46" fontSize="40" fontFamily="var(--font-mono)" fill="var(--accent)" fillOpacity="0.5">{"{"}</text>
      <text x="70" y="46" fontSize="40" fontFamily="var(--font-mono)" fill="var(--accent)" fillOpacity="0.5">{"}"}</text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={38} y={20 + i * 10} width={16 - i * 4} height="3" rx="1.5"
          fill="var(--accent)" fillOpacity="0.4" />
      ))}
    </svg>
  );
}

function DocumentSeal() {
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect x="24" y="8" width="40" height="54" rx="2" fill="none" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="30" y={18 + i * 8} width={i === 4 ? 16 : 28} height="2.4" rx="1.2"
          fill="var(--accent)" fillOpacity="0.35" />
      ))}
      <circle cx="76" cy="50" r="12" fill="none" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.6" />
      <path d="M 71 50 L 75 54 L 82 45" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    </svg>
  );
}

function RadiatingDots() {
  const rings = [10, 18, 26];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {rings.map((r, i) => (
        <circle key={i} cx="50" cy="35" r={r} fill="none" stroke="var(--accent)"
          strokeWidth="0.5" strokeOpacity={0.5 - i * 0.12} strokeDasharray="2 3" />
      ))}
      <circle cx="50" cy="35" r="3" fill="var(--accent)" fillOpacity="0.8" />
    </svg>
  );
}

function Gears() {
  const gear = (cx: number, cy: number, r: number, teeth: number) => {
    const ticks = Array.from({ length: teeth }, (_, i) => {
      const a = (i / teeth) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r;
      const x2 = cx + Math.cos(a) * (r + 4);
      const y2 = cy + Math.sin(a) * (r + 4);
      return { x1, y1, x2, y2 };
    });
    return (
      <g key={`${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.5" />
        <circle cx={cx} cy={cy} r={r * 0.35} fill="var(--accent)" fillOpacity="0.4" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.45" />
        ))}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {gear(34, 30, 14, 10)}
      {gear(66, 42, 9, 8)}
    </svg>
  );
}

function PathGraph() {
  const nodes = [
    [10, 50], [28, 22], [48, 40], [66, 14], [86, 34], [40, 60], [72, 56],
  ];
  const dimEdges: [number, number][] = [[0, 5], [5, 2], [2, 6], [6, 4]];
  const pathEdges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4]];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {dimEdges.map(([a, b], i) => (
        <line key={`d${i}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.15" />
      ))}
      {pathEdges.map(([a, b], i) => (
        <line key={`p${i}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="var(--accent)" strokeWidth="0.9" strokeOpacity="0.7" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--accent)" fillOpacity={0.3 + (i <= 4 ? 0.5 : 0)} />
      ))}
    </svg>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle cx="50" cy="35" r="3.2" fill="var(--accent)" fillOpacity="0.8" />
      <ellipse cx="50" cy="35" rx="34" ry="12" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4" />
      <ellipse cx="50" cy="35" rx="34" ry="12" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4"
        transform="rotate(60 50 35)" />
      <ellipse cx="50" cy="35" rx="34" ry="12" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4"
        transform="rotate(120 50 35)" />
      <circle cx="84" cy="35" r="1.6" fill="var(--accent)" fillOpacity="0.7" />
    </svg>
  );
}

function DataCurve() {
  const points = [4, 18, 12, 28, 22, 40, 30, 30, 45, 20, 55, 34, 68, 14, 80, 22, 92, 10];
  const path = points
    .reduce<string[]>((acc, v, i) => {
      if (i % 2 !== 0) return acc;
      const x = v;
      const y = 55 - points[i + 1];
      acc.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
      return acc;
    }, [])
    .join(" ");
  return (
    <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.6" />
      {Array.from({ length: points.length / 2 }, (_, i) => (
        <circle key={i} cx={points[i * 2]} cy={55 - points[i * 2 + 1]} r="1.3" fill="var(--accent)" fillOpacity="0.7" />
      ))}
    </svg>
  );
}

function Spark() {
  const rays = 8;
  const lines = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2;
    const inner = 6;
    const outer = 15 + (i % 2 === 0 ? 8 : 3);
    return {
      x1: 50 + Math.cos(a) * inner,
      y1: 35 + Math.sin(a) * inner * 0.7,
      x2: 50 + Math.cos(a) * outer,
      y2: 35 + Math.sin(a) * outer * 0.7,
    };
  });
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="var(--accent)" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.55" />
      ))}
      <circle cx="50" cy="35" r="3.5" fill="var(--accent)" fillOpacity="0.7" />
    </svg>
  );
}

function Chip() {
  const pins = [16, 34, 52, 68, 84];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect x="30" y="15" width="40" height="40" rx="4" fill="none" stroke="var(--accent)" strokeWidth="0.7" strokeOpacity="0.55" />
      {[0, 1, 2].map((r) => (
        <rect key={r} x="38" y={23 + r * 10} width="24" height="4" rx="1" fill="var(--accent)" fillOpacity="0.3" />
      ))}
      {pins.map((y, i) => (
        <g key={i}>
          <line x1="10" y1={y} x2="30" y2={y} stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.4" />
          <line x1="70" y1={y} x2="90" y2={y} stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

function Stars() {
  const stars = [
    [12, 14, 1.6], [30, 30, 1], [50, 10, 1.3], [68, 26, 1.8], [86, 16, 1],
    [20, 48, 1.2], [42, 54, 1.6], [62, 46, 1], [80, 54, 1.4], [8, 34, 0.8],
  ];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="var(--accent)" fillOpacity="0.6" />
      ))}
    </svg>
  );
}

const patterns: Record<string, () => React.JSX.Element> = {
  swarm: Swarm,
  ml: Waveform,
  projets: PlayGrid,
  papiers: DataCurve,
  parcours: DocumentSeal,
  interets: Spark,
  contact: RadiatingDots,
  robotics: Gears,
  heuristics: PathGraph,
  physics: Orbit,
  algo: CodeBrackets,
  informatique: Chip,
  sciences: Stars,
};

export default function Pattern({ id }: { id: string }) {
  const Cmp = patterns[id] ?? RadiatingDots;
  return <Cmp />;
}
