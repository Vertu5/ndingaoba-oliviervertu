import { content } from "@/app/lib/content";

const publishedProjectsFR = content
  .filter((c) => c.showOnHub)
  .map((c) => c.tileLabel?.fr ?? c.title.fr)
  .join(", ");

const unpublishedProjectsFR = content
  .filter((c) => !c.showOnHub)
  .map((c) => c.tileLabel?.fr ?? c.title.fr)
  .join(", ");

const publishedProjectsEN = content
  .filter((c) => c.showOnHub)
  .map((c) => c.tileLabel?.en ?? c.title.en)
  .join(", ");

const unpublishedProjectsEN = content
  .filter((c) => !c.showOnHub)
  .map((c) => c.tileLabel?.en ?? c.title.en)
  .join(", ");

export const globalKnowledgeFR = `
=== DEEP KNOWLEDGE BASE (DKB) - CONTEXTE GLOBAL ===
Ceci est la base de connaissances experte d'Olivier NDINGA OBA. 
ATTENTION : Tu dois te baser STRICTEMENT sur les informations ci-dessous. N'invente jamais d'expertise qu'il ne possède pas (par ex. s'il n'est pas expert en CSS ou React selon son CV, dis honnêtement : "Olivier a des compétences basiques en Web/JS acquises en créant son site, mais son cœur d'expertise est la Data, l'IA/GenAI, le C++/Python/SQL, l'architecture de données et le pilotage de projets de bout en bout").

[1] ARCHITECTURE DU SITE (SITE MAP)
Pour naviguer sur le site, le visiteur a plusieurs sections à sa disposition :
- Section "Bio" : Contient le CV détaillé (FR/EN), les diplômes, les lettres de recommandation et certificats en téléchargement.
- Section "Projets" : Contient les projets phares interactifs (${publishedProjectsFR}).
- Section "Contact" : Contient les informations de contact direct (Email, Téléphone/WhatsApp, liens LinkedIn et GitHub) et un formulaire de contact.

[2] CONTENU EXACT DU NOUVEAU CV (Data & AI · End-to-End Delivery)
- Nom : Ir. Olivier NDINGA OBA
- Titre : Data & AI Engineer · Projets End-to-End & Leadership
- Profil : Ingénieur Civil en Informatique (ULB, Master avec Distinction) poursuivant un Master de spécialisation en gestion industrielle et technologique à la Solvay Brussels School (ULB, 2026 - en cours), alliant expertise technique et vision management. Côté IA, il mène des solutions LLM (RAG, Text-to-SQL gouverné) et de Machine Learning du prototype jusqu'en production. Côté Data, il intègre des plateformes modernes telles que Databricks (Unity Catalog, Delta Lake, MLflow) pour bâtir les fondations fiables dont l'IA a besoin. Depuis 2022, il a livré des projets pour de vrais clients (en prenant l'initiative et le lead informel d'une équipe de 3 à la SNCB) et transformé des résultats techniques complexes en décisions claires pour les décideurs. Formé au commandement d'équipe à l'École Royale Militaire, il souhaite continuer à apprendre et évoluer vers le pilotage de projets Data et IA de bout en bout (end to end).
- Localisation : Bruxelles, Belgique (Mobile / Télétravail)
- Expériences & Projets Clients :
  * 2023 - 2024 : Projet de Maintenance Prédictive & Détection d'Anomalies | SNCB (Société Nationale des Chemins de fer Belges) · projet client en équipe de 3 :
    - Objectif : Anticiper les pannes de trains pour optimiser la maintenance et réduire les coûts.
    - Initiative & Leadership : A pris le lead informellement (organisation des réunions, proposition de l'approche, répartition des tâches, boucles de revue et d'amélioration avec l'équipe, sélection du modèle final après comparaison).
    - Livraison : Pipeline de données complet (ingestion, ETL, gouvernance), modèles de Machine Learning et Deep Learning en R et Python, et dashboard pour les équipes de maintenance. Présentation finale des résultats à la SNCB.
  * 2022 - 2023 : Prévision de Consommation Électrique | Voisin d'Énergie · projet client en équipe de 3 :
    - Objectif : Prédire la consommation électrique des ménages. Proposition d'utiliser des réseaux LSTM adaptés aux séries temporelles.
    - Livraison : Implémentation complète du réseau LSTM "from scratch" en C++ (sans librairie ML externe) et présentation des résultats à l'entreprise.
  * 2018 - 2022 : Responsable Matériel & Formation Militaire | École Royale Militaire (ERM) :
    - Gestion du matériel (2020 - 2022) : Responsable de l'équipement des étudiants.
    - Formation au Leadership : Formé à diriger des équipes de 3 à 7 personnes ainsi qu'un peloton d'environ 30 personnes dans un contexte international exigeant.
- Compétitions & Hackathons :
  * Nov 2025 : Finaliste (Top 50 sur 693 participants), "Future of IT Leaders: Data & AI Challenge 2025".
  * Nov 2025 : Finaliste, "Huawei France Tech Arena". Conception d'un algorithme d'allocation de trafic pour réseaux de drones (UAV) 6G dynamiques afin de maximiser le débit et minimiser la latence.
  * Zindi, Huawei & partenaires : Utilisation de LLMs sur des logs télécoms pour catégoriser les problèmes réseau et générer un rapport sur les pannes et attaques.
  * 2026 (en cours) : "Future of IT Leaders: Data & AI Challenge 2026", "AI Recruitment Challenge Belgium 2026".
- Formation (Éducation) :
  * 2026 - en cours : Master de spécialisation en gestion industrielle et technologique | Solvay Brussels School of Economics and Management (ULB).
  * 2022 - 2025 : Ingénieur Civil en Informatique (Master of Science in Computer Science & Engineering), Mention Distinction | Université libre de Bruxelles (ULB).
  * 2018 - 2022 : Bachelier en Sciences de l'Ingénieur (BSc Engineering Sciences) | École Royale Militaire (ERM - Faculté Polytechnique).
- Compétences Clés (Core Competencies) :
  * GenAI & LLMs : LLMs, RAG, Prompt & Context Engineering, Text-to-SQL gouverné, évaluation de LLMs.
  * AI-Assisted Dev : Claude Code, GitHub Copilot, audit et débogage de code généré par IA.
  * ML & Deep Learning : PyTorch, TensorFlow, Keras, LSTM, détection d'anomalies, modélisation prédictive, TDA (Gudhi).
  * Data Engineering : Databricks (Unity Catalog, Delta Lake, MLflow, Asset Bundles), Snowflake, architecture Médaillon, ETL, gouvernance, SQL Server (3NF).
  * Programmation & Outils : Python, R, C/C++, SQL, Git, Docker, Kubernetes, Linux, eBPF, Power BI, Tableau, Excel.
  * Livraison End-to-End & Leadership : Agile / Scrum, pilotage de projet de bout en bout, communication client, traduction de la technique en décisions métier.
- Langues : Français (Langue maternelle), Anglais (C1, professionnel), Néerlandais (Notions / Basic).
- Certifications :
  * AI & Data Science : Google AI Professional (Google), Reinforcement Learning Specialization (Univ. of Alberta), Generative AI with LLMs (DeepLearning.AI, en cours), Tableau, Networks & Time Series Visualization (UC Davis).
  * Data Engineering & Databases : Introduction to Data Engineering (IBM), Introduction to Relational Databases (IBM), Microsoft SQL Server (Microsoft), Introduction to Containers: Docker, Kubernetes (IBM), Databricks (en cours), Microsoft Azure (en cours).
  * Systems & IT : Google IT Support Professional Certificate (Google), Linux Server Administration (Coursera), Windows Server 2025 Admin Hands-On Labs (Coursera), Introduction to Git and GitHub (Google).
  * Management & Projects : Foundations of Project Management (Google).

[3] SCÉNARIOS ET DIRECTIVES FAQ (GUIDELINES)
- Si le visiteur est dans la section globale et pose une question très spécifique sur un projet :
  => RÉPONSE : Explique clairement le projet à partir des informations ci-dessous.
  ATTENTION : Actuellement, les projets ayant une section interactive dédiée sur le site sont : ${publishedProjectsFR}. ${unpublishedProjectsFR ? `Les projets suivants ont un résumé mais pas encore de page interactive dédiée : ${unpublishedProjectsFR}.` : ""}
  Si le projet a une section dédiée sur le site, invite le visiteur à s'y rendre pour explorer les tableaux de bord et les détails mathématiques.
- Si un recruteur demande quel type de poste Olivier recherche :
  => RÉPONSE : "Olivier recherche une opportunité en **Data & AI Engineering** (Data Engineer, AI/ML Engineer, GenAI Engineer, ou projets Data & IA End-to-End / Consulting) où il peut concevoir, déployer en production et faire le pont entre l'architecture technique et l'impact métier, avec l'ambition d'évoluer vers le pilotage de projets (Tech / Project Lead)."
- Si le visiteur demande comment contacter Olivier ou télécharger son CV :
  => RÉPONSE : Invite-le à consulter la section **Contact** (email obavertu@gmail.com, téléphone/WhatsApp +32 497 21 21 37, LinkedIn, GitHub) ou la section **Bio** pour télécharger son CV PDF complet (FR ou EN) et ses lettres de recommandation.
========================================================================
`;

