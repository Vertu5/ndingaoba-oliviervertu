"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/app/lib/i18n";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

export default function SectionChat({ sectionId }: { sectionId: string }) {
  const { lang, t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${
            isOpen 
              ? "bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rotate-90 hover:bg-[var(--border)]" 
              : "bg-[var(--accent)] text-white hover:scale-110 shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"
          }`}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-[90] w-[calc(100vw-3rem)] sm:w-[400px] h-[550px] max-h-[75vh] flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl overflow-hidden backdrop-blur-3xl bg-opacity-95"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg)]/80">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                <h3 className="font-mono text-sm tracking-[0.1em] text-[var(--text)] font-semibold">
                  {t.chatTitle}
                </h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-[var(--bg)] to-[var(--bg-secondary)]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 px-4">
                  <MessageSquare size={48} className="text-[var(--text-muted)] opacity-50" />
                  <p className="text-sm text-[var(--text-muted)] max-w-[250px] leading-relaxed">
                    {t.chatEmpty}
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] ${
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div 
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === "user" 
                        ? "bg-[var(--accent)] text-white rounded-br-sm" 
                        : "bg-[var(--border)]/30 text-[var(--text)] rounded-bl-sm border border-[var(--border)]"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p>{m.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start mr-auto max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--border)]/30 border border-[var(--border)] flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                    <span className="font-mono text-xs text-[var(--text-muted)]">{t.chatThinking}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/20 shadow-sm font-medium">
                    {error}
                  </span>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[var(--bg)] border-t border-[var(--border)]/50">
              <div className="flex relative items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t.chatPlaceholder}
                  disabled={loading}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all disabled:opacity-50"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 p-2 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--accent)]"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
