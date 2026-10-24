export type ContentType = "projet" | "papier" | "demo";

// Un "papier" est composé de blocs dans l'ordre voulu : texte, vidéo, texte, vidéo...
export type Block =
  | { kind: "text"; text: { fr: string; en: string } }
  | { kind: "video"; url?: string; caption: { fr: string; en: string } };

export type ContentItem = {
  id: string;
  type: ContentType;
  featured?: boolean; // Indique si le projet fait partie des projets majeurs
  showOnHub?: boolean; // Indique si le projet est affiché sous forme de tuile active sur l'accueil (Hub)
  hasCustomView?: boolean; // Indique si le projet possède son propre composant d'article dédié
  tileIndex?: string; // Code affiché sur la tuile du Hub (ex: "02.GA")
  tileLabel?: { fr: string; en: string }; // Titre court pour la tuile du Hub
  tileDescription?: { fr: string; en: string }; // Description courte pour la tuile du Hub
  tileTags?: string[]; // Tags courts pour la tuile du Hub
  domains: string[]; // un contenu peut appartenir à plusieurs domaines (swarm, ml, robotics, algo, heuristics, physics)
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
  tags?: string[];
  githubUrl?: string;
  demoUrl?: string; // Hugging Face / Démo interactive
  videoUrl?: string; // Vidéo explicative
  blocks?: Block[]; // Utilisé seulement pour le type "papier"
};