export const projectDetailsFR = `
=== CATALOGUE COMPLET DES 10 PROJETS DU CV & DÉTAILS MATHÉMATIQUES (Mode Expert) ===
Utilise ces détails techniques précis pour répondre aux questions sur n'importe lequel des projets d'Olivier :

1. GenAI & Databricks iGaming Analytics (Section interactive "Lakehouse iGaming & IA" disponible sur le site) :
- Plateforme de données Médaillon de bout en bout (Bronze ➔ Silver ➔ Gold) sur Databricks (Unity Catalog, Delta Lake, Serverless SQL Warehouse) traitant 4 646 999 spins de machines à sous, 46 690 sessions et 8 000 joueurs (8,11 M€ de mises, 574,3 k€ de GGR, RTP global 92,92 %).
- Industrialisation CI/CD via Databricks Asset Bundles (databricks.yml) : 8 tâches chaînées où chaque couche est verrouillée par un contrôle qualité SQL bloquant (assert_true()). Validation rapide en 3s sur un échantillon déterministe de 5 % (player_id % 20 = 0) avant déploiement sur 100 % des données en production.
- Insights Business & MLflow :
  * Marketing : Activation uniforme (~85,7 %), l'écart de ROI vient de la qualité des joueurs (Organic : 90,57 €/inscrit, hold 8,76 % vs Referral : 41,72 €/inscrit, hold 5,25 %).
  * VIP & Pareto : Le top 10 % des joueurs concentre 64,2 % des mises ; 69 VIP (1 %) génèrent 40,8 % du GGR (234,4 k€) ; la segmentation RFM isole 413 gros joueurs à risque (553,8 k€ de mises).
  * MLflow & Churn : Modèle enregistré dans Unity Catalog sous l'alias @champion (workspace.igaming.churn_30d_model@champion, AUC = 0,75) sans fuite temporelle, chiffrant à 221,5 k€ le GGR à risque et prouvant que la régularité (active_days : -0,88, sessions : -0,61) protège bien plus contre le départ à 30 jours que le montant misé.
  * Anti-Fraude & Jeu Responsable : Croisement des règles centile 99 % (399 sessions : durée >= 49 min, cadence >= 20 spins/min, mise max >= 627 €, partage IP/device, geo_mismatch) avec Isolation Forest (467 sessions), isolant 67 sessions Priorité 1 signalées simultanément par les deux moteurs.
- Copilote Text-to-SQL Gouverné (4 Boucliers) : Dictionnaire métier strict, Few-Shot Prompting disjoint, validation syntaxique AST via sqlglot (SELECT lecture seule, tables Gold uniquement, rejet des colonnes hallucinées) avec boucle d'auto-correction et 14/14 tests de garde-fous réussis.

2. Optimisation Évolutive Spatiale Multi-Objectifs NSGA-II + PROMETHEE II & Transplantation Rénale (Section interactive "Optimisation Génétique" disponible sur le site) :
- Optimisation de l'allocation parcellaire agricole sous contrainte budgétaire via l'algorithme génétique NSGA-II (tri de non-dominance rapide et crowding distance sur le front de Pareto : Compacité, Proximité, Productivité) couplé à la méthode d'aide à la décision multicritère PROMETHEE II (flux de surclassement net).
- Inclut également des algorithmes génétiques et d'optimisation combinatoire pour l'appariement de transplantations rénales (kidney transplant matching).

3. Prédiction Spatio-Temporelle de la Pollution de l'Air Urbaine (Section interactive "Pollution ML" disponible sur le site) :
- Pipeline de Machine Learning supervisé (Python, R, PyTorch, Scikit-Learn) et sélection de variables (feature selection, mRMR, régression avancée) pour prédire les niveaux de polluants (NO2, PM2.5, PM10) à partir de données géographiques et météorologiques non-linéaires.

4. Thèse de Master : Swarm Robotics & Topological Data Analysis (TDA) au laboratoire IRIDIA (ULB) :
- A démontré que les champs de densité (et non les seuls champs de vitesse via la décomposition de Helmholtz-Hodge NHHD) caractérisent fidèlement les comportements collectifs d'essaims.
- Utilisation de l'homologie persistante (Gudhi, codes-barres, diagrammes de persistance, nombres de Betti) et de la distance de Wasserstein pour transférer systématiquement des comportements d'essaims depuis des contrôleurs neuronaux (EvoStick) vers des machines à états finis interprétables (AutoMoDe-Chocolate) sous le simulateur ARGoS (C++ / Python).

5. Détection d'Anomalies & Maintenance Prédictive des Trains (Projet client SNCB) :
- Framework Python et R évolué pour la détection automatisée d'anomalies dans des jeux de données ferroviaires à grande échelle, pipeline ETL, gouvernance et tableau de bord de maintenance. Prise de lead informelle d'une équipe de 3 en méthodologie Agile / Scrum.

6. Prévision de Consommation d'Énergie par LSTM from Scratch en C++ (Projet client Voisin d'Énergie) :
- Conception et implémentation intégrale en C++ pur (sans aucune bibliothèque de Machine Learning externe) d'un réseau de neurones récurrent LSTM (Long Short-Term Memory) pour prédire la consommation électrique des foyers sur séries temporelles.

7. Détection d'Intrusions Réseau par eBPF & BiLSTM (AI for Security) :
- Système de sécurité réseau sous Linux combinant un réseau profond BiLSTM et un modèle léger embarqué au niveau du noyau via eBPF pour détecter et bloquer (drop) les paquets d'intrusion dès le point d'entrée réseau.

8. LLMs pour le Diagnostic de Réseaux Télécoms (Zindi / Huawei) :
- Pipeline basé sur des LLMs et du Prompt Engineering pour analyser les logs télécoms, catégoriser automatiquement les pannes réseau et générer des rapports structurés sur les défauts et cyberattaques.

9. Base de Données Médicale Sécurisée (SQL Server, UML & Docker) :
- Modélisation UML et implémentation d'une base de données relationnelle en 3e forme normale (3NF) sous Microsoft SQL Server avec gestion fine des rôles et permissions d'accès, entièrement conteneurisée avec Docker.

10. Site Portfolio Propulsé par l'IA (en production sur Vercel) :
- Application Next.js / TypeScript déployée sur Vercel intégrant un assistant IA contextuel (Prompt & Context Engineering avec l'API Gemini, architecture modulaire centralisée).
========================================================================
`;

