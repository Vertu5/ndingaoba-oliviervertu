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
  solvayFr: "https://www.ulb.be/fr/programme/ms-gest",
  solvayEn: "https://www.ulb.be/en/programme/ms-gest",
};

export const bioNarrative = {
  headlineTag: {
    fr: "Data & IA · Projets End-to-End · Leadership",
    en: "Data & AI · End-to-End Delivery · Leadership",
  },
  intro: {
    fr: "Ingénieur Civil en Informatique (ULB, Master avec Distinction) et actuellement en Master de spécialisation en gestion industrielle et technologique à la Solvay Brussels School (ULB, 2026 - en cours), j'allie expertise technique et vision management. Côté IA, je mène des solutions LLM (RAG, Text-to-SQL gouverné) et de Machine Learning du prototype à la mise en production. Côté Data, j'intègre des plateformes modernes telles que Databricks (Unity Catalog, Delta Lake, MLflow) pour bâtir les fondations fiables dont l'IA a besoin. Depuis 2022, j'ai livré des projets concrets pour de vrais clients, en prenant l'initiative et le lead d'une équipe de 3 à la SNCB, et transformé des résultats techniques en décisions claires pour les décideurs. Formé au commandement d'équipe à l'École Royale Militaire, je m'investis pour piloter des projets Data et IA de bout en bout.",
    en: "Civil Engineer in Computer Science (ULB, Master with Distinction) and currently pursuing a Specialized Master in Industrial and Technological Management at Solvay Brussels School (ULB, 2026 - present), I bridge engineering depth with business management. On the AI side, I take LLM solutions (RAG, guarded Text-to-SQL) and Machine Learning models from prototype to production. On the data side, I integrate modern platforms such as Databricks (Unity Catalog, Delta Lake, MLflow) to build the reliable foundations that AI needs. Since 2022, I have delivered projects for real clients, taking the lead informally in a team of 3 at SNCB, and turned complex technical results into clear insights for decision-makers. Trained to lead teams at the Royal Military Academy, I strive to drive Data and AI projects end to end.",
  },
  executiveSummary: [
    {
      icon: "🎓",
      title: { fr: "Excellence Académique", en: "Academic Excellence" },
      desc: { fr: "Ingénieur civil informatique (ULB) · Solvay Gestion Tech (en cours) · Bachelier ERM", en: "MSc Computer Science Eng. (ULB) · Solvay Tech Mgmt (ongoing) · BSc RMA" },
    },
    {
      icon: "🚀",
      title: { fr: "Data & IA End-to-End", en: "End-to-End Data & AI" },
      desc: { fr: "Databricks, Medallion, MLflow, RAG & Text-to-SQL en production", en: "Databricks, Medallion, MLflow, RAG & Text-to-SQL in production" },
    },
    {
      icon: "🛡️",
      title: { fr: "Leadership & Clients", en: "Leadership & Clients" },
      desc: { fr: "Lead équipe de 3 (SNCB), Voisin d'Énergie & commandement ERM", en: "Team Lead of 3 (SNCB), Voisin d'Énergie & RMA leadership" },
    },
    {
      icon: "🎯",
      title: { fr: "Vision Pro", en: "Professional Vision" },
      desc: { fr: "Ingénierie Data & IA de bout en bout ➔ Tech & Project Lead", en: "End-to-End Data & AI Engineering ➔ Tech & Project Lead" },
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
        en: "Academic Excellence & Leadership Training at RMA",
      },
      badge: { fr: "École Royale Militaire (ERM)", en: "Royal Military Academy (RMA)" },
      content: {
        fr: "Ressentant le besoin de franchir un cap scientifique, j'ai intégré la faculté Polytechnique de l'École Royale Militaire de Belgique (ERM). J'y ai obtenu un Bachelier en Sciences de l'Ingénieur dans un environnement extrêmement exigeant. Au-delà de la rigueur mathématique, c'est à l'ERM que j'ai forgé mon esprit d'équipe et mon leadership, apprenant à encadrer des équipes de 3 à 7 personnes ainsi qu'un peloton d'une trentaine d'élèves en contexte international, tout en gérant le matériel des étudiants (2020-2022).",
        en: "Driven to reach higher scientific standards, I entered the Faculty of Engineering at the Royal Military Academy of Belgium (RMA). I earned a Bachelor of Science in Engineering Sciences in an exceptionally demanding environment. Beyond mathematical rigor, RMA is where I forged my teamwork and leadership, trained to lead teams of 3 to 7 people and a platoon of about 30 in an international context, while serving as Student Equipment Manager (2020-2022).",
      },
    },
    {
      id: "ulb-iridia",
      title: {
        fr: "Spécialisation Data & IA, Projets Clients et Recherche à l'ULB & IRIDIA",
        en: "Data & AI Specialization, Client Delivery & Research at ULB & IRIDIA",
      },
      badge: { fr: "ULB / IRIDIA (Mention Distinction)", en: "ULB / IRIDIA (Honors / Distinction)" },
      content: {
        fr: "J'ai poursuivi avec le diplôme d'Ingénieur civil en informatique à l'Université Libre de Bruxelles (ULB) avec Distinction. Durant ce cursus, j'ai livré des projets concrets pour l'industrie : prise de lead informelle d'une équipe de 3 pour la maintenance prédictive des trains à la SNCB (pipeline ETL, modèles ML/DL en Python et R, dashboard métier) et implémentation d'un réseau LSTM from scratch en C++ pour Voisin d'Énergie. En parallèle, au laboratoire IRIDIA, j'ai mené ma thèse sur l'analyse topologique des données (TDA) et la métrique de Wasserstein pour transférer des comportements collectifs d'essaims robotiques.",
        en: "I earned my MSc in Computer Science and Engineering at Université Libre de Bruxelles (ULB) with Distinction. Throughout this journey, I delivered real-world client projects: informally leading a team of 3 on predictive train maintenance for SNCB (ETL pipeline, ML/DL models in Python and R, maintenance dashboard) and building an LSTM network from scratch in C++ for Voisin d'Énergie. In parallel, at the IRIDIA lab, I conducted my Master's thesis using Topological Data Analysis (TDA) and Wasserstein metrics to transfer collective behaviors across robotic swarms.",
      },
    },
    {
      id: "solvay-management",
      title: {
        fr: "Double compétence Technologie & Management à la Solvay Brussels School (ULB)",
        en: "Bridging Technology & Management at Solvay Brussels School (ULB)",
      },
      badge: { fr: "Solvay ULB (2026 - en cours)", en: "Solvay ULB (2026 - present)" },
      content: {
        fr: "En parallèle de mes réalisations Data & IA, je poursuis le Master de spécialisation en gestion industrielle et technologique à la Solvay Brussels School of Economics and Management (ULB). Ce programme renforce ma maîtrise de la stratégie, de la finance, du contrôle de gestion et du management opérationnel afin de relier encore plus efficacement l'ingénierie technique aux enjeux business.",
        en: "Alongside my Data & AI projects, I am pursuing the Specialized Master in Industrial and Technological Management at the Solvay Brussels School of Economics and Management (ULB). This program strengthens my command of strategy, finance, management control, and operational leadership to connect technical engineering directly with business strategy.",
      },
    },
  ],
  certificationsGrouped: [
    {
      category: {
        fr: "IA Générative, Machine Learning & Data Science",
        en: "Generative AI, Machine Learning & Data Science",
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
          id: "genai-llms",
          name: "Generative AI with LLMs (in progress)",
          issuer: "DeepLearning.AI",
          verifyUrl: undefined,
        },
        {
          id: "tableau-cert",
          name: "Tableau, Networks & Time Series Data Visualization",
          issuer: "UC Davis / Coursera",
          verifyUrl: "https://coursera.org/share/e35b516356c3e90fa667dd1bdf826c9c",
        },
      ],
    },
    {
      category: {
        fr: "Data Engineering, Cloud & Bases de Données",
        en: "Data Engineering, Cloud & Databases",
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
          id: "ms-sql-server",
          name: "Microsoft SQL Server",
          issuer: "Microsoft / Coursera",
          verifyUrl: "https://www.coursera.org/specializations/microsoft-sql-server",
        },
        {
          id: "ibm-containers",
          name: "Introduction to Containers (Docker, Kubernetes)",
          issuer: "IBM / Coursera",
          verifyUrl: undefined,
        },
        {
          id: "databricks-cert",
          name: "Databricks Lakehouse & AI (in progress)",
          issuer: "Databricks",
          verifyUrl: undefined,
        },
        {
          id: "azure-cert",
          name: "Microsoft Azure Data & AI (in progress)",
          issuer: "Microsoft",
          verifyUrl: undefined,
        },
      ],
    },
    {
      category: {
        fr: "Systèmes, Réseaux & Opérations IT",
        en: "Systems, Networking & IT Operations",
      },
      icon: "🖥️",
      items: [
        {
          id: "google-it-support",
          name: "Google IT Support Professional Certificate",
          issuer: "Google / Coursera",
          verifyUrl: undefined,
        },
        {
          id: "linux-server-admin",
          name: "Linux Server Administration Made Easy",
          issuer: "Coursera",
          verifyUrl: "https://coursera.org/share/f6dc17bec4fd215bdc38cb2066bfa36e",
        },
        {
          id: "win-server-2025",
          name: "Windows Server 2025 Admin, Hands-On Labs",
          issuer: "Coursera",
          verifyUrl: "https://www.coursera.org/learn/packt-windows-server-2025-admin-hands-on-labs-44omo/home/welcome",
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
        fr: "Management & Pilotage de Projets",
        en: "Management & Project Delivery",
      },
      icon: "📊",
      items: [
        {
          id: "pm-foundations",
          name: "Foundations of Project Management",
          issuer: "Google / Coursera",
          verifyUrl: undefined,
        },
        {
          id: "infiniment-grand",
          name: "Vers l'infiniment grand",
          issuer: "Coursera",
          verifyUrl: "https://coursera.org/share/40321d81f432c6738b028e57638bd39e",
        },
      ],
    },
  ] as CertificationGroup[],
  vision: {
    title: {
      fr: "Ma vision : Livrer des Projets Data & IA de Bout en Bout ➔ Tech & Project Lead",
      en: "My Vision: Delivering End-to-End Data & AI Projects ➔ Tech & Project Lead",
    },
    philosophy: {
      fr: "Ce qui relie toutes les étapes de mon parcours, c'est cette exigence : bâtir des fondations de données irréprochables, concevoir des modèles IA/LLM robustes jusqu'en production, et traduire la complexité technique en décisions claires.",
      en: "What connects every stage of my journey is this core standard: build rock-solid data foundations, take AI/LLM models all the way to production, and translate technical complexity into clear decisions.",
    },
    roadmap: {
      fr: "Aujourd'hui, je conçois et déploie des solutions Data, IA et logicielles de bout en bout (architecture Lakehouse Databricks, pipelines ETL, modèles ML/Deep Learning et agents LLM/RAG/Text-to-SQL en production). En complétant mon profil d'ingénieur et mon leadership ERM par le Master de spécialisation en gestion industrielle et technologique à Solvay (ULB), mon objectif est d'évoluer vers le pilotage complet de projets Data & IA à fort impact.",
      en: "Today, I design and deploy Data, AI, and software solutions end to end (Databricks Lakehouse architectures, ETL pipelines, ML/Deep Learning models, and production LLM/RAG/Text-to-SQL agents). Complementing my engineering background and RMA leadership with the Specialized Master in Industrial and Technological Management at Solvay (ULB), my goal is to grow toward leading high-impact Data & AI projects end to end.",
    },
  },
};

