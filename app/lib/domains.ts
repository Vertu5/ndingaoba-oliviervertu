import type { Lang } from "@/app/lib/categories";

export type Domain = {
  id: string;
  superId: string; // rattache ce sous-domaine à un grand domaine (superdomains.ts)
  label: { fr: string; en: string };
  description: { fr: string; en: string };
};

// Sous-domaines — visibles seulement quand on ouvre leur grand domaine parent.
// Pour ajouter un sous-domaine : une ligne ici + un motif dans Pattern.tsx (optionnel).
export const domains: Domain[] = [
  {
    id: "swarm",
    superId: "informatique",
    label: { fr: "Intelligence en essaim", en: "Swarm intelligence" },
    description: {
      fr: "Modèles d'intelligence collective, démos en direct.",
      en: "Collective intelligence models, live demos.",
    },
  },
  {
    id: "robotics",
    superId: "informatique",
    label: { fr: "Robotique", en: "Robotics" },
    description: {
      fr: "Systèmes robotiques, contrôle et perception.",
      en: "Robotic systems, control and perception.",
    },
  },
  {
    id: "heuristics",
    superId: "informatique",
    label: { fr: "Heuristique & optimisation", en: "Heuristics & optimization" },
    description: {
      fr: "Méthodes de recherche, métaheuristiques, optimisation combinatoire.",
      en: "Search methods, metaheuristics, combinatorial optimization.",
    },
  },
  {
    id: "algo",
    superId: "informatique",
    label: { fr: "Algorithmes & programmation", en: "Algorithms & programming" },
    description: {
      fr: "Structures de données, complexité, implémentations.",
      en: "Data structures, complexity, implementations.",
    },
  },
  {
    id: "ml",
    superId: "informatique",
    label: { fr: "Machine Learning", en: "Machine Learning" },
    description: {
      fr: "Expérimentations et modèles hébergés.",
      en: "Experiments and hosted models.",
    },
  },
  {
    id: "physics",
    superId: "sciences",
    label: { fr: "Physique", en: "Physics" },
    description: {
      fr: "Modélisation physique et simulations.",
      en: "Physical modeling and simulations.",
    },
  },
];

export type { Lang };
