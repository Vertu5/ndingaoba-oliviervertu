export type InterestPillar = {
  id: string;
  icon: string;
  title: { fr: string; en: string };
  badge: { fr: string; en: string };
  text: { fr: string; en: string };
  tags: string[];
};

export const interestsVision = {
  title: {
    fr: "Ma vision : Comprendre, Créer et se Dépasser",
    en: "My Vision: Understand, Create & Surpass",
  },
  intro: {
    fr: "Au-delà de l'ingénierie et du code, mon équilibre repose sur cinq grands piliers qui nourrissent à la fois mon intellect, mon corps, ma créativité et mon art de vivre :",
    en: "Beyond engineering and code, my personal balance rests on five core pillars that feed my intellect, physical discipline, creativity, and lifestyle:",
  },
};

export const interestPillars: InterestPillar[] = [
  {
    id: "philosophie",
    icon: "🧠",
    title: {
      fr: "La réflexion et la complexité (Philosophie)",
      en: "Reflection & Complexity (Philosophy)",
    },
    badge: {
      fr: "Nietzsche & Charles Pépin",
      en: "Nietzsche & Charles Pépin",
    },
    text: {
      fr: "J'éprouve une véritable passion pour les problèmes complexes, ceux qui exigent des heures, voire des mois d'immersion totale. Cette soif d'analyse s'étend à la compréhension de l'humain et du monde qui l'entoure à travers la philosophie, qui constitue l'essentiel de mes lectures. Je suis particulièrement marqué par la pensée de Friedrich Nietzsche et les ouvrages de Charles Pépin, qui m'aident à décrypter la complexité de la nature humaine.",
      en: "I share a true passion for complex problems—those demanding hours or months of deep immersion. This drive for analysis extends to understanding human nature through philosophy, which makes up most of my reading. I am profoundly influenced by Friedrich Nietzsche's thought and Charles Pépin's practical philosophy, helping me decipher the complexity of human nature.",
    },
    tags: ["Philosophie", "Nietzsche", "Charles Pépin", "Systèmes Complexes"],
  },
  {
    id: "sport",
    icon: "🥊",
    title: {
      fr: "La discipline physique (Sport & Arts Martiaux)",
      en: "Physical Discipline (Sports & Martial Arts)",
    },
    badge: {
      fr: "Héritage ERM & UFC/MMA",
      en: "RMA Legacy & UFC/MMA",
    },
    text: {
      fr: "Héritage direct de mon passage à l'École Royale Militaire, le sport est pour moi une nécessité absolue. Je pratique assidûment la musculation et le CrossFit. Je suis également fasciné par l'exigence des sports de combat : je suis l'actualité du MMA de très près (notamment les événements de l'UFC chaque samedi) avec l'objectif de commencer moi-même la pratique sur les tatamis. En parallèle, je reste un amateur attentif du monde du football.",
      en: "A direct legacy of my time at the Royal Military Academy, sport is an absolute necessity for me. I regularly practice weightlifting and CrossFit. I am also fascinated by the discipline of combat sports: I follow MMA closely (especially UFC events every Saturday) with the goal of joining the mats myself. In parallel, I remain a dedicated football fan.",
    },
    tags: ["CrossFit", "Musculation", "UFC / MMA", "ERM", "Football"],
  },
  {
    id: "creativite",
    icon: "📸",
    title: {
      fr: "L'esthétique et l'imaginaire (Créativité)",
      en: "Aesthetics & Imagination (Creativity)",
    },
    badge: {
      fr: "Photo, Beatmaking & Animes",
      en: "Photo, Beatmaking & Anime",
    },
    text: {
      fr: "J'ai toujours eu un besoin viscéral de créer. Très sensible à la mode et à l'image, je pratique la photographie en capturant aussi bien l'énergie des gens que la géométrie des immeubles ou la délicatesse de la nature. Plus jeune, j'ai exploré la création sonore en tant que beatmaker sur FL Studio. Mon imaginaire, quant à lui, est constamment nourri par la culture des animes, dont je regarde de nouveaux épisodes chaque semaine.",
      en: "I have always had a deep visceral drive to create. Keenly sensitive to fashion and visuals, I practice photography—capturing human energy, architectural geometry, and natural details. Earlier, I explored music production as a beatmaker on FL Studio. My imagination is continuously inspired by anime culture, following new episodes weekly.",
    },
    tags: ["Photographie", "FL Studio", "Beatmaking", "Mode", "Animes"],
  },
  {
    id: "cuisine",
    icon: "👨‍🍳",
    title: {
      fr: "La précision et le partage (Art Culinaire & Gastronomie)",
      en: "Precision & Sharing (Culinary Arts & Gastronomy)",
    },
    badge: {
      fr: "Cuisine & Gastronomie",
      en: "Cooking & Gastronomy",
    },
    text: {
      fr: "La cuisine est pour moi un formidable terrain d'expérimentation et de précision, où la rigueur de la préparation rencontre le plaisir de la création. J'aime élaborer de nouvelles recettes, marier les saveurs avec soin et partager de bons plats en toute convivialité.",
      en: "Cooking for me is a realm of experimentation and precision, where exact preparation meets the joy of creation. I love crafting new recipes, carefully pairing flavors, and sharing great meals in good company.",
    },
    tags: ["Cuisine", "Gastronomie", "Art Culinaire", "Recettes & Saveurs"],
  },
  {
    id: "serenite",
    icon: "🌲",
    title: {
      fr: "L'ancrage et la paix (Sérénité)",
      en: "Grounding & Peace (Serenity)",
    },
    badge: {
      fr: "Nature, Spas & Voyages",
      en: "Nature, Spas & Travel",
    },
    text: {
      fr: "Pour contrebalancer une vie intellectuelle et physique intense, j'accorde une importance primordiale à la paix intérieure. Les longues marches, le contact profond avec la nature et les moments de déconnexion dans les spas sont mes refuges. Bien que je n'aie pas encore eu l'occasion d'explorer le globe, voyager et découvrir le monde reste l'une de mes plus grandes ambitions à venir.",
      en: "To counterbalance an intense intellectual and physical life, I place fundamental value on inner peace. Long walks, deep connection with nature, and relaxing spa sessions are my sanctuaries. While I haven't yet explored the globe, traveling and discovering the world remains one of my greatest upcoming ambitions.",
    },
    tags: ["Nature", "Sérénité", "Marche", "Spa", "Voyages"],
  },
];
