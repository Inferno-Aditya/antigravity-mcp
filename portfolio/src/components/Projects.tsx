'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Zap,
  Briefcase,
  Calendar,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { GithubIcon } from './icons';

interface Project {
  id: string;
  title: string;
  category: 'web' | 'ai' | 'cloud';
  description: string;
  longDescription: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  accentColor: 'teal' | 'gold';
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  skills: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'nexus-ai',
    title: 'Nexus AI Studio',
    category: 'ai',
    description:
      'Enterprise multi-agent LLM orchestration platform with real-time streaming workflows & custom model toolings.',
    longDescription:
      'Engineered an advanced autonomous agent platform leveraging Next.js 16, TypeScript, and WebSocket streaming. Features dynamic tool declaration, memory persistence, and low-latency agent collaboration.',
    tags: ['Next.js 16', 'TypeScript', 'Tailwind v4', 'WebSockets', 'Python SDK'],
    metrics: [
      { label: 'Latency', value: '< 20ms' },
      { label: 'Active Users', value: '45k+' },
    ],
    accentColor: 'teal',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: 'antigravity-mcp',
    title: 'Antigravity MCP Engine',
    category: 'cloud',
    description:
      'High-throughput Model Context Protocol bridge connecting LLM assistants with distributed filesystem & CLI tools.',
    longDescription:
      'Architected a resilient Model Context Protocol tool server capable of sandboxed execution, real-time background task monitoring, and state synchronization across multiple client sessions.',
    tags: ['Node.js', 'TypeScript', 'MCP Standard', 'Docker', 'PowerShell API'],
    metrics: [
      { label: 'TPS', value: '1,200+' },
      { label: 'Uptime', value: '99.99%' },
    ],
    accentColor: 'gold',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: 'hyper-commerce',
    title: 'HyperScale Web Suite',
    category: 'web',
    description:
      'Ultra-fast headless e-commerce storefront with glassmorphism UI, edge caching, and interactive 3D product previews.',
    longDescription:
      'Built a next-generation shopping portal optimized for 100/100 Core Web Vitals using incremental static regeneration, custom GLTF loaders, and Framer Motion micro-interactions.',
    tags: ['React 19', 'Next.js', 'Framer Motion', 'Stripe API', 'GraphQL'],
    metrics: [
      { label: 'Lighthouse', value: '100' },
      { label: 'Conversion', value: '+34%' },
    ],
    accentColor: 'teal',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: 'quant-vision',
    title: 'QuantVision Analytics',
    category: 'ai',
    description:
      'Real-time financial telemetry & algorithmic market signal dashboard with SVG canvas visualizations.',
    longDescription:
      'Created a high-density financial analytics suite processing live market feeds with custom canvas renderers, automated anomaly detection, and predictive trend modeling.',
    tags: ['TypeScript', 'Anime.js', 'Tailwind', 'WebSockets', 'Chart.js'],
    metrics: [
      { label: 'Data Points/s', value: '500k' },
      { label: 'Accuracy', value: '99.4%' },
    ],
    accentColor: 'gold',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    id: 'cloud-mesh',
    title: 'CloudMesh Infrastructure',
    category: 'cloud',
    description:
      'Zero-trust microservice mesh monitor & security compliance engine with interactive node graph visualization.',
    longDescription:
      'Designed an interactive distributed system topology viewer with automated security audits, real-time threat detection, and container health telemetry.',
    tags: ['Go', 'TypeScript', 'Next.js', 'Kubernetes', 'gRPC'],
    metrics: [
      { label: 'Clusters', value: '250+' },
      { label: 'Scan Speed', value: '2.4s' },
    ],
    accentColor: 'teal',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
];

