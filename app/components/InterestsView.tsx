"use client";

import { useState } from "react";
import { interestPillars, interestsVision } from "@/app/lib/interests";

export default function InterestsView({ lang }: { lang: "fr" | "en" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

      {/* Mode Mobile : Carousel */}
      <div className="block md:hidden">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
            {lang === "fr" ? `Pilier ${currentIndex + 1} sur ${interestPillars.length}` : `Pillar ${currentIndex + 1} of ${interestPillars.length}`}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => setCurrentIndex(prev => Math.min(interestPillars.length - 1, prev + 1))}
              disabled={currentIndex === interestPillars.length - 1}
              className="p-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex flex-col gap-2.5 mb-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] shrink-0">
                  {interestPillars[currentIndex].icon}
                </span>
                <h3 className="font-display text-base font-medium text-[var(--text)] leading-snug">
                  {interestPillars[currentIndex].title[lang]}
                </h3>
              </div>
              <span className="font-mono text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-1 rounded-full self-start max-w-full break-words">
                {interestPillars[currentIndex].badge[lang]}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-justify text-[var(--text-muted)] mt-2">
              {interestPillars[currentIndex].text[lang]}
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-dashed border-[var(--border)] flex flex-wrap gap-1.5 font-mono text-[10px]">
            {interestPillars[currentIndex].tags.map((tag, idx) => (
              <span key={idx} className="rounded bg-[var(--bg)] border border-[var(--border)] px-2 py-0.5 text-[var(--text-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Desktop : Grid des 5 Piliers */}
      <div className="hidden md:grid grid-cols-2 gap-5">
        {interestPillars.map((pillar) => (
          <div
            key={pillar.id}
            className="group rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-6 flex flex-col justify-between transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--bg-elevated)] shadow-sm"
          >
            <div>
              {/* Header card : Icon + Title + Badge */}
              <div className="flex items-start justify-between gap-2.5 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] shrink-0">
                    {pillar.icon}
                  </span>
                  <h3 className="font-display text-base font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors break-words leading-snug">
                    {pillar.title[lang]}
                  </h3>
                </div>
                <span className="font-mono text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-1 rounded-full self-start shrink-0 max-w-full break-words">
                  {pillar.badge[lang]}
                </span>
              </div>

              {/* Body text */}
              <p className="text-sm leading-relaxed text-justify text-[var(--text-muted)] mt-2">
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
