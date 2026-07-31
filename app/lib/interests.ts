export const interestsIntro = {
  fr: "Présentation à venir — ce que tu veux transmettre au-delà de ton parcours formel.",
  en: "Introduction coming soon — what you want to convey beyond your formal background.",
};

export type DomainInterest = {
  domainId: string;
  text: { fr: string; en: string };
};

// Un petit mot par domaine — pourquoi il te passionne, ce qui t'y a mené, etc.
// Exemples à remplacer par tes propres réflexions.
export const domainInterests: DomainInterest[] = [
  { domainId: "swarm", text: { fr: "À compléter — pourquoi l'intelligence en essaim te fascine.", en: "To be completed — why swarm intelligence fascinates you." } },
  { domainId: "robotics", text: { fr: "À compléter — ton rapport à la robotique.", en: "To be completed — your relationship to robotics." } },
  { domainId: "heuristics", text: { fr: "À compléter — ce qui t'attire dans la recherche de solutions.", en: "To be completed — what draws you to problem-solving." } },
  { domainId: "physics", text: { fr: "À compléter — ton lien avec la physique.", en: "To be completed — your connection to physics." } },
  { domainId: "algo", text: { fr: "À compléter — ce que les algorithmes représentent pour toi.", en: "To be completed — what algorithms mean to you." } },
  { domainId: "ml", text: { fr: "À compléter — ta motivation pour le Machine Learning.", en: "To be completed — your motivation for Machine Learning." } },
];
