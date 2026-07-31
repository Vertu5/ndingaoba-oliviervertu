import type { Lang } from "@/app/lib/categories";

export type Domain = {
  id: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
};

// Liste extensible — ajouter un domaine, c'est ajouter une ligne ici.
// Pense aussi à ajouter un motif visuel correspondant dans Pattern.tsx
// (sinon un motif par défaut neutre sera utilisé).
export const domains: Domain[] = [
  {
    id: "swarm",
    label: { fr: "Intelligence en essaim", en: "Swarm intelligence" },
    description: {
      fr: "Modèles d'intelligence collective, démos en direct.",
      en: "Collective intelligence models, live demos.",
    },
  },
  {
    id: "robotics",
    label: { fr: "Robotique", en: "Robotics" },
    description: {
      fr: "Systèmes robotiques, contrôle et perception.",
      en: "Robotic systems, control and perception.",
    },
  },
  {
    id: "heuristics",
    label: { fr: "Heuristique & optimisation", en: "Heuristics & optimization" },
    description: {
      fr: "Méthodes de recherche, métaheuristiques, optimisation combinatoire.",
      en: "Search methods, metaheuristics, combinatorial optimization.",
    },
  },
  {
    id: "physics",
    label: { fr: "Physique", en: "Physics" },
    description: {
      fr: "Modélisation physique et simulations.",
      en: "Physical modeling and simulations.",
    },
  },
  {
    id: "algo",
    label: { fr: "Algorithmes & programmation", en: "Algorithms & programming" },
    description: {
      fr: "Structures de données, complexité, implémentations.",
      en: "Data structures, complexity, implementations.",
    },
  },
  {
    id: "ml",
    label: { fr: "Machine Learning", en: "Machine Learning" },
    description: {
      fr: "Expérimentations et modèles hébergés.",
      en: "Experiments and hosted models.",
    },
  },
];

export type { Lang };
