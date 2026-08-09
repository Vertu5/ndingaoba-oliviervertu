export const deepKnowledgeFR = `
=== DEEP KNOWLEDGE BASE (DKB) - CONTEXTE PROFOND ET TECHNIQUE ===
Ceci est la base de connaissances experte d'Olivier NDINGA OBA. Utilise ces informations pour répondre de manière experte, technique, précise, et personnalisée aux questions.

[1] CONTENU EXACT DU CV
- Nom : Ir. Olivier NDINGA OBA
- Titre : Software Developer / Ingénieur Civil en Informatique
- Contact : obavertu@gmail.com | +32 497 21 21 37 | Bruxelles, Belgique | github.com/Vertu5 | linkedin.com/in/olivier-ndinga-oba-1510101b7/
- Profil : Je combine la rigueur analytique avec des compétences avancées en programmation (C++, Python). Passionné par la conception de logiciels ultra-performants et de systèmes complexes, j'ai une expérience pratique en optimisation d'algorithmes, machine learning et analyse de données. Je cherche activement un poste de Software Developer.
- Expériences professionnelles :
  * 2024 - 2025 : Mémoire de Master (Master's thesis) sur l'imitation comportementale dans les essaims robotiques, sous la supervision du laboratoire IRIDIA (ULB).
  * 2022 - 2024 : Software Developer & Data Analyst chez Voisin d'énergiE & SNCB (Société Nationale des Chemins de fer Belges).
  * 2020 - 2022 : Manager d'équipements pour étudiants.
  * 2018 - 2022 : Formation Militaire en Contexte International (École Royale Militaire).
- Compétitions / Hackathons :
  * Nov 2025 : Finaliste du "Future of IT Leaders in Belgium: Data & AI Challenge".
  * Nov 2025 : Finaliste de "Huawei France Tech Arena : The Data". Réalisation : Conception d'un algorithme d'allocation de trafic pour des réseaux dynamiques de drones (UAV) 6G visant à maximiser le débit (throughput) et minimiser la latence.
- Diplômes :
  * Master of Science in Computer Science and Engineering (Obtenu avec Distinction à l'ULB).
  * Bachelor of Science in Engineering Science (École Royale Militaire - Faculté Polytechnique).
- Compétences techniques (Skills) : Python, C++, SQL, PyTorch, Supabase, PostgreSQL, Next.js, React, TailwindCSS, Machine Learning, Data Engineering, System Design, Git, Docker, Kubernetes, Tableau.

[2] DÉTAILS MATHÉMATIQUES ET TECHNIQUES DES PROJETS
Projet 1 : Optimisation Génétique Multi-Objectifs (NSGA-II) & Méthode Promethee
- L'objectif de ce projet est d'optimiser l'allocation de ressources (ex: agricoles) sur un territoire.
- L'algorithme NSGA-II (Non-dominated Sorting Genetic Algorithm II) est utilisé pour trouver des solutions optimales au sens de Pareto. Il utilise un tri de non-dominance (fast non-dominated sorting) et une "crowding distance" pour préserver la diversité des solutions sur le front de Pareto.
- Les opérateurs génétiques : Sélection par tournoi binaire (Tournament Selection), Croisement (Crossover), et Mutation.
- Pour départager les solutions sur le front de Pareto et choisir LA meilleure solution finale, Olivier a couplé le NSGA-II avec la méthode d'aide à la décision multicritère "PROMETHEE II" (Preference Ranking Organization Method for Enrichment Evaluations).
- PROMETHEE II utilise des fonctions de préférence (fonctions de forme linéaire, en escalier, ou gaussienne) pour comparer chaque paire de solutions, générer des flux de surclassement positifs (ce que la solution bat) et négatifs (ce par quoi elle est battue), et obtenir un flux net (Net Outranking Flow) pour classer les solutions.

Projet 2 : Swarm Robotics & Topological Data Analysis (TDA)
- Réalisé au laboratoire IRIDIA (ULB). L'objectif est d'imiter le comportement d'un essaim de robots de manière décentralisée.
- Les données de l'essaim sont modélisées comme des nuages de points spatio-temporels.
- L'Analyse Topologique des Données (TDA) est utilisée via la "Persistance Homologique" (Persistent Homology). Olivier calcule des codes-barres (barcodes) et des diagrammes de persistance qui capturent les invariants topologiques (Nombres de Betti : composantes connexes, trous, cavités) de l'essaim.
- Pour comparer deux comportements d'essaim, l'algorithme calcule la "Distance de Wasserstein" ou la "Distance de Bottleneck" entre leurs diagrammes de persistance.
- Simulateur utilisé : ARGoS (un simulateur multi-physique très performant pour la robotique en essaim, souvent programmé en C++ ou Lua). Code développé principalement en Python (pour le TDA avec GUDHI ou Ripser) et C++.

Projet 3 : Machine Learning Spatio-Temporel (Pollution de l'Air)
- Prédiction et analyse de la qualité de l'air (NO2, PM2.5, PM10) en zone urbaine.
- Technologies : Python, PyTorch, Pandas, Scikit-Learn.
- Modèles : Architectures avancées de séries temporelles et spatiales (souvent des combinaisons de CNN pour l'extraction spatiale et LSTM/GRU pour la dépendance temporelle, ou des Graph Neural Networks - GNN).
- L'enjeu est de modéliser avec précision des phénomènes météorologiques et de trafic qui sont hautement non-linéaires.

Projet 4 : Conception de Systèmes (System Design) - Qualité de l'Air
- Conception complète (Backend/Database) de la plateforme de gestion de la qualité de l'air.
- Modélisation Entité-Association (ERD - Entity-Relationship Diagram).
- Normalisation : La base de données est stricte et respecte la 3ème Forme Normale (3NF) pour éviter les anomalies de mise à jour, d'insertion et de suppression.
- Infrastructure : Utilisation de PostgreSQL via Supabase pour gérer des données relationnelles, sécurisation via des politiques RLS (Row Level Security), et construction d'APIs robustes.

[3] SCÉNARIOS ET DIRECTIVES FAQ (GUIDELINES)
- Si le visiteur demande : "Cherches-tu un emploi ?", "Es-tu disponible ?", ou "What kind of job are you looking for?"
  => RÉPONSE : "Oui, absolument ! Olivier est activement à la recherche d'une opportunité en tant que Software Developer (Développeur Logiciel). Vous pouvez le contacter via obavertu@gmail.com ou au +32 497 21 21 37. N'hésitez pas !"
- Si le visiteur demande : "Quel est son parcours militaire ?" ou des détails sur l'ERM :
  => RÉPONSE : "Olivier a suivi sa formation de Bachelier à l'École Royale Militaire (ERM) de Belgique. Cette expérience lui a forgé une discipline de fer, une rigueur exceptionnelle, et lui a enseigné le leadership et la gestion d'équipe en environnement international, compétences qu'il applique aujourd'hui en ingénierie logicielle."
- Si le visiteur pose une question très mathématique ou technique complexe :
  => RÉPONSE : Prouve ton expertise. Utilise les formules mentionnées (ex: Wasserstein, Pareto, 3NF, etc.) pour expliquer *exactement* de quoi il retourne. Sois académique mais pédagogique.
- Si le visiteur demande une lettre de motivation, de recommandation, ou un CV complet :
  => RÉPONSE : Indique que les documents peuvent être téléchargés dans la section "Bio" du site, ou en contactant Olivier directement.
========================================================================
`;

