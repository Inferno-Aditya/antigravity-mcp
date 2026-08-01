"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Code2, Layers, Server, Terminal, Database, Sparkles, Box, Shield, Workflow } from "lucide-react";

const techStack = [
  { name: "Next.js 15", icon: Code2, accent: "teal" },
  { name: "TypeScript", icon: Terminal, accent: "gold" },
  { name: "Framer Motion", icon: Sparkles, accent: "teal" },
  { name: "Anime.js", icon: Layers, accent: "gold" },
  { name: "Tailwind CSS", icon: Box, accent: "teal" },
  { name: "Python / AI SDK", icon: Cpu, accent: "gold" },
  { name: "Node.js Architecture", icon: Server, accent: "teal" },
  { name: "GraphQL & REST", icon: Workflow, accent: "gold" },
  { name: "Docker Containerization", icon: Shield, accent: "teal" },
  { name: "PostgreSQL & Redis", icon: Database, accent: "gold" },
];

export const TechMarquee: React.FC = () => {
  return (
    <div className="py-8 bg-slate-dark/40 border-y border-teal-500/10 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-midnight to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-midnight to-transparent z-10 pointer-events-none" />

      <div className="flex w-full">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex items-center gap-6 whitespace-nowrap min-w-max"
        >
          {[...techStack, ...techStack].map((item, idx) => {
            const Icon = item.icon;
            const isGold = item.accent === "gold";
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-slate-card/80 border border-teal-500/15 backdrop-blur-md hover:border-gold-accent/40 transition-colors"
              >
                <Icon className={`w-4 h-4 ${isGold ? "text-gold-accent" : "text-teal-accent"}`} />
                <span className="text-sm font-mono text-offwhite font-medium">{item.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