const EXPERIENCES: Experience[] = [
  {
    role: 'Lead Full-Stack Architect',
    company: 'Nexus Tech Systems',
    period: '2024 — Present',
    description:
      'Directing frontend architecture & LLM application integration across cloud product teams. Overseeing high-throughput web app platforms.',
    highlights: [
      'Architected Next.js 16 enterprise codebase serving 2M+ monthly active users',
      'Reduced initial page load latency by 45% using edge caching and optimized bundle splits',
      'Mentored 8 senior engineers and established company-wide TypeScript & animation design standards',
    ],
    skills: ['Next.js', 'TypeScript', 'LLM Tooling', 'System Design', 'Tailwind'],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Aetheria Labs',
    period: '2022 — 2024',
    description:
      'Spearheaded the development of interactive web applications, real-time dashboards, and micro-frontend design systems.',
    highlights: [
      'Built a reusable glassmorphic UI component library used across 12 product domains',
      'Implemented WebSockets streaming pipelines for sub-50ms data updates',
      'Pioneered automated end-to-end performance test workflows with Playwright',
    ],
    skills: ['React', 'Framer Motion', 'Node.js', 'GraphQL', 'Docker'],
  },
  {
    role: 'Full-Stack Developer',
    company: 'CyberPulse Solutions',
    period: '2020 — 2022',
    description:
      'Developed responsive client portals, RESTful microservices, and database optimization strategies.',
    highlights: [
      'Engineered high-concurrency payment and subscription processing gateways',
      'Optimized PostgreSQL query execution plans resulting in 3x faster report rendering',
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'CSS3'],
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState<'projects' | 'experience'>('projects');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ai' | 'web' | 'cloud'>('all');

  const filteredProjects =
    categoryFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === categoryFilter);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B132B] relative">
      {/* Background Decor Elements */}
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C2541] border border-[#00A896]/30 text-xs font-semibold uppercase tracking-wider text-[#00A896]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4D03F]" />
            Portfolio & Track Record
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#F0F6FC] tracking-tight"
          >
            Featured <span className="gradient-text-teal-gold">Work & Experience</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#94A3B8]"
          >
            A curated showcase of scalable web applications, AI toolings, and engineering milestones built with meticulous attention to detail.
          </motion.p>

          {/* Main View Switcher: Projects vs Experience */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex p-1.5 rounded-xl bg-[#141D36] border border-[#2A365C] mt-6"
          >
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#00A896] text-[#0B132B] shadow-md shadow-[#00A896]/20'
                  : 'text-[#94A3B8] hover:text-[#F0F6FC]'
              }`}
            >
              <Layers className="w-4 h-4" />
              Projects ({PROJECTS.length})
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-[#F4D03F] text-[#0B132B] shadow-md shadow-[#F4D03F]/20'
                  : 'text-[#94A3B8] hover:text-[#F0F6FC]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Career Timeline
            </button>
          </motion.div>
        </div>

        {/* Tab 1: PROJECTS VIEW */}
        {activeTab === 'projects' && (
          <div className="space-y-10">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'ai', label: 'AI & Intelligence' },
                { id: 'web', label: 'Web Applications' },
                { id: 'cloud', label: 'Cloud & Infrastructure' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCategoryFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    categoryFilter === filter.id
                      ? 'bg-[#1C2541] border-[#00A896] text-[#00A896] shadow-sm shadow-[#00A896]/30'
                      : 'bg-[#141D36]/60 border-[#2A365C] text-[#94A3B8] hover:border-[#00A896]/40 hover:text-[#F0F6FC]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Project Cards Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => {
                  const isGold = project.accentColor === 'gold';
                  const borderClass = isGold
                    ? 'border-[#F4D03F]/30 hover:border-[#F4D03F]'
                    : 'border-[#00A896]/30 hover:border-[#00A896]';
                  const badgeBg = isGold
                    ? 'bg-[#F4D03F]/15 text-[#F4D03F] border-[#F4D03F]/30'
                    : 'bg-[#00A896]/15 text-[#00A896] border-[#00A896]/30';

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.25, ease: 'easeOut' },
                      }}
                      className={`glass-card rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between relative group ${borderClass}`}
                    >
                      {/* Top Bar with Badge & Links */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeBg}`}
                          >
                            {project.category}
                          </span>

                          <div className="flex items-center gap-2">
                            <motion.a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              whileHover={{ scale: 1.2, color: '#00A896' }}
                              className="p-2 rounded-lg bg-[#0B132B]/80 text-[#94A3B8] hover:text-[#00A896] transition-colors"
                              aria-label="Source Code"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </motion.a>
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              whileHover={{ scale: 1.2, color: '#F4D03F' }}
                              className="p-2 rounded-lg bg-[#0B132B]/80 text-[#94A3B8] hover:text-[#F4D03F] transition-colors"
                              aria-label="Live Demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-xl font-bold text-[#F0F6FC] group-hover:text-[#00A896] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Project Performance Metrics */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {project.metrics.map((metric, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-2 rounded-lg bg-[#0B132B]/70 border border-[#2A365C]/80"
                            >
                              <div className="text-[10px] uppercase font-mono text-[#94A3B8]">
                                {metric.label}
                              </div>
                              <div
                                className={`text-sm font-bold ${
                                  isGold ? 'text-[#F4D03F]' : 'text-[#00A896]'
                                }`}
                              >
                                {metric.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Tech Tags */}
                      <div className="pt-6 mt-4 border-t border-[#2A365C]/50 flex flex-wrap gap-1.5">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md bg-[#1C2541]/90 text-[11px] font-mono text-[#94A3B8] border border-[#2A365C]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Tab 2: CAREER TIMELINE VIEW */}
        {activeTab === 'experience' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="relative border-l-2 border-[#00A896]/40 pl-6 sm:pl-10 space-y-12 ml-2 sm:ml-4">
              {EXPERIENCES.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative group"
                >
                  {/* Timeline Node Icon Dot */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#0B132B] border-2 border-[#00A896] flex items-center justify-center group-hover:scale-125 group-hover:bg-[#00A896] transition-all">
                    <div className="w-2 h-2 rounded-full bg-[#F4D03F]" />
                  </div>

                  {/* Card Container */}
                  <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#2A365C] hover:border-[#00A896]/50 transition-all space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#F0F6FC]">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#00A896] font-semibold mt-1">
                          <Building2 className="w-4 h-4" />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2541] border border-[#F4D03F]/30 text-xs font-mono text-[#F4D03F]">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.period}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-2 pt-2">
                      {exp.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F0F6FC]">
                          <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Skills Pills */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#2A365C]/50">
                      {exp.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-md bg-[#1C2541] text-xs font-mono text-[#F4D03F] border border-[#F4D03F]/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
