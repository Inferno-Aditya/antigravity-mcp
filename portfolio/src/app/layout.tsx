import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Alex Thorne — Creative Engineer & AI Systems Architect",
  description: "Portfolio of Alex Thorne, specializing in full-stack architecture, high-performance web applications, and autonomous AI systems.",
  keywords: ["Software Engineer", "Full Stack Developer", "AI Architect", "Next.js", "TypeScript", "Framer Motion", "Anime.js", "Portfolio"],
  authors: [{ name: "Alex Thorne" }],
  openGraph: {
    title: "Alex Thorne — Creative Engineer & AI Systems Architect",
    description: "Building next-gen autonomous systems and interactive web experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-midnight text-offwhite selection:bg-teal-500/30 selection:text-gold-accent">
        {children}
      </body>
    </html>
  );
}
