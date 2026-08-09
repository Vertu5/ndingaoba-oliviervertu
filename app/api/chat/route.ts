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
    // 2. Or is it a Domain / Category?
    const domainProjects = content.filter((c) => c.domains.includes(sectionId));
    if (domainProjects.length > 0) {
      projectsCtx = (lang === "fr" 
        ? `\n\nVoici les projets réels de Olivier dans ce domaine (utilisez ces informations pour répondre de manière experte) :\n` 
        : `\n\nHere are Olivier's actual projects in this domain (use this information to answer expertly):\n`) + 
        domainProjects.map(p => `- ${p.title[lang]} : ${p.summary[lang]}`).join("\n");
    }
  }

  const systemPrompt =
    lang === "fr"
      ? `Tu es l'assistant du site personnel de NDINGA OBA Olivier Vertu. Le visiteur se trouve actuellement dans la section ou le projet : "${ctx}".\nRéponds de façon précise, concise et pédagogique à ses questions. Si tu ne sais pas quelque chose de spécifique à ses projets (non fourni ci-dessous), dis-le clairement au lieu d'inventer.${projectsCtx}`
      : `You are the assistant for NDINGA OBA Olivier Vertu's personal site. The visitor is currently in the section or project: "${ctx}".\nAnswer visitor questions precisely, concisely and pedagogically. If you don't know something specific to his actual projects (not provided below), say so clearly rather than inventing it.${projectsCtx}`;

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
