export type ContentType = "projet" | "papier" | "demo";

// Un "papier" est composé de blocs dans l'ordre voulu : texte, vidéo, texte, vidéo...
// C'est ce qui permet d'intercaler librement explications et vidéos dans un même article.
export type Block =
  | { kind: "text"; text: { fr: string; en: string } }
  | { kind: "video"; url?: string; caption: { fr: string; en: string } };

export type ContentItem = {
  id: string;
  type: ContentType;
  domains: string[]; // un contenu peut appartenir à plusieurs domaines
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
  blocks?: Block[]; // utilisé seulement pour type "papier"
  videoUrl?: string; // utilisé pour type "projet"
  demoUrl?: string; // utilisé pour type "demo" (embed Hugging Face Spaces)
};

// Exemples de structure — à remplacer par ton vrai contenu.
export const content: ContentItem[] = [
  {
    id: "exemple-projet-swarm",
    type: "projet",
    domains: ["swarm", "robotics"],
    title: { fr: "Exemple de projet", en: "Example project" },
    summary: {
      fr: "Un projet à remplacer, avec sa vidéo YouTube non répertoriée.",
      en: "A placeholder project, with its unlisted YouTube video.",
    },
  },
  {
    id: "exemple-papier-swarm",
    type: "papier",
    domains: ["swarm", "ml"],
    title: { fr: "Exemple de papier interactif", en: "Example interactive paper" },
    summary: {
      fr: "Montre comment texte et vidéo s'intercalent librement.",
      en: "Shows how text and video interleave freely.",
    },
    blocks: [
      { kind: "text", text: { fr: "Premier bloc de texte — introduction du sujet.", en: "First text block — subject introduction." } },
      { kind: "video", caption: { fr: "Une vidéo insérée directement dans l'article.", en: "A video inserted directly into the article." } },
      { kind: "text", text: { fr: "Deuxième bloc de texte, après la vidéo.", en: "Second text block, after the video." } },
    ],
  },
  {
    id: "exemple-demo-ml",
    type: "demo",
    domains: ["ml"],
    title: { fr: "Exemple de démo", en: "Example demo" },
    summary: {
      fr: "Emplacement pour une démo Hugging Face Spaces embarquée.",
      en: "Placeholder for an embedded Hugging Face Spaces demo.",
    },
  },
];
