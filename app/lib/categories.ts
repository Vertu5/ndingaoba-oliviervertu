export type Lang = "fr" | "en";

export type DocEntry = {
  type: "diplome" | "certification" | "lettre";
  title: { fr: string; en: string };
  issuer: string;
  date: string; // ex: "2025"
};

export type Category = {
  id: string;
  index: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
  // Contenu "à venir" — placeholders prêts à remplir
  documents?: DocEntry[];
};

export const categories: Category[] = [
  {
    id: "parcours",
    index: "DOC",
    label: { fr: "Parcours", en: "Background" },
    description: {
      fr: "Diplômes, certifications et lettres de recommandation.",
      en: "Diplomas, certifications and recommendation letters.",
    },
    documents: [
      // Exemples de structure — à remplacer par tes vrais documents
      { type: "diplome", title: { fr: "Diplôme à renseigner", en: "Diploma to add" }, issuer: "Établissement", date: "20XX" },
      { type: "certification", title: { fr: "Certification à renseigner", en: "Certification to add" }, issuer: "Organisme", date: "20XX" },
      { type: "lettre", title: { fr: "Lettre de recommandation à renseigner", en: "Recommendation letter to add" }, issuer: "Auteur", date: "20XX" },
    ],
  },
  {
    id: "projets",
    index: "VID",
    label: { fr: "Projets", en: "Projects" },
    description: {
      fr: "Historique de projets, avec vidéos d'explication.",
      en: "Project history, with explainer videos.",
    },
  },
  {
    id: "papiers",
    index: "MDX",
    label: { fr: "Papiers interactifs", en: "Interactive papers" },
    description: {
      fr: "Articles où les données et graphiques se manipulent en lisant.",
      en: "Articles where data and charts can be manipulated while reading.",
    },
  },
  {
    id: "swarm",
    index: "LAB",
    label: { fr: "Intelligence en essaim", en: "Swarm intelligence" },
    description: {
      fr: "Modèles d'intelligence collective, démos en direct.",
      en: "Collective intelligence models, live demos.",
    },
  },
  {
    id: "robotics",
    index: "LAB",
    label: { fr: "Robotique", en: "Robotics" },
    description: {
      fr: "Systèmes robotiques, contrôle et perception.",
      en: "Robotic systems, control and perception.",
    },
  },
  {
    id: "heuristics",
    index: "LAB",
    label: { fr: "Heuristique & optimisation", en: "Heuristics & optimization" },
    description: {
      fr: "Méthodes de recherche, métaheuristiques, optimisation combinatoire.",
      en: "Search methods, metaheuristics, combinatorial optimization.",
    },
  },
  {
    id: "physics",
    index: "LAB",
    label: { fr: "Physique", en: "Physics" },
    description: {
      fr: "Modélisation physique et simulations.",
      en: "Physical modeling and simulations.",
    },
  },
  {
    id: "algo",
    index: "LAB",
    label: { fr: "Algorithmes & programmation", en: "Algorithms & programming" },
    description: {
      fr: "Structures de données, complexité, implémentations.",
      en: "Data structures, complexity, implementations.",
    },
  },
  {
    id: "ml",
    index: "LAB",
    label: { fr: "Machine Learning", en: "Machine Learning" },
    description: {
      fr: "Expérimentations et modèles hébergés.",
      en: "Experiments and hosted models.",
    },
  },
  {
    id: "contact",
    index: "IO",
    label: { fr: "Contact", en: "Contact" },
    description: {
      fr: "Me contacter directement.",
      en: "Get in touch directly.",
    },
  },
];
