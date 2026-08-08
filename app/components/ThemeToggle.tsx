"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="font-mono rounded border border-transparent px-3 py-1.5 text-[var(--text-muted)] opacity-0">
        <Moon size={14} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="font-mono flex items-center justify-center rounded border border-[var(--border)] px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
