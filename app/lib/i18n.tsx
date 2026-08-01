"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Lang } from "@/app/lib/categories";

const dict = {
  fr: {
    sectionAbout: "MOI",
    sectionDomains: "DOMAINES",
    bioIntroBefore: "Présentation à venir — qui tu es, ton parcours, ta démarche. Pour le détail complet, tu peux ",
    bioIntroLink: "cliquer ici pour voir mon CV",
    bioIntroAfter: ".",
    back: "RETOUR",
    contentContact: "tes coordonnées et liens.",
    docDiplome: "Diplômes",
    docCertification: "Certifications",
    docLettre: "Lettres de recommandation",
    docTodo: "à compléter",
    cvMissing: "PDF à ajouter",
    docView: "Voir le document (PDF)",
    backToDomains: "RETOUR AUX DOMAINES",
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
    sectionAbout: "ABOUT",
    sectionDomains: "DOMAINS",
    bioIntroBefore: "Introduction coming soon — who you are, your path, your approach. For the full detail, you can ",
    bioIntroLink: "click here to view my résumé",
    bioIntroAfter: ".",
    back: "BACK",
    contentContact: "your contact details and links.",
    docDiplome: "Diplomas",
    docCertification: "Certifications",
    docLettre: "Recommendation letters",
    docTodo: "to be completed",
    cvMissing: "PDF to add",
    docView: "View document (PDF)",
    backToDomains: "BACK TO DOMAINS",
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
