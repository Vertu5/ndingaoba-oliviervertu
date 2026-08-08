"use client";

import { interestPillars, interestsVision } from "@/app/lib/interests";

export default function InterestsView({ lang }: { lang: "fr" | "en" }) {
  return (
    <div className="mt-6 space-y-8">
      {/* Header Vision */}
      <div className="rounded-xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg-elevated)]/70 to-[var(--bg)] p-6 md:p-8">
        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-xs font-semibold text-[var(--accent)] mb-3">
          <span>✨</span>
          <span>{interestsVision.title[lang]}</span>
        </div>
        <p className="text-sm md:text-base leading-relaxed sm:text-justify text-[var(--text)] font-medium max-w-2xl">
          {interestsVision.intro[lang]}
        </p>
      </div>

      {/* Grid des 4 Piliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {interestPillars.map((pillar) => (
          <div
            key={pillar.id}
            className="group rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--bg-elevated)] shadow-sm"
          >
            <div>
              {/* Header card : Icon + Title + Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] shrink-0 mt-0.5 sm:mt-0">
                    {pillar.icon}
                  </span>
                  <h3 className="font-display text-base font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors break-words leading-snug">
                    {pillar.title[lang]}
                  </h3>
                </div>
                <span className="font-mono text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0 max-w-full break-words">
                  {pillar.badge[lang]}
                </span>
              </div>

              {/* Body text */}
              <p className="text-xs md:text-sm leading-relaxed sm:text-justify text-[var(--text-muted)] mt-2">
                {pillar.text[lang]}
              </p>
            </div>

            {/* Tags footer */}
            <div className="mt-5 pt-3 border-t border-dashed border-[var(--border)] flex flex-wrap gap-1.5 font-mono text-[10px]">
              {pillar.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[var(--bg)] border border-[var(--border)] px-2 py-0.5 text-[var(--text-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
