import { NextRequest, NextResponse } from "next/server";
import { bio, interests, contact } from "@/app/lib/categories";
import { superDomains } from "@/app/lib/superdomains";
import { domains } from "@/app/lib/domains";
import { content } from "@/app/lib/content";
import { globalKnowledgeFR, globalKnowledgeEN, projectDetailsFR, projectDetailsEN } from "@/app/lib/deepKnowledge";

export const maxDuration = 30;

type IncomingMsg = { role: "user" | "assistant"; content: string };
type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

// Ordered from lowest-latency stable Flash-Lite (observed <3s) to higher-tier Flash fallbacks
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.6-flash",
  "gemini-4-hydrogen",
  "gemini-3.8-flash",
] as const;

const RETRYABLE_STATUSES = new Set([404, 408, 429, 500, 502, 503, 504]);
const PER_ATTEMPT_TIMEOUT_MS = 8000;
const TOTAL_DEADLINE_MS = 24000;

async function callGeminiWithFallback(
  apiKey: string,
  systemPrompt: string,
  contents: GeminiContent[]
): Promise<{ reply: string; model: string } | { error: string; status: number }> {
  const deadline = Date.now() + TOTAL_DEADLINE_MS;
  let lastError = "Gemini service unavailable";
  let lastStatus = 502;

  for (const model of GEMINI_MODELS) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 1000) break;

    const timeoutMs = Math.min(PER_ATTEMPT_TIMEOUT_MS, remainingMs);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents,
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text();
        lastError = `Erreur API Gemini (${model}, ${res.status}): ${errBody}`;
        lastStatus = res.status === 429 ? 429 : 502;
        if (RETRYABLE_STATUSES.has(res.status)) continue;
        return { error: lastError, status: lastStatus };
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const reply =
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("\n")
          .trim() ?? "";

      if (reply) {
        return { reply, model };
      }
      lastError = `Réponse vide du modèle ${model}`;
      lastStatus = 502;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Erreur réseau Gemini";
      lastStatus = 504;
    }
  }

  return { error: lastError, status: lastStatus };
}

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
      fr: `${c.label.fr} - ${c.description.fr}`,
      en: `${c.label.en} - ${c.description.en}`,
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

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages manquants." }, { status: 400 });
  }

  let ctx = sectionContext[sectionId]?.[lang] ?? "";
  let projectsCtx = "";

  const isProjectOrDomain = sectionId !== "global" && sectionId !== "bio" && sectionId !== "contact" && sectionId !== "interets";

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

  // Inject deep mathematical project details ONLY if we are exploring a project or domain
  if (isProjectOrDomain) {
    projectsCtx += "\n\n" + (lang === "fr" ? projectDetailsFR : projectDetailsEN);
  }

  const globalProfile = lang === "fr" ? `
--- PROFIL GLOBAL D'OLIVIER ---
Identité : Ir. Olivier NDINGA OBA (Olivier Vertu)
Formation principale : Master de spécialisation en gestion industrielle et technologique (Solvay Brussels School - ULB, 2026 - en cours), Ingénieur civil en informatique (ULB, Distinction) & Bachelier ERM (leadership).
Certifications : Google AI Professional, IBM Data Engineering, DeepLearning.AI LLMs (en cours), Reinforcement Learning, SQL Server, Docker/Kubernetes.
Domaines d'expertise : Data & AI End-to-End, Databricks (Medallion, Unity Catalog, MLflow), GenAI (LLMs, RAG, Text-to-SQL), Python, R, C/C++, SQL, Machine Learning & Deep Learning, Robotique en Essaim (TDA).
Contact : Pour contacter Olivier, il faut se rendre dans la section "Contact" du site.
-------------------------------

${globalKnowledgeFR}` : `
--- OLIVIER'S GLOBAL PROFILE ---
Identity: Ir. Olivier NDINGA OBA (Olivier Vertu)
Education: Specialized Master in Industrial and Technological Management (Solvay Brussels School - ULB, 2026 - present), Civil Engineer, MSc Computer Science & Engineering (ULB, Distinction) & BSc RMA (leadership).
Certifications: Google AI Professional, IBM Data Engineering, DeepLearning.AI LLMs (in progress), Reinforcement Learning, SQL Server, Docker/Kubernetes.
Expertise: End-to-End Data & AI, Databricks (Medallion, Unity Catalog, MLflow), GenAI (LLMs, RAG, Text-to-SQL), Python, R, C/C++, SQL, Machine Learning & Deep Learning, Swarm Robotics (TDA).
Contact: To contact Olivier, you must go to the "Contact" section of the site.
--------------------------------

${globalKnowledgeEN}`;

  const systemPrompt =
    lang === "fr"
      ? `${globalProfile}\n\nTu es l'assistant IA ultra-expert et chaleureux du site personnel d'Olivier NDINGA OBA. Le visiteur se trouve actuellement dans la section ou le projet : "${ctx || "Accueil"}".\nRéponds de façon experte, précise et fluide. Tu as accès à la DEEP KNOWLEDGE BASE ci-dessus (contenant le CV détaillé, les détails techniques de ses projets, ses compétences). Sers-toi de cette base pour répondre aux questions techniques pointues ou aux questions sur son parcours, sans jamais rien inventer.${projectsCtx}`
      : `${globalProfile}\n\nYou are the ultra-expert and warm AI assistant for Olivier NDINGA OBA's personal site. The visitor is currently in the section or project: "${ctx || "Home"}".\nAnswer expertly, precisely, and fluidly. You have access to the DEEP KNOWLEDGE BASE above (containing the detailed CV, project technical details, skills). Use this base to answer complex technical questions or questions about his background, without ever inventing anything.${projectsCtx}`;

  try {
    const normalizedContents: GeminiContent[] = [];
    for (const m of messages.slice(-20)) {
      const contentText = typeof m?.content === "string" ? m.content.trim() : "";
      if (!contentText) continue;
      const role = m.role === "assistant" ? "model" : "user";
      if (normalizedContents.length > 0 && normalizedContents[normalizedContents.length - 1].role === role) {
        normalizedContents[normalizedContents.length - 1].parts[0].text += "\n\n" + contentText;
      } else {
        normalizedContents.push({ role, parts: [{ text: contentText }] });
      }
    }

    if (normalizedContents.length === 0) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    const result = await callGeminiWithFallback(apiKey, systemPrompt, normalizedContents);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ reply: result.reply, model: result.model });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
