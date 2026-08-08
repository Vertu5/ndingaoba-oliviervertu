export type ContentType = "projet" | "papier" | "demo";

// Un "papier" est composé de blocs dans l'ordre voulu : texte, vidéo, texte, vidéo...
export type Block =
  | { kind: "text"; text: { fr: string; en: string } }
  | { kind: "video"; url?: string; caption: { fr: string; en: string } };

export type ContentItem = {
  id: string;
  type: ContentType;
  featured?: boolean; // Indique si le projet est affiché dans la grille 2x2 des Projets Phares sur l'accueil
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
    id: "air-quality-system-design",
    type: "projet",
    featured: true,
    domains: ["algo", "ml"],
    title: {
      fr: "⚙️ Architecture Système & Analytics de la Qualité de l'Air en Temps Réel",
      en: "⚙️ Real-Time Air Quality System Design & Relational Data Architecture",
    },
    summary: {
      fr: "Conception de A à Z d'une plateforme événementielle : modélisation de base de données relationnelle normalisée (3NF), écriture des scripts DDL SQL avec indexation optimisée, pipeline d'ingestion streaming temps réel, API REST FastAPI et conteneurisation Docker.",
      en: "End-to-end event-driven platform design: 3NF normalized relational database modeling, SQL DDL scripts with optimized indexing, real-time streaming ingestion pipeline, FastAPI REST API, and Docker containerization.",
    },
    tags: ["PostgreSQL", "SQL DDL", "FastAPI", "Data Modeling 3NF", "Docker", "DevOps"],
    githubUrl: "https://github.com/Vertu5/air-quality-system-design",
  },
];
