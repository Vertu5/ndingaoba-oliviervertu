"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Lang } from "@/app/lib/categories";

const dict = {
  fr: {
    tagline: "ÉCOSYSTÈME NUMÉRIQUE",
    back: "RETOUR",
    contentSoon: "Contenu à venir — cette section est prête à recevoir",
    contentProjets: "tes vidéos YouTube (non répertoriées).",
    contentPapiers: "tes articles MDX interactifs.",
    contentLabs: "tes démos Hugging Face Spaces embarquées.",
    contentContact: "tes coordonnées et liens.",
    docDiplome: "Diplômes",
    docCertification: "Certifications",
    docLettre: "Lettres de recommandation",
    docTodo: "à compléter",
    tabProjets: "Projets",
    tabPapiers: "Papiers",
    tabDemos: "Démos",
    emptyTab: "Rien ici pour l'instant.",
    videoPlaceholder: "Vidéo à intégrer",
    demoPlaceholder: "Démo Hugging Face à intégrer",
    chatTitle: "Poser une question sur cette section",
    chatPlaceholder: "Écris ta question…",
    chatSend: "Envoyer",
    chatThinking: "…",
    chatEmpty: "Demande une explication détaillée sur ce compartiment.",
    chatDisabled: "Assistant bientôt disponible dans cette section.",
    langToggle: "EN",
  },
  en: {
    tagline: "DIGITAL ECOSYSTEM",
    back: "BACK",
    contentSoon: "Content coming soon — this section is ready to receive",
    contentProjets: "your YouTube videos (unlisted).",
    contentPapiers: "your interactive MDX articles.",
    contentLabs: "your embedded Hugging Face Spaces demos.",
    contentContact: "your contact details and links.",
    docDiplome: "Diplomas",
    docCertification: "Certifications",
    docLettre: "Recommendation letters",
    docTodo: "to be completed",
    tabProjets: "Projects",
    tabPapiers: "Papers",
    tabDemos: "Demos",
    emptyTab: "Nothing here yet.",
    videoPlaceholder: "Video to embed",
    demoPlaceholder: "Hugging Face demo to embed",
    chatTitle: "Ask a question about this section",
    chatPlaceholder: "Type your question…",
    chatSend: "Send",
    chatThinking: "…",
    chatEmpty: "Ask for a detailed explanation about this section.",
    chatDisabled: "Assistant coming soon in this section.",
    langToggle: "FR",
  },
} satisfies Record<Lang, Record<string, string>>;

type Dict = { [K in keyof typeof dict.fr]: string };

const LangContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: Dict;
}>({ lang: "fr", toggle: () => {}, t: dict.fr });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const toggle = () => setLang((l) => (l === "fr" ? "en" : "fr"));
  return (
    <LangContext.Provider value={{ lang, toggle, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
