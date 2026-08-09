import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { LangProvider } from "@/app/lib/i18n";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import "katex/dist/katex.min.css";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ndingaoba-oliviervertu.vercel.app'),
  title: "Olivier Vertu NDINGA OBA | Software Developer",
  description: "Based in Brussels, I am seeking challenging opportunities as a Software Developer, aiming to grow into Project Management.",
  keywords: ["Ingénieur", "Informatique", "Data Engineer", "Machine Learning", "Software Engineer", "ULB", "Bruxelles", "Portfolio", "Supabase", "React", "Next.js"],
  authors: [{ name: "Olivier Vertu NDINGA OBA" }],
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: "https://ndingaoba-oliviervertu.vercel.app/",
    title: "Olivier Vertu NDINGA OBA | Software Developer",
    description: "Based in Brussels, I am seeking challenging opportunities as a Software Developer, aiming to grow into Project Management.",
    siteName: "Portfolio Olivier Vertu",
    images: [
      {
        url: "/images/profile.jpeg",
        width: 800,
        height: 600,
        alt: "Olivier Vertu NDINGA OBA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olivier Vertu NDINGA OBA | Software Developer",
    description: "Based in Brussels, I am seeking challenging opportunities as a Software Developer, aiming to grow into Project Management.",
    images: ["/images/profile.jpeg"],
  },
  verification: {
    google: "mutYfMpiqnP6rcfyCIJ45ctwCratCIFYZo1GHn4yye0",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light">
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
