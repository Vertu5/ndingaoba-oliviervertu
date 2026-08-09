# ⚡ Olivier Vertu NDINGA OBA — Personal Portfolio & Interactive Hub

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Computer Science Engineer (ULB, Distinction) · Royal Military Academy Bachelor (RMA) · Software Developer · Aspiring Project Manager**

---

## 🎯 Project Overview

This repository contains the source code for the interactive portfolio and website of **Olivier Vertu NDINGA OBA**. Built with modern web technologies (**Next.js 16 App Router**, **React 19**, **TypeScript**, and **Tailwind CSS 4**), this site features a sleek dark mode, modernist glassmorphism aesthetics, engineering-grade typography, and fluid micro-animations.

### 🌟 Key Features

- **⚡ Synthetic Presentation & Expandable Views**: A 4-pillar executive summary right on the first screen (readable without scrolling on mobile), and an "Explore full background" expansion button to access academic details (RMA, ULB / IRIDIA) and **7 verified certifications** (Google AI, IBM Data Eng, RL, Agile Management).
- **🌍 Native Bilingual Support (EN / FR)**: Real-time dynamic language toggling across the entire platform.
- **🤖 Integrated AI Assistant (`/api/chat`)**: A custom RAG-based conversational agent capable of answering recruiters' questions regarding Olivier's background, philosophy (Nietzsche & Charles Pépin), and technical skills.
- **🔍 Interactive Domains Hub**: Modular exploration of software engineering projects, interactive demos, and research papers.
- **📱 Ultra-Responsive & Accessible**: A 2x2 grid optimized for smartphones, HD clickable photo lightboxes, and smooth navigation.
- **✉️ Secure Contact Form (`/api/contact`)**: Serverless API for direct contact.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Web Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI & Styling** | Vanilla CSS Tokens & [Tailwind CSS 4](https://tailwindcss.com/) (Dark Mode Glassmorphism) |
| **Artificial Intelligence** | API Chat Router / Stream AI |
| **Package Manager** | `npm` (Node.js >= 20.9.0) |
| **Hosting & CI/CD** | Vercel / GitHub Actions |

---

## 📂 Codebase Architecture

```text
ndingaoba-oliviervertu/
├── app/
│   ├── api/
│   │   ├── chat/           # AI Assistant API route
│   │   └── contact/        # Contact form API route
│   ├── components/
│   │   ├── BioView.tsx     # Detailed Bio & Certifications View
│   │   ├── ContactView.tsx # Interactive contact form
│   │   ├── Hub.tsx         # Main hub and modular navigation
│   │   ├── InterestsView.tsx # 5 Interest pillars
│   │   └── SectionChat.tsx # AI Assistant Chat widget
│   ├── lib/
│   │   ├── bio.ts          # Narrative background data & certifications
│   │   ├── categories.ts   # Categories & diplomas structure
│   │   └── interests.ts    # Passions & vision definitions
│   ├── layout.tsx          # Root layout, Fonts & SEO Metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # CSS Design system & theme variables
├── public/
│   └── images/             # Visual assets (profile.jpeg, etc.)
└── README.md
```

---

## 🚀 Installation & Local Setup

### Prerequisites

- **Node.js** >= `20.9.0` (Recommended: Node `v20.20.2`)
- **npm** >= `10.0.0`

### Step-by-Step Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vertu5/ndingaoba-oliviervertu.git
   cd ndingaoba-oliviervertu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👤 Author

**Olivier Vertu NDINGA OBA**  
*Software Developer & Computer Science Engineer · Brussels, Belgium*

- **GitHub** : [@Vertu5](https://github.com/Vertu5)
- **LinkedIn** : [Olivier Vertu NDINGA OBA](https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/)
- **Degrees** : ULB (MSc Computer Science Engineering - Distinction) & RMA (BSc Engineering Sciences)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
