"use client";

import { useState } from "react";
import { useLang } from "@/app/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string };

export default function SectionChat({ sectionId }: { sectionId: string }) {
  const { lang, t } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, lang, messages: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setError(t.chatDisabled);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-md border border-[var(--border)] bg-[var(--bg)]/60 p-4">
      <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
        {t.chatTitle}
      </p>

      <div className="mt-3 max-h-72 space-y-3 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">{t.chatEmpty}</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm ${m.role === "user" ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}
          >
            <span className="font-mono mr-2 text-[10px] tracking-[0.1em] text-[var(--accent)]">
              {m.role === "user" ? ">" : "AI"}
            </span>
            {m.content}
          </div>
        ))}
        {loading && (
          <p className="font-mono text-sm text-[var(--accent)]">{t.chatThinking}</p>
        )}
        {error && (
          <p className="text-sm text-[var(--text-muted)]">{error}</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t.chatPlaceholder}
          className="flex-1 rounded border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
        />
        <button
          onClick={send}
          disabled={loading}
          className="font-mono rounded border border-[var(--border)] px-3 py-2 text-xs tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:opacity-40"
        >
          {t.chatSend}
        </button>
      </div>
    </div>
  );
}