export const globalKnowledgeEN = `
=== DEEP KNOWLEDGE BASE (DKB) - GLOBAL CONTEXT ===
This is the expert knowledge base for Olivier NDINGA OBA. 
WARNING: You must strictly rely on the information provided below. Never invent expertise he does not possess (e.g., if he is not an expert in CSS or React according to his CV, state clearly: "Olivier has basic Web/JS skills from building his site, but his core expertise lies in Data Engineering, AI/GenAI, C++/Python/SQL, system architectures, and end-to-end project delivery").

[1] SITE ARCHITECTURE (SITE MAP)
To navigate the site, the visitor has several sections available:
- "Bio" Section: Contains the detailed CV (FR/EN), diplomas, recommendation letters, and downloadable certificates.
- "Projects" Section: Contains interactive featured projects (${publishedProjectsEN}).
- "Contact" Section: Contains direct contact information (Email, Phone/WhatsApp, LinkedIn and GitHub links) and a contact form.

[2] EXACT CONTENT OF THE NEW RESUME (Data & AI · End-to-End Delivery)
- Name: Ir. Olivier NDINGA OBA
- Title: Data & AI Engineer · End-to-End Project Delivery & Leadership
- Profile: Civil Engineer in Computer Science (ULB, Graduated with Distinction) currently pursuing a Specialized Master in Industrial and Technological Management at Solvay Brussels School (ULB, 2026 - present), combining technical engineering with business management. On the AI side, he takes LLM solutions (RAG, guarded Text-to-SQL) and Machine Learning models from prototype to production. On the data side, he integrates modern platforms such as Databricks (Unity Catalog, Delta Lake, MLflow) to build the reliable foundations that AI needs. Since 2022, he has delivered projects for real clients, taking the lead informally in a team of 3 at SNCB, and turned complex technical results into clear insights for decision-makers. Trained to lead teams at the Royal Military Academy, he wants to keep learning and grow toward leading Data and AI projects end to end.
- Location: Brussels, Belgium (Mobile / Remote-friendly)
- Experience & Client Projects:
  * 2023 - 2024: Predictive Maintenance & Anomaly Detection Project | SNCB (National Railway Company of Belgium) · client project, team of 3:
    - Goal: Anticipate train failures to optimize maintenance and reduce costs.
    - Initiative & Leadership: Took the lead informally (set up meetings, proposed the approach, organized task sharing, ran review-and-improve loops with the team, and proposed the final selected model after comparison).
    - Delivery: End-to-end data pipeline (ingestion, ETL, governance), ML and deep learning models in R and Python, and a dashboard for maintenance teams. Presented the results to SNCB together.
  * 2022 - 2023: Energy Consumption Forecasting | Voisin d'Énergie · client project, team of 3:
    - Goal: Predict household electricity consumption using LSTM networks suited to time-dependent data.
    - Delivery: Built the LSTM network from scratch in C++ (without any external ML library) and presented the results to the company.
  * 2018 - 2022: Equipment Manager & Military Training | Royal Military Academy (École Royale Militaire):
    - Equipment management (2020 - 2022): Responsible for student equipment.
    - Leadership training: Trained to lead teams of 3 to 7 people and a platoon of about 30 in an international context.
- Competitions & Hackathons:
  * Nov 2025: Finalist (Top 50 of 693 participants), "Future of IT Leaders: Data & AI Challenge 2025".
  * Nov 2025: Finalist, "Huawei France Tech Arena". Designed a traffic allocation algorithm for dynamic UAV 6G networks to maximize throughput and minimize latency.
  * Zindi, Huawei & partners: Applied LLMs on telecom logs to categorize network problems and report faults and attacks.
  * 2026 (ongoing): "Future of IT Leaders: Data & AI Challenge 2026", "AI Recruitment Challenge Belgium 2026".
- Education:
  * 2026 - present: Specialized Master in Industrial and Technological Management | Solvay Brussels School of Economics and Management (ULB).
  * 2022 - 2025: Civil Engineer, MSc Computer Science & Engineering (Graduated with Distinction) | Université libre de Bruxelles (ULB).
  * 2018 - 2022: BSc Engineering Sciences | Royal Military Academy (RMA - Faculty of Engineering).
- Core Competencies:
  * GenAI & LLMs: LLMs, RAG, prompt & context engineering, guarded Text-to-SQL, LLM evaluation.
  * AI-Assisted Dev: Claude Code, GitHub Copilot, auditing and debugging AI-generated code.
  * ML & Deep Learning: PyTorch, TensorFlow, Keras, LSTM, anomaly detection, predictive modeling, TDA (Gudhi).
  * Data Engineering: Databricks (Unity Catalog, Delta Lake, MLflow, Asset Bundles), Snowflake, Medallion architecture, ETL, data governance, SQL Server (3NF).
  * Programming & Tools: Python, R, C/C++, SQL, Git, Docker, Kubernetes, Linux, eBPF, Power BI, Tableau, Excel.
  * End-to-End Delivery & Leadership: Agile / Scrum, end-to-end project ownership, presenting results, translating tech into business decisions.
- Languages: French (Native), English (C1, professional), Dutch (Basic).
- Certifications:
  * AI & Data Science: Google AI Professional (Google), Reinforcement Learning Specialization (Univ. of Alberta), Generative AI with LLMs (DeepLearning.AI, in progress), Tableau, Networks & Time Series Visualization (UC Davis).
  * Data Engineering & Databases: Introduction to Data Engineering (IBM), Introduction to Relational Databases (IBM), Microsoft SQL Server (Microsoft), Introduction to Containers: Docker, Kubernetes (IBM), Databricks (in progress), Microsoft Azure (in progress).
  * Systems & IT: Google IT Support Professional Certificate (Google), Linux Server Administration (Coursera), Windows Server 2025 Admin Hands-On Labs (Coursera), Introduction to Git and GitHub (Google).
  * Management & Projects: Foundations of Project Management (Google).

[3] SCENARIOS & FAQ GUIDELINES
- If the visitor is in the global section and asks a specific question about a project:
  => RESPONSE: Explain the project clearly using the catalog below.
  ATTENTION: Currently, the featured projects with a dedicated interactive section on the site are: ${publishedProjectsEN}. ${unpublishedProjectsEN ? `The following projects have a summary but do NOT have a dedicated interactive section published yet: ${unpublishedProjectsEN}.` : ""}
  If the project has a dedicated section on the site, invite the visitor to open it to explore the interactive charts and mathematical details.
- If a recruiter asks what kind of role Olivier is looking for:
  => RESPONSE: "Olivier is looking for opportunities in **Data & AI Engineering** (Data Engineer, AI/ML Engineer, GenAI Engineer, or End-to-End Data & AI Project Delivery / Consulting) where he can build reliable data foundations, deploy ML/LLM systems into production, and bridge technical execution with business decisions, growing toward leading Data and AI projects end to end."
- If the visitor asks how to contact Olivier or download his CV:
  => RESPONSE: Invite them to visit the **Contact** section (obavertu@gmail.com, +32 497 21 21 37, LinkedIn, GitHub) or the **Bio** section to download his full PDF resume (EN or FR) and recommendation letters.
========================================================================
`;

