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
export const cvUrl: string | null = null;

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
        fr: "Master en Informatique et Ingénierie (Mention Distinction)",
        en: "Master in Computer Science & Engineering (With Distinction)",
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
        en: "Bachelor in Engineering Sciences",
      },
      issuer: "École Royale Militaire de Belgique (ERM)",
      date: "ERM",
      detail: {
        fr: "Faculté Polytechnique. Rigueur académique et formation intensive au leadership et commandement d'un peloton.",
        en: "Faculty of Engineering. Academic rigor combined with intensive leadership training and platoon command.",
      },
    },
    {
      id: "certif-google-ai",
      type: "certification",
      title: { fr: "Google AI Professional & Reinforcement Learning", en: "Google AI Professional & Reinforcement Learning" },
      issuer: "Google / Online",
      date: "2025-2026",
      detail: {
        fr: "Maîtrise des fondamentaux du Deep Learning, du Reinforcement Learning et de la visualisation de réseaux.",
        en: "Mastery of Deep Learning fundamentals, Reinforcement Learning, and network visualization.",
      },
    },
    {
      id: "certif-ibm-devops",
      type: "certification",
      title: { fr: "IBM Data Engineering, Docker & Kubernetes", en: "IBM Data Engineering, Docker & Kubernetes" },
      issuer: "IBM / Cloud Native",
      date: "2025-2026",
      detail: {
        fr: "Pipelines Data Engineering, conteneurisation d'applications et orchestration avec Docker et Kubernetes.",
        en: "Data Engineering pipelines, application containerization, and orchestration with Docker & Kubernetes.",
      },
    },
    {
      id: "certif-pm",
      type: "certification",
      title: { fr: "Fondamentaux du Project Management", en: "Project Management Fundamentals" },
      issuer: "Management",
      date: "2026",
      detail: {
        fr: "Gestion de projet, méthodologies agiles, planification et orchestration d'équipes.",
        en: "Project management, agile methodologies, planning, and team orchestration.",
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