export const content: ContentItem[] = [
  {
    id: "swarm-tda-iridia",
    type: "projet",
    featured: true,
    showOnHub: false, // Mettre à true dès que la vue interactive dédiée est publiée
    hasCustomView: false,
    tileIndex: "01.TDA",
    tileLabel: { fr: "Essaim & TDA", en: "Swarm & TDA" },
    tileDescription: {
      fr: "Imitation en essaim & Analyse Topologique (IRIDIA/ULB).",
      en: "Swarm behavior & Topological Analysis (IRIDIA/ULB).",
    },
    tileTags: ["TDA", "Python", "C++", "Wasserstein"],
    domains: ["swarm", "robotics"],
    title: {
      fr: "🛸 Imitation Systématique en Essaim par Analyse Topologique des Données (TDA)",
      en: "🛸 Systematic Swarm Behavior Imitation via Topological Data Analysis (TDA)",
    },
    summary: {
      fr: "Cadre théorique et expérimental développé au laboratoire IRIDIA (ULB). Imitation de comportements collectifs de robots autonomes combinant l'Analyse Topologique des Données (TDA), la décomposition de Helmholtz-Hodge (NHHD) et la métrique de Wasserstein pour le transfert trans-architecture (EvoStick ➔ AutoMoDe-Chocolate) et l'imitation de bancs de poissons.",
      en: "Theoretical & experimental framework developed at IRIDIA research lab (ULB). Systematic swarm behavior imitation combining Topological Data Analysis (TDA), Natural Helmholtz-Hodge Decomposition (NHHD), and Wasserstein metrics for cross-architecture transfer (EvoStick ➔ AutoMoDe-Chocolate) and fish schooling imitation.",
    },
    tags: ["TDA", "Swarm Robotics", "Python", "C++", "Wasserstein", "IRIDIA", "ULB"],
    githubUrl: "https://github.com/Vertu5",
  },
  {
    id: "nsga2-promethee2-agricultural",
    type: "projet",
    featured: true,
    showOnHub: true,
    hasCustomView: true,
    tileIndex: "02.GA",
    tileLabel: { fr: "Optimisation Génétique", en: "Genetic Optimization" },
    tileDescription: {
      fr: "Modélisation POO & Algorithme génétique multi-objectifs (NSGA-II).",
      en: "OOP Modeling & Multi-objective genetic algorithm (NSGA-II).",
    },
    tileTags: ["POO", "Python", "NSGA-II", "Optimisation"],
    domains: ["heuristics", "algo"],
    title: {
      fr: "🌾 Optimisation Évolutive Spatiale Multi-Objectifs (NSGA-II + PROMETHEE II)",
      en: "🌾 Multi-Objective Spatial Evolutionary Optimization (NSGA-II & PROMETHEE II)",
    },
    summary: {
      fr: "Moteur d'optimisation évolutive haute performance pour l'allocation parcellaire agricole. Algorithme NSGA-II vectorisé (dominance de Pareto pure sur la Compacité, Proximité et Productivité sous contrainte budgétaire), couplé à l'analyse multicritère PROMETHEE II et visualisations 3D interactives.",
      en: "High-performance evolutionary optimization engine for spatial agricultural parcel allocation. Pure vectorized Pareto NSGA-II optimization (Compactness, Proximity, Productivity under budget ceiling) coupled with PROMETHEE II MCDA ranking and 3D interactive visualizations.",
    },
    tags: ["NSGA-II", "PROMETHEE II", "Python", "Genetic Algorithms", "Plotly 3D", "Graph BFS"],
    githubUrl: "https://github.com/Vertu5/genetic_agricultural_optimization",
  },
  {
    id: "urban-air-pollution-ml",
    type: "projet",
    featured: true,
    showOnHub: true,
    hasCustomView: true,
    tileIndex: "03.ML",
    tileLabel: { fr: "Pollution ML", en: "Pollution ML" },
    tileDescription: {
      fr: "Pipeline Machine Learning spatiotemporel (ULB).",
      en: "Spatio-temporal Machine Learning pipeline (ULB).",
    },
    tileTags: ["ML", "Python", "PyTorch", "SpatioTemporal"],
    domains: ["ml", "algo"],
    title: {
      fr: "🤖 Prédiction Spatiotemporelle de la Pollution Urbaine (Machine Learning)",
      en: "🤖 Spatio-Temporal Air Pollution Prediction (Machine Learning Pipeline)",
    },
    summary: {
      fr: "Pipeline complet de Machine Learning pour l'analyse spatiotemporelle et la prédiction haute précision des niveaux de pollution urbaine (ULB ML Challenge). Extraction de caractéristiques géographiques complexes, ingénierie de variables et modèles prédictifs.",
      en: "Comprehensive Machine Learning pipeline for spatio-temporal analysis and high-precision urban air pollution prediction (ULB ML Challenge). Complex geographic feature engineering, time-series analysis, and predictive modeling.",
    },
    tags: ["Machine Learning", "Python", "PyTorch", "SpatioTemporal", "Scikit-Learn", "ULB"],
    githubUrl: "https://github.com/Vertu5/urban-air-pollution-ml",
  },
  {
    id: "igaming-databricks-lakehouse",
    type: "projet",
    featured: true,
    showOnHub: true,
    hasCustomView: true,
    tileIndex: "04.DBX",
    tileLabel: { fr: "Lakehouse iGaming & IA", en: "iGaming Lakehouse & AI" },
    tileDescription: {
      fr: "Architecture Médaillon Databricks, CI/CD, ML & Text-to-SQL.",
      en: "Databricks Medallion Lakehouse, CI/CD, ML & Text-to-SQL.",
    },
    tileTags: ["Databricks", "Delta Lake", "SQL", "CI/CD", "ML", "Text-to-SQL"],
    domains: ["algo", "ml"],
    title: {
      fr: "🎰 Architecture Lakehouse iGaming, CI/CD Databricks, Data Science & Text-to-SQL Sécurisé",
      en: "🎰 iGaming Lakehouse Architecture, Databricks CI/CD, Data Science & Guarded Text-to-SQL",
    },
    summary: {
      fr: "Pipeline médaillon de bout en bout sur Databricks (Unity Catalog, Delta Lake, Serverless SQL) traitant 4,65M de tours de machines à sous. Déploiement déclaratif CI/CD par Databricks Asset Bundles (échantillon 5% dev ➔ 100% prod avec contrôles assert_true bloquants), segmentation RFM & KMeans, détection d'anomalies IsolationForest, modèle de Churn MLflow @champion (AUC 0,75) et moteur Text-to-SQL sécurisé par 4 boucliers anti-hallucinations.",
      en: "End-to-end medallion pipeline on Databricks (Unity Catalog, Delta Lake, Serverless SQL) processing 4.65M slot spins. Declarative CI/CD via Databricks Asset Bundles (5% dev sample ➔ 100% prod with blocking assert_true quality gates), RFM & KMeans segmentation, IsolationForest anomaly detection, MLflow @champion Churn prediction (AUC 0.75), and a 4-shield Guarded Text-to-SQL engine.",
    },
    tags: ["Databricks", "Delta Lake", "SQL", "Asset Bundles CI/CD", "MLflow", "Text-to-SQL"],
    githubUrl: "https://github.com/Vertu5/igaming-databricks-lakehouse",
  },
];

export const featuredProjectTiles = content
  .filter((item) => item.showOnHub)
  .map((item) => ({
    id: item.id,
    index: item.tileIndex ?? "PRJ",
    label: item.tileLabel ?? item.title,
    description: item.tileDescription ?? item.summary,
    tags: item.tileTags ?? item.tags ?? [],
    hasCustomView: Boolean(item.hasCustomView),
  }));

