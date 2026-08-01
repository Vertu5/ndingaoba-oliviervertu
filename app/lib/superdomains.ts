export type SuperDomain = {
  id: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
};

// Grands domaines globaux — le premier niveau qu'on voit dans la grille.
// Liste extensible : ajouter une entrée ici, puis rattacher des sous-domaines
// à son id dans domains.ts (champ superId).
export const superDomains: SuperDomain[] = [
  {
    id: "informatique",
    label: { fr: "Informatique", en: "Computer Science" },
    description: {
      fr: "Swarm, robotique, heuristique, algorithmes, Machine Learning.",
      en: "Swarm, robotics, heuristics, algorithms, Machine Learning.",
    },
  },
  {
    id: "sciences",
    label: { fr: "Sciences", en: "Science" },
    description: {
      fr: "Physique et modélisation scientifique.",
      en: "Physics and scientific modeling.",
    },
  },
];
