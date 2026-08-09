export type Lang = "fr" | "en";

export type DocEntry = {
  id: string;
  type: "diplome" | "certification" | "lettre";
  title: { fr: string; en: string };
  issuer: string;
  date: string; // ex: "2025"
  detail?: { fr: string; en: string }; // affiché quand on clique dessus
  fileUrl?: string; // lien vers le PDF/scan du document, si disponible
};

export type Category = {
  id: string;
  index: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
  documents?: DocEntry[];
};

// Seulement les compartiments "spéciaux", en dehors des domaines.
// Les domaines (Swarm, ML, etc.) vivent dans domains.ts, séparément.

// Lien vers ton CV complet en PDF. Laisse `null` tant que tu n'as pas de fichier —
// le bouton s'affichera alors désactivé avec une note "à ajouter".
export const cvUrl: string | null = "/CV_Olivier_NDINGA_OBA.pdf";

export const bio: Category = {
  id: "bio",
  index: "DOC",
  label: { fr: "Bio", en: "Bio" },
  description: {
    fr: "Présentation, parcours, diplômes, certifications, lettres de recommandation.",
    en: "Introduction, background, diplomas, certifications, recommendation letters.",
  },
  documents: [
    {
      id: "master-ulb",
      type: "diplome",
      title: {
        fr: "Ingénieur civil en informatique (Mention Distinction)",
        en: "Master of Science in Computer Science Engineering (With Distinction)",
      },
      issuer: "Université Libre de Bruxelles (ULB) & IRIDIA",
      date: "ULB",
      detail: {
        fr: "Spécialisation en Intelligence Artificielle, Analyse Topologique des Données et Modélisation en Essaim au laboratoire IRIDIA.",
        en: "Specialized in Artificial Intelligence, Topological Data Analysis, and Swarm Modeling at IRIDIA research lab.",
      },
    },
    {
      id: "bachelier-erm",
      type: "diplome",
      title: {
        fr: "Bachelier en Sciences de l'Ingénieur",
        en: "Bachelor of Science in Engineering Sciences",
      },
      issuer: "École Royale Militaire de Belgique (ERM) — Faculté Polytechnique",
      date: "ERM",
      detail: {
        fr: "Faculté Polytechnique. Rigueur académique et formation intensive au leadership et au management d'équipe.",
        en: "Faculty of Engineering. Academic rigor combined with intensive leadership and team management training.",
      },
    },
    {
      id: "certif-google-ai",
      type: "certification",
      title: { fr: "Google AI Professional", en: "Google AI Professional" },
      issuer: "Google / Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/d5eeb18371dd4b2f2d16a616beded9b8",
      detail: {
        fr: "Certification professionnelle Google AI sur la modélisation et l'intelligence artificielle.",
        en: "Google AI professional certification covering AI modeling and applications.",
      },
    },
    {
      id: "certif-rl",
      type: "certification",
      title: { fr: "Reinforcement Learning Specialization", en: "Reinforcement Learning Specialization" },
      issuer: "University of Alberta / Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/acf19969352d9928d0d8d0645cc65dcd",
      detail: {
        fr: "Spécialisation en apprentissage par renforcement, MDPs, Q-Learning et approximations.",
        en: "Specialization in reinforcement learning, MDPs, Q-Learning, and function approximation.",
      },
    },
    {
      id: "certif-git-github",
      type: "certification",
      title: { fr: "Introduction to Git and GitHub", en: "Introduction to Git and GitHub" },
      issuer: "Google / Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/a2a5651e8504dc0e4e0818fe73d29b32",
      detail: {
        fr: "Gestion de version, stratégies de branching Git, workflows collaboratifs et repos GitHub.",
        en: "Version control, Git branching strategies, collaborative workflows, and GitHub repos.",
      },
    },
    {
      id: "certif-rdbms",
      type: "certification",
      title: { fr: "Introduction to Relational Databases (RDBMS)", en: "Introduction to Relational Databases (RDBMS)" },
      issuer: "IBM / Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/533f2517c87bb8277e3823b737df4c57",
      detail: {
        fr: "Bases de données relationnelles, modélisation SQL et architecture RDBMS.",
        en: "Relational database concepts, SQL modeling, and RDBMS architecture.",
      },
    },
    {
      id: "certif-data-eng",
      type: "certification",
      title: { fr: "Introduction to Data Engineering", en: "Introduction to Data Engineering" },
      issuer: "IBM / Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/83eea9aa9f0b5400ec29bae9ae6bd009",
      detail: {
        fr: "Fondamentaux de l'ingénierie des données, pipelines ETL et traitement analytique.",
        en: "Data engineering fundamentals, ETL pipelines, and analytical processing.",
      },
    },
    {
      id: "certif-infiniment-grand",
      type: "certification",
      title: { fr: "Vers l'infiniment grand", en: "Vers l'infiniment grand" },
      issuer: "Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/40321d81f432c6738b028e57638bd39e",
      detail: {
        fr: "Formation scientifique avancée sur la modélisation et la physique.",
        en: "Advanced scientific course covering modeling and physics.",
      },
    },
    {
      id: "certif-tableau",
      type: "certification",
      title: { fr: "Tableau, Networks & Time Series Data Visualization", en: "Tableau, Networks & Time Series Data Visualization" },
      issuer: "UC Davis / Coursera",
      date: "Coursera",
      fileUrl: "https://coursera.org/share/e35b516356c3e90fa667dd1bdf826c9c",
      detail: {
        fr: "Visualisation de données complexes, séries temporelles et réseaux sur Tableau.",
        en: "Complex data visualization, time series, and network graphs on Tableau.",
      },
    },
  ],
};

export const interests: Category = {
  id: "interets",
  index: "INT",
  label: { fr: "Intérêts", en: "Interests" },
  description: {
    fr: "Ce qui me motive et me passionne, au-delà du CV.",
    en: "What drives and fascinates me, beyond the résumé.",
  },
};

export const contact: Category = {
  id: "contact",
  index: "IO",
  label: { fr: "Contact", en: "Contact" },
  description: {
    fr: "Me contacter directement.",
    en: "Get in touch directly.",
  },
};
