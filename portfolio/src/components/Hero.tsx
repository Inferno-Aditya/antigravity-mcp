'use client';

import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Globe,
  Terminal,
  Zap,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      animate('.anime-stagger', {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(120, { start: 300 }),
        duration: 1100,
        ease: 'outCubic',
      });
    } catch (err) {
      console.log('Anime.js initialization:', err);
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-bg-radial"
    >
      {/* Background Animated Elements - Framer Motion Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <motion.div
          className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-[#00A896]/15 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-[#F4D03F]/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/12 w-64 h-64 border border-[#00A896]/20 rounded-3xl"
          animate={{
            rotate: [0, 180, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Headline & Intro */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Status Badge */}
          <div className="anime-stagger inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-[#00A896]/30 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00A896]"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F0F6FC]/90">
              Available for High-Impact Projects
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#F4D03F]" />
          </div>

          {/* Main Staggered Heading */}
          <div className="space-y-3">
            <h1
              ref={titleRef}
              className="anime-stagger text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F0F6FC] tracking-tight leading-[1.1]"
            >
              Architecting <br />
              <span className="gradient-text-teal-gold">Cinematic Web</span>
              <br />
              Experiences.
            </h1>
            <p className="anime-stagger text-lg sm:text-xl text-[#94A3B8] max-w-2xl font-normal leading-relaxed pt-2">
              Full-Stack Software Engineer specializing in ultra-responsive UI,
              high-performance web architecture, and interactive digital products using
              React, Next.js, and TypeScript.
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="anime-stagger flex flex-wrap gap-2.5 pt-1">
            {[
              { label: 'Next.js 16', icon: Globe },
              { label: 'TypeScript', icon: Code2 },
              { label: 'Framer Motion', icon: Zap },
              { label: 'Anime.js', icon: Sparkles },
              { label: 'Tailwind v4', icon: Cpu },
            ].map((tech, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2541]/80 border border-[#00A896]/20 text-xs font-medium text-[#F0F6FC] hover:border-[#00A896]/60 transition-colors"
              >
                <tech.icon className="w-3.5 h-3.5 text-[#00A896]" />
                {tech.label}
              </motion.span>
            ))}
          </div>

          {/* Call to Action Buttons */}
          <div className="anime-stagger flex flex-wrap items-center gap-4 pt-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#00A896] text-[#0B132B] font-bold text-sm sm:text-base glow-teal hover:bg-[#00A896]/90 transition-all cursor-pointer shadow-lg shadow-[#00A896]/25"
            >
              Explore Selected Work
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass-panel text-[#F0F6FC] border border-[#F4D03F]/40 font-semibold text-sm sm:text-base hover:border-[#F4D03F] hover:bg-[#1C2541]/90 transition-all cursor-pointer"
            >
              Get In Touch
              <Terminal className="w-4 h-4 text-[#F4D03F]" />
            </motion.a>
          </div>

          {/* Social & Proof Bar */}
          <div className="anime-stagger pt-6 border-t border-[#1C2541] flex items-center gap-6">
            <div className="flex items-center gap-3">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.15, color: '#00A896' }}
                className="p-2.5 rounded-lg bg-[#141D36] border border-[#2A365C] text-[#94A3B8] hover:text-[#00A896] transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.15, color: '#00A896' }}
                className="p-2.5 rounded-lg bg-[#141D36] border border-[#2A365C] text-[#94A3B8] hover:text-[#00A896] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </motion.a>
            </div>
            <div className="h-6 w-px bg-[#2A365C]" />
            <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F4D03F]" />
                <span>5+ Yrs Experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                <span>40+ Products Built</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Code Window / Interactive Preview Card */}
        <div className="lg:col-span-5 anime-stagger">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ y: -6 }}
            className="glass-card rounded-2xl p-5 border border-[#00A896]/30 shadow-2xl relative overflow-hidden group"
          >
            {/* Ambient Card Background Glow */}
            <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-[#00A896]/10 blur-2xl group-hover:bg-[#00A896]/20 transition-all duration-500" />
            <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full bg-[#F4D03F]/10 blur-2xl group-hover:bg-[#F4D03F]/20 transition-all duration-500" />

            {/* Mac-style Window Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A365C]/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono bg-[#0B132B]/80 px-3 py-1 rounded-md border border-[#2A365C]">
                <Terminal className="w-3.5 h-3.5 text-[#00A896]" />
                <span>portfolio.config.ts</span>
              </div>
            </div>

            {/* Code Snippet Display */}
            <div className="font-mono text-xs sm:text-sm text-[#F0F6FC] space-y-2 leading-relaxed">
              <p className="text-[#94A3B8]">
                <span className="text-[#F4D03F]">const</span> engineer = {'{'}
              </p>
              <p className="pl-4">
                name: <span className="text-[#00A896]">&apos;Aditya Portfolio&apos;</span>,
              </p>
              <p className="pl-4">
                role: <span className="text-[#00A896]">&apos;Senior Full-Stack Architect&apos;</span>,
              </p>
              <p className="pl-4">
                skills: [
                <span className="text-[#F4D03F]">&apos;React&apos;</span>,{' '}
                <span className="text-[#F4D03F]">&apos;Next.js&apos;</span>,{' '}
                <span className="text-[#F4D03F]">&apos;TypeScript&apos;</span>,{' '}
                <span className="text-[#F4D03F]">&apos;Node.js&apos;</span>],
              </p>
              <p className="pl-4">
                performanceScore:{' '}
                <span className="text-[#00A896] font-bold">100</span>,
              </p>
              <p className="pl-4">
                designStandards:{' '}
                <span className="text-[#F4D03F]">&apos;Cinematic & Premium&apos;</span>,
              </p>
              <p className="text-[#94A3B8]">{'}'};</p>
              <div className="pt-2 text-[#00A896]/90 flex items-center gap-2">
                <span className="inline-block w-2 h-4 bg-[#00A896] animate-pulse" />
                <span>Ready to deploy vision...</span>
              </div>
            </div>

            {/* Mini Dashboard Metrics Overlay */}
            <div className="mt-6 pt-4 border-t border-[#2A365C]/60 grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-[#0B132B]/60 border border-[#2A365C]">
                <div className="text-xs text-[#94A3B8]">Latency</div>
                <div className="text-base font-bold text-[#00A896]">&lt; 15ms</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B132B]/60 border border-[#2A365C]">
                <div className="text-xs text-[#94A3B8]">Uptime</div>
                <div className="text-base font-bold text-[#F4D03F]">99.99%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B132B]/60 border border-[#2A365C]">
                <div className="text-xs text-[#94A3B8]">Lighthouse</div>
                <div className="text-base font-bold text-[#00A896]">100</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.a
        href="#projects"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#94A3B8] hover:text-[#00A896] transition-colors cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
        <ChevronDown className="w-4 h-4 text-[#00A896]" />
      </motion.a>
    </section>
  );
}
