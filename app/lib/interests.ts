// Intérêts personnels, en général — pas uniquement techniques.
// Exemples à remplacer par tes vraies passions (informatique, photographie,
// sport, musique, lecture... ce que tu veux).

export const interestsIntro = {
  fr: "Présentation à venir — au-delà de l'informatique, ce qui t'anime au quotidien.",
  en: "Introduction coming soon — beyond computer science, what drives you day to day.",
};

export type Interest = {
  id: string;
  title: { fr: string; en: string };
  text: { fr: string; en: string };
};

export const interestsList: Interest[] = [
  {
    id: "informatique",
    title: { fr: "Informatique", en: "Computer science" },
    text: {
      fr: "À compléter — ce qui t'attire dans l'informatique, au-delà du travail.",
      en: "To be completed — what draws you to computer science, beyond work.",
    },
  },
  {
    id: "photographie",
    title: { fr: "Photographie", en: "Photography" },
    text: {
      fr: "À compléter — ton rapport à la photographie.",
      en: "To be completed — your relationship to photography.",
    },
  },
  {
    id: "sport",
    title: { fr: "Sport", en: "Sport" },
    text: {
      fr: "À compléter — le(s) sport(s) que tu pratiques ou suis.",
      en: "To be completed — the sport(s) you practice or follow.",
    },
  },
];
