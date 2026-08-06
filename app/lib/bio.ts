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
  verifyUrl?: string; // Lien de partage unique Coursera (optionnel si non publié)
};

export type CertificationGroup = {
  category: { fr: string; en: string };
  icon: string;
  items: CertificationItem[];
};

export const institutionalLinks = {
  erm: "https://www.rma.ac.be/fr/Formations/3/Ing%C3%A9nieur%20civil%20-%20Polytechnique",
  ulb: "https://polytech.ulb.be/en/studies/masters/computer-science",
  iridia: "https://iridia.ulb.ac.be/",
};

export const bioNarrative = {
  headlineTag: {
    fr: "Informatique & IA · Systèmes Complexes · Leadership",
    en: "Computer Science & AI · Complex Systems · Leadership",
  },
  intro: {
    fr: "Ingénieur civil en informatique (ULB, Distinction) et Bachelier de l'École Royale Militaire (ERM), je combine une expertise pointue en Intelligence Artificielle et Systèmes Complexes (IRIDIA) avec une solide expérience en Management d'équipe et Leadership. Basé à Bruxelles, je recherche des opportunités stimulantes en tant que Software Developer & Ingénieur IA, avec l'ambition d'évoluer vers le Management de projets techniques.",
    en: "Computer Science Engineer (ULB, Distinction) and Royal Military Academy Bachelor (ERM), I bridge advanced technical expertise in Artificial Intelligence and Complex Systems (IRIDIA) with strong Team Management and Leadership skills. Based in Brussels, I am seeking challenging opportunities as a Software Developer & AI Engineer, aiming to grow into technical Project Management.",
  },
  executiveSummary: [
    {
      icon: "🎓",
      title: { fr: "Excellence Académique", en: "Academic Excellence" },
      desc: { fr: "Ingénieur civil en informatique ULB + Bachelier ERM", en: "Computer Science Engineering ULB + ERM Bachelor" },
    },
    {
      icon: "🛡️",
      title: { fr: "Leadership & Management", en: "Leadership & Management" },
      desc: { fr: "Management d'équipe & Rigueur à l'École Royale Militaire", en: "Team Management & Rigor at the Royal Military Academy" },
    },
    {
      icon: "⚡",
      title: { fr: "Autodidacte & DevOps", en: "Self-Taught & DevOps" },
      desc: { fr: "Certifications Google AI, IBM Data Eng, RL & Management", en: "Google AI, IBM Data Eng, RL & Management certifications" },
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
        fr: "Excellence académique et apprentissage du Leadership à l'ERM",
        en: "Academic Excellence & Leadership Training at ERM",
      },
      badge: { fr: "École Royale Militaire (ERM)", en: "Royal Military Academy (ERM)" },
      content: {
        fr: "Ressentant le besoin de franchir un cap scientifique, j'ai intégré la faculté Polytechnique de l'École Royale Militaire de Belgique (ERM). J'y ai obtenu un Bachelier en Sciences de l'Ingénieur dans un environnement extrêmement exigeant. Au-delà de la rigueur mathématique, c'est à l'ERM que j'ai forgé mon esprit d'équipe et mon leadership, apprenant à encadrer et diriger des équipes de travail, développant ainsi un sens aigu du management d'équipe, de la cohésion et de la gestion de crise.",
        en: "Driven to reach higher scientific standards, I entered the Faculty of Engineering at the Royal Military Academy of Belgium (ERM). I earned a Bachelor of Science in Engineering Sciences in an exceptionally demanding environment. Beyond mathematical rigor, ERM is where I forged my teamwork and leadership—learning to manage and lead project teams, developing a strong sense of team management, cohesion, and crisis handling.",
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
        fr: "J'ai poursuivi avec le diplôme d'Ingénieur civil en informatique à l'Université Libre de Bruxelles (ULB) avec Distinction. J'ai suivi ce programme volontairement généraliste avant de me spécialiser dans ma véritable passion : l'intelligence artificielle et l'analyse topologique des données. C'est ensuite au sein du laboratoire de recherche IRIDIA que j'ai pu exprimer pleinement cet attrait pour la complexité, en développant des outils mathématiques pour modéliser le comportement collectif (intelligence en essaim) de groupes de robots vers des modèles d'IA.",
        en: "I pursued the degree of Master of Science in Computer Science Engineering at Université Libre de Bruxelles (ULB) with Distinction. Following this comprehensive program, I specialized in my true passion: artificial intelligence and topological data analysis. At the IRIDIA research lab, I fully expressed this affinity for complexity by developing mathematical tools to model collective behavior (swarm intelligence) in multi-robot systems towards AI models.",
      },
    },
  ],
  certificationsGrouped: [
    {
      category: {
        fr: "Intelligence Artificielle & Data Science",
        en: "Artificial Intelligence & Data Science",
      },
      icon: "🧠",
      items: [
        {
          id: "google-ai",
          name: "Google AI Professional",
          issuer: "Google / Coursera",
          verifyUrl: "https://coursera.org/share/d5eeb18371dd4b2f2d16a616beded9b8",
        },
        {
          id: "rl-cert",
          name: "Reinforcement Learning Specialization",
          issuer: "University of Alberta / Coursera",
          verifyUrl: "https://coursera.org/share/acf19969352d9928d0d8d0645cc65dcd",
        },
        {
          id: "tableau-cert",
          name: "Tableau, Networks & Time Series Data Visualization",
          issuer: "UC Davis / Coursera",
          verifyUrl: "https://coursera.org/share/e35b516356c3e90fa667dd1bdf826c9c",
        },
        {
          id: "infiniment-grand",
          name: "Vers l'infiniment grand",
          issuer: "Coursera",
          verifyUrl: "https://coursera.org/share/40321d81f432c6738b028e57638bd39e",
        },
      ],
    },
    {
      category: {
        fr: "Data Engineering & Infrastructure",
        en: "Data Engineering & Infrastructure",
      },
      icon: "⚙️",
      items: [
        {
          id: "ibm-data-eng",
          name: "Introduction to Data Engineering",
          issuer: "IBM / Coursera",
          verifyUrl: "https://coursera.org/share/83eea9aa9f0b5400ec29bae9ae6bd009",
        },
        {
          id: "rdbms-cert",
          name: "Introduction to Relational Databases (RDBMS)",
          issuer: "IBM / Coursera",
          verifyUrl: "https://coursera.org/share/533f2517c87bb8277e3823b737df4c57",
        },
        {
          id: "git-github",
          name: "Introduction to Git and GitHub",
          issuer: "Google / Coursera",
          verifyUrl: "https://coursera.org/share/a2a5651e8504dc0e4e0818fe73d29b32",
        },
      ],
    },
    {
      category: {
        fr: "Management & Projets",
        en: "Management & Projects",
      },
      icon: "📊",
      items: [
        {
          id: "pm-foundations",
          name: "Foundations of Project Management",
          issuer: "Google / Coursera",
          verifyUrl: undefined, // Lien à ajouter plus tard
        },
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
