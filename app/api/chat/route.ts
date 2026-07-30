import { NextRequest, NextResponse } from "next/server";
import { categories } from "@/app/lib/categories";

export const runtime = "nodejs";

type IncomingMsg = { role: "user" | "assistant"; content: string };

const sectionContext: Record<string, { fr: string; en: string }> = Object.fromEntries(
  categories.map((c) => [
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

  const ctx = sectionContext[sectionId]?.[lang] ?? "";
  const systemPrompt =
    lang === "fr"
      ? `Tu es l'assistant du site personnel de NDINGA OBA Olivier-Vertu, section "${ctx}". Réponds de façon précise, concise et pédagogique aux questions du visiteur sur ce domaine. Si tu ne sais pas quelque chose de spécifique à ses projets réels (non fourni ici), dis-le clairement plutôt que d'inventer.`
      : `You are the assistant for NDINGA OBA Olivier-Vertu's personal site, section "${ctx}". Answer visitor questions about this domain precisely, concisely and pedagogically. If you don't know something specific to his actual projects (not provided here), say so clearly rather than inventing it.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
