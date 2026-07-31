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
  documents?: DocEntry[];
};

// Seulement les deux compartiments "spéciaux", en dehors des domaines.
// Les domaines (Swarm, ML, etc.) vivent dans domains.ts, séparément,
// pour pouvoir en ajouter autant qu'on veut sans toucher à ce fichier.

export const bio: Category = {
  id: "bio",
  index: "DOC",
  label: { fr: "Bio", en: "Bio" },
  description: {
    fr: "Présentation, parcours, diplômes, certifications, lettres de recommandation.",
    en: "Introduction, background, diplomas, certifications, recommendation letters.",
  },
  documents: [
    { type: "diplome", title: { fr: "Diplôme à renseigner", en: "Diploma to add" }, issuer: "Établissement", date: "20XX" },
    { type: "certification", title: { fr: "Certification à renseigner", en: "Certification to add" }, issuer: "Organisme", date: "20XX" },
    { type: "lettre", title: { fr: "Lettre de recommandation à renseigner", en: "Recommendation letter to add" }, issuer: "Auteur", date: "20XX" },
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
