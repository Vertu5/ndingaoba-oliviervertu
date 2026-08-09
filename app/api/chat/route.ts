import { NextRequest, NextResponse } from "next/server";
import { bio, interests, contact } from "@/app/lib/categories";
import { superDomains } from "@/app/lib/superdomains";
import { domains } from "@/app/lib/domains";
import { content } from "@/app/lib/content";
import { deepKnowledgeFR, deepKnowledgeEN } from "@/app/lib/deepKnowledge";

export const runtime = "nodejs";

type IncomingMsg = { role: "user" | "assistant"; content: string };

const allSections = [
  bio,
  interests,
  ...superDomains.map((s) => ({ id: s.id, label: s.label, description: s.description })),
  ...domains.map((d) => ({ id: d.id, label: d.label, description: d.description })),
  contact,
];

const sectionContext: Record<string, { fr: string; en: string }> = Object.fromEntries(
  allSections.map((c) => [
    c.id,
    {
      fr: `${c.label.fr} — ${c.description.fr}`,
      en: `${c.label.en} — ${c.description.en}`,
    },
  ])
);

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY manquante côté serveur." },
      { status: 500 }
    );
  }

  const { sectionId, lang, messages } = (await req.json()) as {
    sectionId: string;
    lang: "fr" | "en";
    messages: IncomingMsg[];
  };

  let ctx = sectionContext[sectionId]?.[lang] ?? "";
  let projectsCtx = "";

  // 1. Is it a single project?
  const singleProject = content.find(c => c.id === sectionId);
  if (singleProject) {
    ctx = singleProject.title[lang];
    projectsCtx = (lang === "fr" 
      ? `\n\nLe visiteur consulte actuellement le projet spécifique suivant. Utilisez ces détails pour répondre :\n` 
      : `\n\nThe visitor is currently viewing the following specific project. Use these details to answer:\n`) + 
      `- Résumé / Summary : ${singleProject.summary[lang]}\n` +
      (singleProject.tags ? `- Technologies / Tags : ${singleProject.tags.join(', ')}\n` : "");
  } else {
    // 2. Is it the Bio section?
    if (sectionId === "bio" && bio.documents) {
      projectsCtx = (lang === "fr" 
        ? `\n\nVoici le parcours et les documents (diplômes, certificats, lettres de recommandation) d'Olivier :\n` 
        : `\n\nHere are Olivier's background and documents (diplomas, certificates, recommendation letters):\n`) + 
        bio.documents.map(d => `- [${d.type.toUpperCase()}] ${d.title[lang]} (${d.issuer}, ${d.date}) : ${d.detail?.[lang] ?? ""}`).join("\n");
    } else if (sectionId === "contact") {
      projectsCtx = (lang === "fr" 
        ? `\n\nLe visiteur se trouve sur la page de contact. Voici les détails affichés à l'écran :\n` 
        : `\n\nThe visitor is on the contact page. Here are the details displayed on the screen:\n`) + 
        `- Email : obavertu@gmail.com (Réponse sous 24h)\n` +
        `- Téléphone / WhatsApp : +32 497 21 21 37\n` +
        `- Localisation : Bruxelles, Belgique\n` +
        `- LinkedIn : https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/\n` +
        `- GitHub : https://github.com/Vertu5\n` +
        (lang === "fr" ? `Message d'intro affiché : "Disponible pour des opportunités en Software Development, Ingénierie IA ou projets complexes."` : `Intro message displayed: "Available for Software Development, AI Engineering opportunities, or complex projects."`);
    } else {
      // 3. Or is it a Domain / Category?
      const domainProjects = content.filter((c) => c.domains.includes(sectionId));
      if (domainProjects.length > 0) {
        projectsCtx = (lang === "fr" 
          ? `\n\nVoici les projets réels de Olivier dans ce domaine (utilisez ces informations pour répondre de manière experte) :\n` 
          : `\n\nHere are Olivier's actual projects in this domain (use this information to answer expertly):\n`) + 
          domainProjects.map(p => `- ${p.title[lang]} : ${p.summary[lang]}`).join("\n");
      }
    }
  }

  const globalProfile = lang === "fr" ? `
--- PROFIL GLOBAL D'OLIVIER ---
Identité : NDINGA OBA Olivier Vertu
Formation principale : Ingénieur civil en informatique (ULB & ERM), avec un fort bagage en leadership.
Certifications : Google AI, IBM Data Engineering, Reinforcement Learning, Git/GitHub, etc.
Domaines d'expertise : C/C++, Python, PostgreSQL, Programmation Orientée Objet (POO), Structures de Données, Intelligence Artificielle, Machine Learning, Robotique en Essaim, Data Engineering, Conception de Systèmes.
Contact : Pour contacter Olivier, il faut se rendre dans la section "Contact" du site.
-------------------------------

${deepKnowledgeFR}` : `
--- OLIVIER'S GLOBAL PROFILE ---
Identity: NDINGA OBA Olivier Vertu
Education: Computer Science Engineer (ULB & ERM), with strong leadership background.
Certifications: Google AI, IBM Data Engineering, Reinforcement Learning, Git/GitHub, etc.
Expertise: C/C++, Python, PostgreSQL, Object-Oriented Programming (OOP), Data Structures, Artificial Intelligence, Machine Learning, Swarm Robotics, Data Engineering, System Design.
Contact: To contact Olivier, you must go to the "Contact" section of the site.
--------------------------------

${deepKnowledgeEN}`;

  const systemPrompt =
    lang === "fr"
      ? `${globalProfile}\n\nTu es l'assistant IA ultra-expert et chaleureux du site personnel de NDINGA OBA Olivier Vertu. Le visiteur se trouve actuellement dans la section ou le projet : "${ctx}".\nRéponds de façon experte, précise et fluide. Tu as accès à la DEEP KNOWLEDGE BASE ci-dessus (contenant le CV détaillé, les formules mathématiques de ses projets, ses compétences techniques). Sers-toi de cette base pour répondre aux questions techniques pointues ou aux questions sur son parcours, sans jamais rien inventer.${projectsCtx}`
      : `${globalProfile}\n\nYou are the ultra-expert and warm AI assistant for NDINGA OBA Olivier Vertu's personal site. The visitor is currently in the section or project: "${ctx}".\nAnswer expertly, precisely, and fluidly. You have access to the DEEP KNOWLEDGE BASE above (containing the detailed CV, mathematical formulas for his projects, technical skills). Use this base to answer complex technical questions or questions about his background, without ever inventing anything.${projectsCtx}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json(
        { error: `Erreur API Gemini (${res.status}): ${errBody}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply: string =
      data.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("\n") ?? "";

    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
