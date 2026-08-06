export type ContentType = "projet" | "papier" | "demo";

// Un "papier" est composé de blocs dans l'ordre voulu : texte, vidéo, texte, vidéo...
export type Block =
  | { kind: "text"; text: { fr: string; en: string } }
  | { kind: "video"; url?: string; caption: { fr: string; en: string } };

export type ContentItem = {
  id: string;
  type: ContentType;
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
    id: "swarm-robotics-iridia",
    type: "projet",
    domains: ["swarm", "robotics"],
    title: {
      fr: "Modélisation & Contrôle d'Intelligence en Essaim (Swarm Robotics)",
      en: "Swarm Intelligence & Multi-Robot Control (Swarm Robotics)",
    },
    summary: {
      fr: "Conception d'outils mathématiques et d'algorithmes décentralisés pour modéliser le comportement collectif de groupes de robots autonomes au laboratoire IRIDIA.",
      en: "Design of mathematical tools and decentralized algorithms to model collective behavior in autonomous robot swarms at IRIDIA research lab.",
    },
    tags: ["Python", "C++", "Swarm Intelligence", "Multi-Robot", "IRIDIA"],
    githubUrl: "https://github.com/Vertu5",
  },
  {
    id: "tda-machine-learning",
    type: "papier",
    domains: ["ml", "algo"],
    title: {
      fr: "Analyse Topologique des Données (TDA) & Deep Learning",
      en: "Topological Data Analysis (TDA) & Deep Learning",
    },
    summary: {
      fr: "Étude des invariants géométriques et des structures topologiques dans des espaces de données à haute dimension pour enrichir les modèles de Machine Learning.",
      en: "Study of geometric invariants and topological structures in high-dimensional data spaces to enhance Machine Learning model generalization.",
    },
    tags: ["Python", "PyTorch", "Topological Data Analysis", "Machine Learning", "ULB"],
    githubUrl: "https://github.com/Vertu5",
    blocks: [
      {
        kind: "text",
        text: {
          fr: "L'analyse topologique des données (TDA) extrait des caractéristiques géométriques persistantes qui échappent aux méthodes statistiques traditionnelles.",
          en: "Topological Data Analysis (TDA) extracts persistent geometric features that traditional statistical methods miss.",
        },
      },
      {
        kind: "video",
        caption: {
          fr: "Visualisation de l'homologie persistante sur des ensembles de données complexes.",
          en: "Visualization of persistent homology on complex data point clouds.",
        },
      },
      {
        kind: "text",
        text: {
          fr: "Intégration des signatures topologiques comme représentations explicatives pour les réseaux de neurones profonds.",
          en: "Integration of topological signatures as explanatory representations for deep neural networks.",
        },
      },
    ],
  },
  {
    id: "devops-data-engineering",
    type: "projet",
    domains: ["algo", "ml"],
    title: {
      fr: "Pipelines Data Engineering & Architecture Cloud Native",
      en: "Data Engineering Pipelines & Cloud Native Architecture",
    },
    summary: {
      fr: "Mise en place de pipelines de traitement de données distribuées, conteneurisation des services avec Docker et orchestration sous Kubernetes.",
      en: "Implementation of distributed data processing pipelines, service containerization with Docker, and Kubernetes orchestration.",
    },
    tags: ["Docker", "Kubernetes", "Data Engineering", "IBM", "Git/GitHub"],
    githubUrl: "https://github.com/Vertu5",
  },
  {
    id: "metaheuristics-optimization",
    type: "demo",
    domains: ["heuristics", "algo"],
    title: {
      fr: "Algorithmes Métaheuristiques & Optimisation Combinatoire",
      en: "Metaheuristic Algorithms & Combinatorial Optimization",
    },
    summary: {
      fr: "Démos interactives d'algorithmes de recherche localisée, algorithmes génétiques et optimisation par colonies de fourmis.",
      en: "Interactive demos of local search algorithms, genetic algorithms, and ant colony optimization for complex problems.",
    },
    tags: ["Optimization", "Metaheuristics", "Algorithms", "Python"],
    githubUrl: "https://github.com/Vertu5",
  },
];
