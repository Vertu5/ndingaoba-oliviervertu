# ⚡ NDINGA OBA Olivier Vertu — Personal Portfolio & Interactive Hub

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Ingénieur civil en informatique (ULB, Distinction) · Bachelier de l'École Royale Militaire (ERM) · Software Developer & Ingénieur IA · Candidat au Management de Projets Techniques**

---

## 🎯 Aperçu du Projet

Ce dépôt contient le code source du site web et portfolio interactif de **NDINGA OBA Olivier Vertu**. Conçu avec les technologies web les plus récentes (**Next.js 16 App Router**, **React 19**, **TypeScript** et **Tailwind CSS 4**), ce site adopte une esthétique sombre moderniste (*glassmorphism*, typographie d'ingénierie et micro-animations fluides).

### 🌟 Fonctionnalités Clés

- **⚡ Présentation Synthétique & Vue Dépliable** : Résumé exécutif en 4 piliers au premier écran (lisible sans scroller sur mobile), et bouton d'expansion *"Voir le parcours complet"* pour accéder aux détails académiques (ERM, ULB / IRIDIA) et aux **7 certifications vérifiées** (Google AI, IBM Data Eng, RL, Agile Management).
- **🌍 Support Bilingue Natif (FR / EN)** : Commutateur de langue dynamique en temps réel sur l'ensemble de la plateforme.
- **🤖 Assistant IA Intégré (`/api/chat`)** : Agent conversationnel personnalisé basé sur RAG capable de répondre aux questions des recruteurs sur le parcours, la philosophie (Nietzsche & Charles Pépin) et les compétences techniques d'Olivier.
- **🔍 Hub Interactif des Domaines** : Exploration modulaire des projets logicielles, démos interactives et papiers de recherche.
- **📱 Ultra-Responsive & Accessibilité** : Grille 2x2 optimisée pour smartphone sans césure arbitraire de mots, lightbox photo HD cliquable et navigation fluide avec rembobinage (*Scroll to Top*).
- **✉️ Formulaire de Contact Sécurisé (`/api/contact`)** : API Serverless de prise de contact directe.

---

## 🛠️ Stack Technique

| Domaine | Technologie |
| :--- | :--- |
| **Framework Web** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Langage** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI & Styling** | Vanilla CSS Tokens & [Tailwind CSS 4](https://tailwindcss.com/) (Dark Mode Glassmorphism) |
| **Intelligence Artificielle** | API Chat Router / Stream IA |
| **Gestionnaire de Paquets** | `npm` (Node.js >= 20.9.0) |
| **Hébergement & CI/CD** | Vercel / GitHub Actions |

---

## 📂 Architecture du Codebase

```text
ndingaoba-oliviervertu/
├── app/
│   ├── api/
│   │   ├── chat/           # Route API pour l'Assistant IA
│   │   └── contact/        # Route API pour le formulaire de contact
│   ├── components/
│   │   ├── BioView.tsx     # Vue détaillée de la Bio & Certifications
│   │   ├── ContactView.tsx # Formulaire de contact interactif
│   │   ├── Hub.tsx         # Hub principal et navigation modulaire
│   │   ├── InterestsView.tsx # 5 Piliers d'intérêts (Philomathie, Sport, Créativité, Cuisine, Sérénité)
│   │   └── SectionChat.tsx # Widget de Chat Assistant IA
│   ├── lib/
│   │   ├── bio.ts          # Données du parcours narratif et certifications
│   │   ├── categories.ts   # Structure des catégories et diplômes
│   │   └── interests.ts    # Définitions des piliers de passions & vision
│   ├── layout.tsx          # Layout racine, Fonts & Métadonnées SEO
│   ├── page.tsx            # Page d'accueil principale
│   └── globals.css         # Design system CSS & variables de thèmes
├── public/
│   └── images/             # Actifs visuels (profile.jpeg, etc.)
└── README.md
```

---

## 🚀 Installation & Lancement Local

### Prérequis

- **Node.js** >= `20.9.0` (Recommandé : Node `v20.20.2`)
- **npm** >= `10.0.0`

### Guide Pas à Pas

1. **Cloner le dépôt Git :**
   ```bash
   git clone https://github.com/Vertu5/ndingaoba-oliviervertu.git
   cd ndingaoba-oliviervertu
   ```

2. **Utiliser la bonne version de Node (via NVM) :**
   ```bash
   source ~/.nvm/nvm.sh && nvm use 20
   ```

3. **Installer les dépendances :**
   ```bash
   npm install
   ```

4. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour visualiser le site.

5. **Compiler pour la production :**
   ```bash
   npm run build
   ```

---

## 👤 Auteur

**NDINGA OBA Olivier Vertu**  
*Ingénieur civil en informatique · Bruxelles, Belgique*

- **GitHub** : [@Vertu5](https://github.com/Vertu5)
- **LinkedIn** : [NDINGA OBA Olivier Vertu]([https://www.linkedin.com/in/olivier-vertu-ndinga-oba](https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/))
- **Diplômes** : ULB (Master Ingénieur Civil Informatique - Distinction) & ERM (Bachelier Polytechnique)

---

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE).
