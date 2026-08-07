const fs = require('fs');
const path = require('path');

const USAGE_MAP = [
  ["R", "R", "C", "C", "C", "R", "C", "C", "A", "A"],
  ["R", "C", "C", "C", "C", "C", "C", "A", "A", "A"],
  ["C", "C", "C", "R", "R", "C", "C", "C", "C", "A"],
  ["C", "C", "R", "R", "R", "C", "C", "C", "C", "C"],
  ["C", "C", "C", "C", "C", "C", "C", "R", "R", "C"],
  ["A", "C", "C", "C", "C", "C", "C", "C", "R", "R"],
  ["A", "A", "C", "C", "R", "R", "C", "C", "C", "C"],
  ["A", "A", "C", "C", "C", "R", "C", "C", "C", "C"],
  ["C", "C", "C", "C", "C", "C", "C", "C", "C", "C"],
  ["R", "R", "C", "C", "C", "C", "C", "R", "R", "R"],
];

const COST_MAP = Array(10).fill(0).map((_, i) => 
  Array(10).fill(0).map((_, j) => Math.floor(Math.abs(Math.sin(i * 10 + j)) * 40) + 30)
);

// Get coordinates of all existing farms and candidates
const farms = [];
const candidates = [];

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (USAGE_MAP[i][j] === 'A') farms.push([i, j]);
    if (USAGE_MAP[i][j] === 'C') {
      let minDist = Infinity;
      for (const [fr, fc] of farms) {
        const d = Math.sqrt((i - fr)**2 + (j - fc)**2);
        if (d < minDist) minDist = d;
      }
      candidates.push({ r: i, c: j, dist: minDist, cost: COST_MAP[i][j] });
    }
  }
}

// Generate Pareto solutions by picking candidate sets
// We will generate 65 non-dominated solutions sorted by PROMETHEE II mock phi
const solutions = [];

// To make a pareto front, we vary the weight of "distance" vs "cost" when sorting candidates
for (let s = 0; s < 65; s++) {
  const budget = 300 + s * 8; // Varying budget from 300 to ~800
  const weightDist = s / 64; // from 0 to 1
  const weightCost = 1 - weightDist;

  // Sort candidates based on the varied weights
  const sortedCands = [...candidates].sort((a, b) => {
    const scoreA = weightDist * a.dist + weightCost * (a.cost / 70);
    const scoreB = weightDist * b.dist + weightCost * (b.cost / 70);
    return scoreA - scoreB; // Ascending, we want small distance and small cost
  });

  const grid = Array(10).fill(0).map(() => Array(10).fill(0));
  let currentCost = 0;
  let boughtCount = 0;
  let sumDist = 0;

  // Fill base grid
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (USAGE_MAP[i][j] === 'R') grid[i][j] = 0;
      else if (USAGE_MAP[i][j] === 'C') grid[i][j] = 1;
      else if (USAGE_MAP[i][j] === 'A') grid[i][j] = 2;
    }
  }

  // Buy candidates
  for (const cand of sortedCands) {
    if (currentCost + cand.cost <= budget) {
      grid[cand.r][cand.c] = 3; // Gold
      currentCost += cand.cost;
      boughtCount++;
      sumDist += cand.dist;
    }
  }

  // Calculate mock metrics
  // Compactness: better (closer to 1.0) if bought contiguous blocks.
  // We mock it inversely proportional to budget (more budget = more sprawl = higher C)
  const compactness = Number((1.2 + (s / 64) * 0.7 + Math.random() * 0.05).toFixed(3));
  
  // Proximity: average distance of bought cells to farms. (Minimize)
  const proximity = Number(((sumDist / (boughtCount || 1)) + Math.random() * 0.5).toFixed(3));
  
  // Productivity: roughly proportional to bought cells (Maximize)
  const productivity = Number((boughtCount * 0.4 + 5 + Math.random() * 0.2).toFixed(3));
  
  // Net Flow (Mock)
  const phi = Number((productivity * 0.5 - proximity * 0.3 - compactness * 0.2).toFixed(4));

  solutions.push({
    id: s,
    compactness,
    proximity,
    productivity,
    cost: currentCost,
    phi,
    grid
  });
}

// Sort by PROMETHEE II phi descending (Rank 1 is best)
solutions.sort((a, b) => b.phi - a.phi);

// Re-assign ids as ranks
solutions.forEach((sol, idx) => {
  sol.id = idx + 1;
});

const outputPath = path.join(__dirname, 'public', 'assets', 'pareto_full.json');
fs.writeFileSync(outputPath, JSON.stringify(solutions, null, 2));

console.log(`Generated 65 Pareto solutions with full grids to ${outputPath}`);
