"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Award, Code2, Sparkles, CheckCircle2, ChevronRight, Cpu } from "lucide-react";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  techUsed: string[];
  accent: "teal" | "gold";
}

const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Lead Full-Stack Architect",
    company: "Antigravity Labs",
    period: "2024 — PRESENT",
    location: "Remote / San Francisco",
    description: "Orchestrating next-generation web architectures and autonomous AI subagent CLI workflows.",
    achievements: [
      "Designed and deployed multi-agent CLI supervisor infrastructure handling 100+ concurrent background tasks.",
      "Accelerated Next.js App Router render speeds by 65% with custom server component streaming and caching.",
      "Mentored a team of 8 engineers on Framer Motion animation patterns and web accessibility standards."
    ],
    techUsed: ["Next.js", "TypeScript", "Python", "Tailwind CSS", "Docker", "Subagents"],
    accent: "gold",
  },
  {
    id: "exp-2",
    role: "Senior Systems & Web Engineer",
    company: "NeuralMesh Systems",
    period: "2022 — 2024",
    location: "Austin, TX",
    description: "Built high-throughput distributed telemetry dashboards and WebGL data visualizers.",
    achievements: [
      "Engineered real-time canvas visualizer rendering 50,000+ spatial data nodes at 60 FPS.",
      "Reduced bundle size by 40% using dynamic code splitting and tree-shaking optimizations.",
      "Spearheaded adoption of TypeScript strict mode across 15 enterprise repositories."
    ],
    techUsed: ["React", "TypeScript", "D3.js", "Three.js", "WebSockets", "Node.js"],
    accent: "teal",
  },
  {
    id: "exp-3",
    role: "Creative UI Engineer",
    company: "Synthetix Digital Agency",
    period: "2020 — 2022",
    location: "New York, NY",
    description: "Crafted interactive web experiences, micro-interactions, and custom design systems for global client brands.",
    achievements: [
      "Built awards-winning interactive marketing websites using Anime.js and WebGL shaders.",
      "Created reusable design component token library adopted by 30+ client projects.",
      "Integrated GraphQL APIs for seamless headless CMS content hydration."
    ],
    techUsed: ["JavaScript (ES6+)", "Anime.js", "GSAP", "Tailwind CSS", "GraphQL"],
    accent: "gold",
  },
];

const skillCategories = [
  {
    name: "Frontend & UI Engineering",
    skills: [
      { name: "Next.js 15 (App Router)", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS & Styling", level: 98 },
      { name: "Framer Motion & Micro-interactions", level: 94 },
      { name: "Anime.js & Canvas/WebGL", level: 88 },
    ],
  },
  {
    name: "AI & Backend Architecture",
    skills: [
      { name: "Python (FastAPI / AI SDKs)", level: 90 },
      { name: "Multi-Agent Protocols & CLI Tools", level: 95 },
      { name: "Node.js & Microservices", level: 89 },
      { name: "PostgreSQL & Redis Caching", level: 86 },
      { name: "WebSockets & Event Streams", level: 92 },
    ],
  },
];

export const ExperienceSection: React.FC = () => {
  const [activeSkillTab, setActiveSkillTab] = useState<number>(0);

  return (
    <section id="experience" className="py-24 relative z-10 bg-slate-dark/30 border-t border-teal-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-dark border border-teal-500/30 text-teal-accent text-xs font-mono mb-4"
          >
            <Briefcase className="w-3.5 h-3.5 text-gold-accent" />
            <span>CAREER PATH & SKILLS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-offwhite tracking-tight mb-4"
          >
            Experience & <span className="gradient-text-gold">Technical Mastery</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted font-sans text-base sm:text-lg max-w-2xl"
          >
            A timeline of key engineering roles, impactful products delivered, and deep technical competencies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold font-sans text-offwhite mb-8 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-accent" />
              <span>Professional Journey</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/30 space-y-10">
              {experiences.map((exp, idx) => {
                const isGold = exp.accent === "gold";
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="relative group"
                  >
                    {/* Glowing Line Node */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-midnight transition-colors ${
                        isGold ? "border-gold-accent group-hover:bg-gold-accent" : "border-teal-accent group-hover:bg-teal-accent"
                      }`}
                    />

                    {/* Timeline Card */}
                    <div className="rounded-2xl bg-slate-card/80 border border-teal-500/20 p-6 backdrop-blur-xl group-hover:border-gold-accent/40 transition-colors shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-gold-accent bg-slate-dark px-3 py-1 rounded-full border border-gold-accent/20">
                          {exp.period}
                        </span>
                        <span className="text-xs font-mono text-muted flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold font-sans text-offwhite group-hover:text-gold-accent transition-colors">
                        {exp.role}
                      </h4>
                      <div className="text-sm font-sans text-teal-accent font-semibold mb-4">
                        {exp.company}
                      </div>

                      <p className="text-sm text-muted font-sans mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      <ul className="space-y-2 mb-5 text-xs sm:text-sm text-slate-300">
                        {exp.achievements.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-teal-accent mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-light/20">
                        {exp.techUsed.map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono text-slate-300 bg-slate-dark border border-slate-light/40 px-2.5 py-0.5 rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Skill Proficiency Matrix */}
          <div className="lg:col-span-5">
            <h3 className="text-xl font-bold font-sans text-offwhite mb-8 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-accent" />
              <span>Skill Matrix</span>
            </h3>

            {/* Category Toggle Tabs */}
            <div className="flex gap-2 p-1 bg-slate-dark rounded-xl border border-teal-500/20 mb-6">
              {skillCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSkillTab(idx)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                    activeSkillTab === idx
                      ? "bg-teal-accent text-midnight font-bold shadow-md"
                      : "text-muted hover:text-offwhite"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Skills Progress Meters */}
            <div className="rounded-2xl bg-slate-card/90 border border-teal-500/20 p-6 backdrop-blur-xl space-y-6 shadow-xl">
              {skillCategories[activeSkillTab].skills.map((skill, idx) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-offwhite font-medium">{skill.name}</span>
                    <span className="text-gold-accent font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-dark rounded-full overflow-hidden border border-teal-500/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-teal-500 to-gold-accent rounded-full shadow-[0_0_12px_rgba(0,168,150,0.5)]"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-light/20 flex items-center justify-between text-xs font-mono text-muted">
                <span className="flex items-center gap-1 text-teal-accent">
                  <Sparkles className="w-3.5 h-3.5" /> Continuously Evolving
                </span>
                <span>Updated 2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