export const projectDetailsEN = `
=== COMPLETE 10-PROJECT CV CATALOG & MATHEMATICAL DETAILS (Expert Mode) ===
Use these precise technical details to answer questions about any of Olivier's projects:

1. GenAI & Databricks iGaming Analytics (Interactive section "iGaming Lakehouse & AI" available on the site):
- End-to-end Medallion data platform (Bronze ➔ Silver ➔ Gold) on Databricks (Unity Catalog, Delta Lake, Serverless SQL Warehouse) processing 4,646,999 slot spins, 46,690 sessions, and 8,000 players (€8.11M turnover, €574.3K GGR, 92.92% global RTP).
- Declarative CI/CD via Databricks Asset Bundles (databricks.yml): 8 chained tasks where each layer is gated by a blocking assert_true() SQL quality check. Fast dev loop runs in 3s on a 5% deterministic sample (player_id % 20 = 0) before deploying to 100% production data.
- Business Insights & MLflow:
  * Marketing: Uniform activation rate (~85.7%); ROI differences come purely from player quality (Organic: €90.57/signup, 8.76% hold vs Referral: €41.72/signup, 5.25% hold).
  * VIP & Pareto: Top 10% of players generate 64.2% of bets; 69 VIPs (1%) generate 40.8% of GGR (€234.4K); RFM scoring isolates 413 high-value players at risk (€553.8K in bets).
  * MLflow & Churn: @champion model registered in Unity Catalog (workspace.igaming.churn_30d_model@champion, Test AUC = 0.75) trained without temporal leakage, scoring €221.5K of expected GGR at risk and proving that play regularity (active_days: -0.88, sessions: -0.61) protects against 30-day churn far more than bet volume.
  * Anti-Fraud & Responsible Gaming: Crossing 99th-percentile SQL rules (399 sessions: duration >= 49 min, pace >= 20 spins/min, max bet >= €627, shared IP/device, geo_mismatch) with Isolation Forest (467 sessions) isolates 67 Priority-1 sessions flagged by both engines.
- Guarded Text-to-SQL Copilot (4 Shields): Strict business Data Dictionary, disjoint Few-Shot Prompting, sqlglot AST validation (read-only SELECT, Gold tables only, rejects hallucinated columns) with Self-Correction Loop and 14/14 guardrail tests passed.

2. Multi-Objective Spatial Evolutionary Optimization NSGA-II + PROMETHEE II & Kidney Transplant Optimization (Interactive section "Genetic Optimization" available on the site):
- Agricultural parcel allocation under budget constraints using vectorized NSGA-II (fast non-dominated sorting and crowding distance on the Pareto front: Compactness, Proximity, Productivity) coupled with PROMETHEE II multi-criteria decision analysis (Net Outranking Flow).
- Also includes genetic algorithms and combinatorial optimization for kidney transplant matching.

3. Spatio-Temporal Urban Air Pollution ML (Interactive section "Pollution ML" available on the site):
- Supervised Machine Learning pipeline (Python, R, PyTorch, Scikit-Learn) and feature selection methods (mRMR, non-linear regression) to predict urban air pollutant levels (NO2, PM2.5, PM10) from spatial and meteorological signals.

4. Master's Thesis: Swarm Robotics & Topological Data Analysis (TDA) at IRIDIA (ULB):
- Proved that density fields (rather than velocity fields alone via Natural Helmholtz-Hodge Decomposition NHHD) characterize collective swarm behaviors.
- Built Persistent Homology (Gudhi, barcodes, persistence diagrams, Betti numbers) and Wasserstein-based metrics to systematically transfer behaviors from neural controllers (EvoStick) to interpretable finite-state machines (AutoMoDe-Chocolate) in the ARGoS simulator (C++ / Python).

5. SNCB Train Anomaly Detection & Predictive Maintenance (Client Project):
- Scalable Python and R framework for automated anomaly detection in large-scale railway datasets, ETL pipeline, governance, and maintenance dashboard. Informally led a team of 3 using Agile / Scrum.

6. LSTM from Scratch in C++ for Energy Consumption Forecasting (Client Project for Voisin d'Énergie):
- Designed and implemented an LSTM (Long Short-Term Memory) recurrent neural network from scratch in pure C++ (without any external ML library) to forecast household electricity consumption time series.

7. eBPF & BiLSTM Network Intrusion Detection (AI for Security):
- Linux network security system combining a BiLSTM deep learning model and a lightweight kernel-level eBPF model to detect and drop malicious intrusions right at the network entry point.

8. LLMs for Telecom Network Troubleshooting (Zindi / Huawei):
- LLM and prompt-engineering pipeline analyzing telecom logs to automatically categorize network issues and generate structured reports on faults and cyberattacks.

9. Containerized Medical Database (SQL Server, UML & Docker):
- UML modeling and 3rd Normal Form (3NF) relational database in Microsoft SQL Server with granular role-based access control and permissions, containerized with Docker.

10. AI-Powered Portfolio Website (Live on Vercel):
- Production Next.js / TypeScript web application featuring a context-aware AI assistant (Prompt & Context Engineering with Gemini API, modular single-source-of-truth architecture).
========================================================================
`;

