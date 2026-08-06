export type BioSection = {
  id: string;
  title: { fr: string; en: string };
  badge?: { fr: string; en: string };
  content: { fr: string; en: string };
};

export type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  fileUrl?: string; // chemin dans /public/certifications/ex: /certifications/google-ai.pdf
};

export type CertificationGroup = {
  category: { fr: string; en: string };
  icon: string;
  items: CertificationItem[];
};

export const bioNarrative = {
  headlineTag: {
    fr: "Informatique & IA · Systèmes Complexes · Leadership",
    en: "Computer Science & AI · Complex Systems · Leadership",
  },
  intro: {
    fr: "D'origine congolaise (Brazzaville) et aujourd'hui basé à Bruxelles, je nourris une fascination profonde pour la compréhension des systèmes complexes, qu'ils relèvent de la biologie, des mathématiques ou de l'informatique.",
    en: "Originally from Congo (Brazzaville) and currently based in Brussels, I share a deep fascination for understanding complex systems, whether in biology, mathematics, or computer science.",
  },
  executiveSummary: [
    {
      icon: "🎓",
      title: { fr: "Excellence Académique", en: "Academic Excellence" },
      desc: { fr: "Bachelier ERM + Master ULB (Mention Distinction)", en: "ERM Bachelor + ULB Master (With Distinction)" },
    },
    {
      icon: "🛡️",
      title: { fr: "Leadership & Discipline", en: "Leadership & Discipline" },
      desc: { fr: "Commandement de peloton à l'École Royale Militaire", en: "Platoon command at the Royal Military Academy" },
    },
    {
      icon: "⚡",
      title: { fr: "Autodidacte & DevOps", en: "Self-Taught & DevOps" },
      desc: { fr: "Certifications Google AI, IBM Data Eng, Docker, K8s", en: "Google AI, IBM Data Eng, Docker, K8s certifications" },
    },
    {
      icon: "🎯",
      title: { fr: "Vision Pro", en: "Professional Vision" },
      desc: { fr: "Software Developer ➔ Project Manager", en: "Software Developer ➔ Project Manager" },
    },
  ],
  sections: [
    {
      id: "fondations",
      title: {
        fr: "Des fondations techniques à la rigueur philosophique",
        en: "From Technical Foundations to Philosophical Rigor",
      },
      badge: { fr: "Congo & CFI-CIRAS", en: "Congo & CFI-CIRAS" },
      content: {
        fr: "Mon esprit d'ingénieur a pris racine au Congo, lors de mes études au Lycée Technique 1er Mai. En suivant la série E (Génie industriel et mathématiques), j'ai baigné très tôt dans la réalité technique : bureau des méthodes, construction mécanique et automatisme. Au-delà des bases solides acquises en sciences, j'y ai également étudié la philosophie, une discipline qui a durablement façonné mon approche analytique. Je me suis ensuite formé au développement logiciel au CFI-CIRAS, où j'ai consolidé ma maîtrise de la programmation et des réseaux.",
        en: "My engineering mindset took root in Congo during my studies at Lycée Technique 1er Mai. Enrolled in Track E (Industrial Engineering & Math), I immersed myself early in technical realities: method engineering, mechanical design, and automation. Beyond strong scientific foundations, I studied philosophy, a discipline that permanently shaped my analytical mindset. I then trained in software development at CFI-CIRAS, consolidating my programming and networking skills.",
      },
    },
    {
      id: "erm-leadership",
      title: {
        fr: "Excellence académique et apprentissage du Leadership",
        en: "Academic Excellence & Leadership Training",
      },
      badge: { fr: "École Royale Militaire (ERM)", en: "Royal Military Academy (ERM)" },
      content: {
        fr: "Ressentant le besoin de franchir un cap scientifique, j'ai intégré la faculté Polytechnique de l'École Royale Militaire de Belgique (ERM). J'y ai obtenu un Bachelier en Sciences de l'Ingénieur dans un environnement extrêmement exigeant. Au-delà de la rigueur mathématique, c'est à l'ERM que j'ai forgé mon esprit d'équipe et mon leadership, apprenant à diriger de petites équipes de travail ainsi qu'un peloton entier, développant ainsi un sens aigu du commandement, de la cohésion et de la gestion de crise.",
        en: "Driven to reach higher scientific standards, I entered the Faculty of Engineering at the Royal Military Academy of Belgium (ERM). I earned a Bachelor in Engineering Sciences in an exceptionally demanding environment. Beyond mathematical rigor, ERM is where I forged my teamwork and leadership—learning to lead small groups as well as a full platoon, developing a strong sense of command, cohesion, and crisis management.",
      },
    },
    {
      id: "ulb-iridia",
      title: {
        fr: "Spécialisation et Recherche à l'ULB & IRIDIA",
        en: "Specialization & Research at ULB & IRIDIA",
      },
      badge: { fr: "ULB / IRIDIA (Mention Distinction)", en: "ULB / IRIDIA (Honors / Distinction)" },
      content: {
        fr: "J'ai poursuivi avec un Master en Informatique et Ingénierie à l'Université Libre de Bruxelles (ULB) avec Distinction. J'ai suivi ce programme volontairement généraliste avant de me spécialiser dans ma véritable passion : l'intelligence artificielle et l'analyse topologique des données. C'est ensuite au sein du laboratoire de recherche IRIDIA que j'ai pu exprimer pleinement cet attrait pour la complexité, en développant des outils mathématiques pour modéliser le comportement collectif (intelligence en essaim) de groupes de robots vers des modèles d'IA.",
        en: "I pursued a Master in Computer Science & Engineering at Université Libre de Bruxelles (ULB) with Distinction. Following this comprehensive program, I specialized in my true passion: artificial intelligence and topological data analysis. At the IRIDIA research lab, I fully expressed this affinity for complexity by developing mathematical tools to model collective behavior (swarm intelligence) in multi-robot systems towards AI models.",
      },
    },
  ],
  certificationsGrouped: [
    {
      category: {
        fr: "Intelligence Artificielle & Data",
        en: "Artificial Intelligence & Data",
      },
      icon: "🧠",
      items: [
        { id: "google-ai", name: "Google AI Professional", issuer: "Google", fileUrl: "/certifications/google-ai-professional.pdf" },
        { id: "rl-cert", name: "Reinforcement Learning Specialization", issuer: "Coursera", fileUrl: "/certifications/reinforcement-learning.pdf" },
        { id: "tableau-cert", name: "Tableau (Networks & Time Series)", issuer: "Tableau", fileUrl: "/certifications/tableau-networks.pdf" },
      ],
    },
    {
      category: {
        fr: "Engineering & DevOps",
        en: "Engineering & DevOps",
      },
      icon: "⚙️",
      items: [
        { id: "ibm-data-eng", name: "IBM Data Engineering", issuer: "IBM", fileUrl: "/certifications/ibm-data-engineering.pdf" },
        { id: "docker-k8s", name: "Conteneurisation (Docker, Kubernetes)", issuer: "Cloud Native", fileUrl: "/certifications/docker-kubernetes.pdf" },
        { id: "git-github", name: "Git & GitHub Versioning", issuer: "GitHub", fileUrl: "/certifications/git-github.pdf" },
      ],
    },
    {
      category: {
        fr: "Management & Projets",
        en: "Management & Projects",
      },
      icon: "📊",
      items: [
        { id: "pm-fundamentals", name: "Fondamentaux du Project Management", issuer: "Project Management", fileUrl: "/certifications/pm-fundamentals.pdf" },
      ],
    },
  ] as CertificationGroup[],
  vision: {
    title: {
      fr: "Ma vision et mes objectifs : Dev ➔ Project Management",
      en: "My Vision & Goals: Dev ➔ Project Management",
    },
    philosophy: {
      fr: "Ce qui relie toutes les étapes de mon parcours, c'est cette méthode de pensée : comprendre un système en profondeur avant de le modéliser, et toujours oser défricher l'inconnu.",
      en: "What connects all steps of my journey is this core mindset: understand a system deeply before modeling it, and always dare to break new ground.",
    },
    roadmap: {
      fr: "Aujourd'hui, mon objectif est d'évoluer en tant que Software Developer pour me confronter à la réalité du code, de l'architecture et de la mise en production sur des projets ambitieux. À plus long terme, fort de mes expériences de commandement à l'ERM et de ma vision transversale des systèmes, j'ambitionne d'évoluer vers le Project Management, afin d'orchestrer la complexité non plus seulement à l'échelle du code, mais à l'échelle humaine et organisationnelle.",
      en: "Today, my goal is to thrive as a Software Developer to tackle real-world code, architecture, and production delivery on ambitious projects. Long-term, building on my command experience at ERM and my systems vision, I aim to transition into Project Management to orchestrate complexity at both technical and human scales.",
    },
  },
};