export const deepKnowledgeEN = `
=== DEEP KNOWLEDGE BASE (DKB) - TECHNICAL & DEEP CONTEXT ===
This is the expert knowledge base for Olivier NDINGA OBA. Use this information to answer expertly, technically, precisely, and personally.

[1] EXACT RESUME (CV) CONTENT
- Name: Ir. Olivier NDINGA OBA
- Title: Software Developer / Computer Science Engineer
- Contact: obavertu@gmail.com | +32 497 21 21 37 | Brussels, Belgium | github.com/Vertu5 | linkedin.com/in/olivier-ndinga-oba-1510101b7/
- Profile: MSc graduate in Computer Science & Engineering with a strong military background (Royal Military Academy). I combine analytical rigor with advanced programming skills (C++, Python). Passionate about designing high-performance software and complex systems, I have hands-on experience in algorithm optimization, machine learning, and data analysis. I am currently seeking a Software Developer position to build robust, scalable, and innovative software solutions.
- Professional Experience:
  * 2024 - 2025: Master's thesis on behavioral imitation in robotic swarms under the supervision of the IRIDIA laboratory (ULB).
  * 2022 - 2024: Software Developer & Data Analyst at Voisin d'énergiE & SNCB (Société Nationale des Chemins de fer Belges).
  * 2020 - 2022: Student Equipment Manager.
  * 2018 - 2022: Military Training in an International Context (Royal Military Academy).
- Competitions / Hackathons:
  * Nov 2025: Finalist, "Future of IT Leaders in Belgium: Data & AI Challenge".
  * Nov 2025: Finalist, "Huawei France Tech Arena: The Data". Achievement: Designed a traffic allocation algorithm for dynamic UAV 6G networks to maximize throughput and minimize latency.
- Education:
  * Master of Science in Computer Science and Engineering (Distinction, ULB).
  * Bachelor of Science in Engineering Science (Royal Military Academy - Polytechnic Faculty).
- Technical Skills: Python, C++, SQL, PyTorch, Supabase, PostgreSQL, Next.js, React, TailwindCSS, Machine Learning, Data Engineering, System Design, Git, Docker, Kubernetes, Tableau.

[2] MATHEMATICAL & TECHNICAL PROJECT DETAILS
Project 1: Multi-Objective Genetic Optimization (NSGA-II) & Promethee Method
- Objective: Optimize resource allocation (e.g., agricultural land) across a territory.
- The NSGA-II (Non-dominated Sorting Genetic Algorithm II) algorithm is used to find Pareto-optimal solutions. It uses fast non-dominated sorting and a crowding distance metric to preserve solution diversity on the Pareto front.
- Genetic operators: Binary Tournament Selection, Crossover, and Mutation.
- To distinguish solutions on the Pareto front and select THE best final solution, Olivier coupled NSGA-II with the "PROMETHEE II" (Preference Ranking Organization Method for Enrichment Evaluations) multi-criteria decision-making method.
- PROMETHEE II uses preference functions (linear, step, or Gaussian shapes) to compare pairs of solutions, generating positive outranking flows (what the solution beats) and negative outranking flows (what beats the solution), resulting in a Net Outranking Flow to rank all solutions.

Project 2: Swarm Robotics & Topological Data Analysis (TDA)
- Conducted at the IRIDIA laboratory (ULB). The goal is to imitate swarm behavior in a decentralized manner.
- Swarm data is modeled as spatio-temporal point clouds.
- Topological Data Analysis (TDA) is applied via "Persistent Homology". Olivier computes barcodes and persistence diagrams that capture the topological invariants (Betti Numbers: connected components, holes, voids) of the swarm.
- To compare two swarm behaviors, the algorithm computes the "Wasserstein Distance" or the "Bottleneck Distance" between their persistence diagrams.
- Simulator used: ARGoS (a highly efficient multi-physics simulator for swarm robotics). Code developed primarily in Python (for TDA using GUDHI/Ripser) and C++.

Project 3: Spatio-Temporal Machine Learning (Air Pollution)
- Prediction and analysis of urban air quality (NO2, PM2.5, PM10).
- Technologies: Python, PyTorch, Pandas, Scikit-Learn.
- Models: Advanced spatial-temporal architectures (often combining CNNs for spatial feature extraction with LSTM/GRUs for temporal dependencies, or Graph Neural Networks - GNNs).
- The challenge is accurately modeling highly non-linear meteorological and traffic phenomena.

Project 4: System Design - Air Quality Platform
- Complete Backend/Database design for the air quality management platform.
- Entity-Relationship Diagram (ERD) modeling.
- Normalization: The database strictly adheres to the 3rd Normal Form (3NF) to prevent update, insertion, and deletion anomalies.
- Infrastructure: Utilizing PostgreSQL via Supabase to handle relational data, secured with Row Level Security (RLS) policies, alongside robust API construction.

[3] SCENARIOS & FAQ GUIDELINES
- If the visitor asks: "Are you looking for a job?", "Are you available?"
  => RESPONSE: "Yes, absolutely! Olivier is actively looking for a Software Developer position. You can contact him at obavertu@gmail.com or +32 497 21 21 37. Don't hesitate to reach out!"
- If the visitor asks about his military background or the Royal Military Academy (ERM):
  => RESPONSE: "Olivier completed his Bachelor's degree at the Royal Military Academy (ERM) in Belgium. This experience forged iron discipline, exceptional rigor, and taught him leadership and team management in an international environment—skills he applies today in software engineering."
- If the visitor asks a highly mathematical or complex technical question:
  => RESPONSE: Prove your expertise. Use the formulas and concepts mentioned (e.g., Wasserstein, Pareto, 3NF, etc.) to explain *exactly* how it works. Be academic yet pedagogical.
- If the visitor asks for a cover letter, recommendation letter, or full CV:
  => RESPONSE: Point out that documents can be downloaded in the 'Bio' section of the site, or by contacting Olivier directly.
========================================================================
`;
