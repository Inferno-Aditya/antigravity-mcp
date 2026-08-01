'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Layout, Database, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: { name: string; level: number; highlight?: boolean }[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend Mastery',
    icon: Layout,
    skills: [
      { name: 'React 19 & Next.js 16', level: 98, highlight: true },
      { name: 'TypeScript', level: 95, highlight: true },
      { name: 'Tailwind CSS v4', level: 95 },
      { name: 'Framer Motion & Anime.js', level: 92, highlight: true },
      { name: 'State Management (Zustand/Redux)', level: 90 },
    ],
  },
  {
    title: 'Backend & Systems',
    icon: Server,
    skills: [
      { name: 'Node.js & Express', level: 94 },
      { name: 'Python & FastAPI', level: 88 },
      { name: 'REST & GraphQL APIs', level: 92 },
      { name: 'WebSockets & Real-Time Data', level: 90, highlight: true },
      { name: 'Microservices & Serverless', level: 86 },
    ],
  },
  {
    title: 'Database & Cloud',
    icon: Database,
    skills: [
      { name: 'PostgreSQL & Prisma / Drizzle', level: 92, highlight: true },
      { name: 'Redis Caching & PubSub', level: 88 },
      { name: 'Docker & Containerization', level: 85 },
      { name: 'AWS & Vercel Architecture', level: 90 },
      { name: 'CI/CD Pipelines & GitHub Actions', level: 87 },
    ],
  },
  {
    title: 'Architecture & AI',
    icon: Cpu,
    skills: [
      { name: 'LLM Orchestration & MCP Specs', level: 94, highlight: true },
      { name: 'System Design & Scalability', level: 92 },
      { name: 'Web Performance Optimization', level: 96, highlight: true },
      { name: 'Security & Auth (OAuth / JWT)', level: 89 },
      { name: 'Clean Code & Testing (Vitest/Jest)', level: 90 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1C2541]/40 relative border-t border-[#1C2541]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141D36] border border-[#F4D03F]/30 text-xs font-semibold uppercase tracking-wider text-[#F4D03F]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00A896]" />
            Technical Expertise
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#F0F6FC] tracking-tight"
          >
            Skills & <span className="gradient-text-teal-gold">Capabilities</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#94A3B8]"
          >
            A breakdown of technologies, frameworks, and architectural domains I leverage to construct elite software applications.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILL_CATEGORIES.map((category, catIdx) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: catIdx * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 sm:p-8 border border-[#00A896]/20 hover:border-[#00A896]/50 transition-all duration-300 relative overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#2A365C]/60">
                  <div className="p-3 rounded-xl bg-[#1C2541] border border-[#00A896]/40 text-[#00A896]">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F0F6FC]">
                    {category.title}
                  </h3>
                </div>

                {/* Skill Bars List */}
                <div className="space-y-5">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
                        <span className="flex items-center gap-2 text-[#F0F6FC]">
                          {skill.name}
                          {skill.highlight && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#F4D03F]/15 text-[#F4D03F] font-mono border border-[#F4D03F]/30">
                              Core
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[#00A896]">{skill.level}%</span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="h-2 w-full rounded-full bg-[#0B132B] overflow-hidden border border-[#2A365C]/60">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: sIdx * 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            skill.highlight
                              ? 'bg-gradient-to-r from-[#00A896] to-[#F4D03F]'
                              : 'bg-[#00A896]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
