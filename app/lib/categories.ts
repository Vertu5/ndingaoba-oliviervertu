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
      id: "diplome-1",
      type: "diplome",
      title: { fr: "Diplôme à renseigner", en: "Diploma to add" },
      issuer: "École à renseigner",
      date: "20XX",
      detail: {
        fr: "Clique pour voir le détail — description de la formation, mention, etc. À compléter.",
        en: "Click to see detail — programme description, honors, etc. To be completed.",
      },
    },
    {
      id: "certification-1",
      type: "certification",
      title: { fr: "Certification à renseigner", en: "Certification to add" },
      issuer: "Organisme à renseigner",
      date: "20XX",
      detail: {
        fr: "Clique pour voir le détail de cette certification. À compléter.",
        en: "Click to see this certification's detail. To be completed.",
      },
    },
    {
      id: "lettre-1",
      type: "lettre",
      title: { fr: "Lettre de recommandation à renseigner", en: "Recommendation letter to add" },
      issuer: "Auteur à renseigner",
      date: "20XX",
      detail: {
        fr: "Clique pour voir un extrait ou le contexte de cette lettre. À compléter.",
        en: "Click to see an excerpt or context for this letter. To be completed.",
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
