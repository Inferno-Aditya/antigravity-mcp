"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { animate, createTimeline, stagger } from "animejs";
import { Sparkles, Terminal, ArrowRight, Cpu, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";

const codeSnippet = `// Autonomous Agent Protocol - Antigravity Core
import { Supervisor, AgentPool } from "@antigravity/core";

export async function initializeEcosystem() {
  const supervisor = new Supervisor({
    orchestrator: "Antigravity-v3",
    concurrency: 16,
    logLevel: "TRACE",
  });

  const agents = await AgentPool.spawn([
    { role: "Architect", engine: "Gemini-3.6-Pro" },
    { role: "WebSynthesizer", engine: "Framer-Engine" },
    { role: "SecurityAuditor", engine: "Veritas-v2" }
  ]);

  return supervisor.execute(agents);
}`;

export const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCodeLine, setActiveCodeLine] = useState(0);

  useEffect(() => {
    // Anime.js v4 staggered text reveal on load
    try {
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".anime-word");
        const tl = createTimeline({ defaults: { ease: "outExpo" } });
        
        tl.add(".anime-badge", {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          delay: 200,
        })
        .add(words, {
          opacity: [0, 1],
          translateY: [35, 0],
          delay: stagger(80),
          duration: 900,
        }, "-=300")
        .add(".anime-subtitle", {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 700,
        }, "-=500")
        .add(".anime-cta", {
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 600,
        }, "-=400");
      }
    } catch (e) {
      console.error("Anime.js timeline error:", e);
    }

    // Code line highlights animation loop
    const interval = setInterval(() => {
      setActiveCodeLine((prev) => (prev + 1) % 15);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const titleWords = ["Architecting", "High-Performance", "Autonomous", "AI", "Systems", "&", "Interactive", "Web", "Experiences."];

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Glow Orbs background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Staggered Animated Text & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Top Badge */}
            <div className="anime-badge opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-dark/80 border border-teal-500/30 text-teal-accent text-xs font-mono mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gold-accent animate-spin" style={{ animationDuration: '4s' }} />
              <span>Full-Stack Engineer & AI Architect</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-accent" />
              <span className="text-muted">v2026.4</span>
            </div>

            {/* Main Headline with Anime.js Target Spans */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-offwhite leading-[1.15] mb-6"
            >
              {titleWords.map((word, i) => {
                const isAccentGold = word === "Autonomous" || word === "AI";
                const isAccentTeal = word === "Interactive" || word === "Experiences.";
                return (
                  <span
                    key={i}
                    className={`anime-word opacity-0 inline-block mr-3 ${
                      isAccentGold
                        ? "gradient-text-gold drop-shadow-[0_0_15px_rgba(244,208,63,0.3)]"
                        : isAccentTeal
                        ? "gradient-text-teal drop-shadow-[0_0_15px_rgba(0,168,150,0.3)]"
                        : ""
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </h1>

            {/* Subtitle */}
            <p className="anime-subtitle opacity-0 text-lg sm:text-xl text-muted font-sans font-light leading-relaxed max-w-2xl mb-8">
              I design and build resilient web applications, intelligent multi-agent CLI systems, and custom UI micro-interactions using modern web standards.
            </p>

            {/* CTAs */}
            <div className="anime-cta opacity-0 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(244, 208, 63, 0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-accent to-amber-400 text-midnight font-bold text-base shadow-xl flex items-center justify-center gap-3 font-sans transition-all"
              >
                <span>View Portfolio Projects</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>

              <motion.a
                href="#terminal"
                whileHover={{ scale: 1.04, borderColor: "rgba(0, 168, 150, 0.8)" }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-dark/70 border border-teal-500/30 text-offwhite hover:text-teal-accent font-semibold text-base backdrop-blur-md flex items-center justify-center gap-2 font-mono transition-all"
              >
                <Terminal className="w-4 h-4 text-teal-accent" />
                <span>Launch Interactive CLI</span>
              </motion.a>
            </div>

            {/* Quick Metrics Pills */}
            <div className="mt-12 pt-8 border-t border-slate-light/30 grid grid-cols-3 gap-6 w-full max-w-xl">
              <div>
                <div className="text-2xl font-bold font-mono text-gold-accent">5+</div>
                <div className="text-xs text-muted font-sans">Years Building</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-teal-accent">35+</div>
                <div className="text-xs text-muted font-sans">Shipped Apps</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-offwhite">99.9%</div>
                <div className="text-xs text-muted font-sans">System Uptime</div>
              </div>
            </div>

          </div>

          {/* Right Column: Framer Motion Interactive IDE Preview Window */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: 15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative group"
            >
              {/* Card Ambient Border Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-gold-accent rounded-2xl blur-lg opacity-30 group-hover:opacity-70 transition duration-500" />

              {/* IDE Window Box */}
              <div className="relative rounded-2xl bg-slate-card/90 border border-teal-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
                
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-dark/90 border-b border-teal-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-muted flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-teal-accent" />
                      antigravity-core.ts
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs font-mono text-muted hover:text-gold-accent transition-colors flex items-center gap-1 bg-slate-light/30 px-2.5 py-1 rounded-md"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-accent" />
                        Copied!
                      </>
                    ) : (
                      "Copy"
                    )}
                  </button>
                </div>

                {/* Code Content View */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300">
                  <pre>
                    <code>
                      {codeSnippet.split("\n").map((line, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-4 px-2 py-0.5 rounded transition-colors ${
                            idx === activeCodeLine ? "bg-teal-500/10 border-l-2 border-teal-accent text-offwhite" : ""
                          }`}
                        >
                          <span className="text-muted/40 select-none w-5 text-right">{idx + 1}</span>
                          <span className="flex-1">
                            {line.startsWith("//") ? (
                              <span className="text-muted/70 italic">{line}</span>
                            ) : line.includes("import") || line.includes("export") || line.includes("await") || line.includes("return") || line.includes("const") ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: line
                                    .replace(/(import|export|async|function|const|return|await|new)/g, '<span class="text-teal-accent font-semibold">$1</span>')
                                    .replace(/(Supervisor|AgentPool)/g, '<span class="text-gold-accent font-semibold">$1</span>')
                                    .replace(/("[^"]*")/g, '<span class="text-emerald-300">$1</span>')
                                }}
                              />
                            ) : (
                              <span>{line}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Floating Status Badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-slate-dark border border-gold-accent/40 shadow-xl backdrop-blur-lg flex items-center gap-2 text-xs font-mono text-gold-accent"
                >
                  <Zap className="w-4 h-4 text-gold-accent" />
                  <span>Sub-10ms Latency Engine</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-slate-dark border border-teal-500/40 shadow-xl backdrop-blur-lg flex items-center gap-2 text-xs font-mono text-teal-accent"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-accent" />
                  <span>Subagent Protocols Active</span>
                </motion.div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
