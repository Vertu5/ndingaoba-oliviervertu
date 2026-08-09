import { NextRequest, NextResponse } from "next/server";
import { bio, interests, contact } from "@/app/lib/categories";
import { superDomains } from "@/app/lib/superdomains";
import { domains } from "@/app/lib/domains";
import { content } from "@/app/lib/content";

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
Domaines d'expertise : Intelligence Artificielle, Machine Learning, Robotique en Essaim, Data Engineering, Conception de Systèmes (System Design), Développement Backend/Frontend.
Contact :
- Email : obavertu@gmail.com
- Téléphone / WhatsApp : +32 497 21 21 37
- LinkedIn : https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/
- GitHub : https://github.com/Vertu5
-------------------------------` : `
--- OLIVIER'S GLOBAL PROFILE ---
Identity: NDINGA OBA Olivier Vertu
Education: Computer Science Engineer (ULB & ERM), with strong leadership background.
Certifications: Google AI, IBM Data Engineering, Reinforcement Learning, Git/GitHub, etc.
Expertise: Artificial Intelligence, Machine Learning, Swarm Robotics, Data Engineering, System Design, Backend/Frontend Development.
Contact:
- Email: obavertu@gmail.com
- Phone / WhatsApp: +32 497 21 21 37
- LinkedIn: https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/
- GitHub: https://github.com/Vertu5
--------------------------------`;

  const systemPrompt =
    lang === "fr"
      ? `${globalProfile}\n\nTu es l'assistant du site personnel de NDINGA OBA Olivier Vertu. Le visiteur se trouve actuellement dans la section ou le projet : "${ctx}".\nRéponds de façon précise, concise et chaleureuse à ses questions. Tu as accès au profil global ci-dessus, et aux détails spécifiques ci-dessous s'il y en a. Si tu ne connais pas une information précise non listée ici, dis-le honnêtement au lieu d'inventer.${projectsCtx}`
      : `${globalProfile}\n\nYou are the assistant for NDINGA OBA Olivier Vertu's personal site. The visitor is currently in the section or project: "${ctx}".\nAnswer visitor questions precisely, concisely, and warmly. You have access to the global profile above, and specific details below if any. If you don't know a specific fact not listed here, say so honestly rather than inventing it.${projectsCtx}`;

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
