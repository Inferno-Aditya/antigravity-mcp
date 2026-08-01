"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ExternalLink, Sparkles, ArrowUpRight, CheckCircle, Code2, X } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

interface Project {
  id: string;
  title: string;
  category: "AI & Agents" | "Full-Stack Web" | "Cloud & Infrastructure";
  tagline: string;
  description: string;
  fullDetails: string[];
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  metrics: string;
  accent: "teal" | "gold";
}

const projectsData: Project[] = [
  {
    id: "antigravity-supervisor",
    title: "Antigravity Supervisor Engine",
    category: "AI & Agents",
    tagline: "Autonomous Multi-Agent Orchestration CLI & Reactive Dashboard",
    description: "Built an intelligent supervisor system for managing parallel AI subagent pipelines, state persistence, and inter-agent RPC communication.",
    fullDetails: [
      "Engineered dynamic agent spawning and execution trees using Node.js, Python, and WebSocket streams.",
      "Built a sleek Next.js monitoring dashboard with sub-50ms live telemetry updates.",
      "Implemented automated crash recovery and task retry loops for long-running workflows."
    ],
    techStack: ["Next.js", "TypeScript", "Python", "WebSockets", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/example/antigravity-supervisor",
    demoUrl: "https://antigravity-demo.example.com",
    featured: true,
    metrics: "16x Concurrency Speedup",
    accent: "gold",
  },
  {
    id: "aetheria-shader-synth",
    title: "Aetheria Audio Visualizer",
    category: "Full-Stack Web",
    tagline: "WebGL Shader Engine & Real-Time Audio-Reactive Synthesizer",
    description: "An interactive browser-based web application rendering dynamic procedural shaders synchronized with Web Audio API frequency spectrums.",
    fullDetails: [
      "Custom GLSL fragment shaders optimized for 60FPS across desktop and mobile browsers.",
      "Anime.js keyframe interpolation and custom audio buffer FFT analyzers.",
      "Export capability for high-resolution canvas recordings."
    ],
    techStack: ["React", "Three.js / WebGL", "GLSL", "Anime.js", "Web Audio API"],
    githubUrl: "https://github.com/example/aetheria-synth",
    demoUrl: "https://aetheria-synth.example.com",
    featured: true,
    metrics: "60 FPS GPU Acceleration",
    accent: "teal",
  },
  {
    id: "veritas-medical-ai",
    title: "Veritas Clinical Diagnostic AI",
    category: "AI & Agents",
    tagline: "Genomic Variant Effect Predictor & Clinical Knowledgebase",
    description: "Integrated NCBI, ClinVar, and AlphaFold APIs to compute structural confidence score pLDDT and gene pathogenicity metrics.",
    fullDetails: [
      "Parses rsIDs and genomic coordinates into 3D structural protein viewer.",
      "Fast API microservice layer querying gnomAD and GTEx tissue expression datasets.",
      "Responsive glassmorphism medical workspace interface."
    ],
    techStack: ["Next.js", "Python FastAPI", "3Dmol.js", "Tailwind CSS", "PostgreSQL"],
    githubUrl: "https://github.com/example/veritas-health-ai",
    demoUrl: "https://veritas-ai.example.com",
    featured: true,
    metrics: "99.4% Pathogenicity Accuracy",
    accent: "gold",
  },
  {
    id: "nexus-cloud-mesh",
    title: "Nexus Distributed Cloud Mesh",
    category: "Cloud & Infrastructure",
    tagline: "High-Throughput Distributed Task Runner & Observability Platform",
    description: "A resilient distributed task runner architecture handling microservice message queues, telemetry, and live health metrics.",
    fullDetails: [
      "Go & Node.js worker nodes with raft consensus algorithm.",
      "Real-time event streaming and alert notification sound engine.",
      "Zero-downtime hot reloading for subagent scripts."
    ],
    techStack: ["Go", "Node.js", "Docker", "Redis", "Grafana API", "Next.js"],
    githubUrl: "https://github.com/example/nexus-cloud-mesh",
    demoUrl: "https://nexus-mesh.example.com",
    featured: false,
    metrics: "100k Req/sec Throughput",
    accent: "teal",
  },
  {
    id: "chrono-graph-db",
    title: "Chrono Temporal Graph Visualizer",
    category: "Cloud & Infrastructure",
    tagline: "High-Frequency Time-Series Node Graph Inspector",
    description: "An interactive force-directed graph viewer rendered with D3.js and Canvas to explore high-dimensional temporal datasets.",
    fullDetails: [
      "Handles 50,000+ interactive nodes with spatial quadtree spatial indexing.",
      "Custom timeline scrubber with Anime.js playback controls.",
      "Theme support with Midnight Blue and Gold high-contrast mode."
    ],
    techStack: ["TypeScript", "D3.js", "HTML5 Canvas", "Tailwind CSS", "Web Workers"],
    githubUrl: "https://github.com/example/chrono-graph",
    demoUrl: "https://chrono-graph.example.com",
    featured: false,
    metrics: "50k Active Canvas Nodes",
    accent: "gold",
  },
  {
    id: "zenith-ecommerce",
    title: "Zenith Headless Storefront",
    category: "Full-Stack Web",
    tagline: "Ultra-Fast E-Commerce Core with Micro-Animations",
    description: "Next-gen headless commerce storefront with optimistic state updates, instantaneous page transitions, and smooth cart drawer interactions.",
    fullDetails: [
      "Edge-rendered product detail pages with Next.js ISR.",
      "Framer Motion layout animations for filtering and cart drawer state.",
      "Stripe payment terminal integrations with custom security validation."
    ],
    techStack: ["Next.js", "GraphQL", "Tailwind CSS", "Framer Motion", "Stripe API"],
    githubUrl: "https://github.com/example/zenith-storefront",
    demoUrl: "https://zenith-store.example.com",
    featured: false,
    metrics: "< 100ms Page Load",
    accent: "teal",
  },
];

// Interactive 3D Tilt Card Component using Framer Motion
const ProjectCard: React.FC<{
  project: Project;
  onSelect: (p: Project) => void;
}> = ({ project, onSelect }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isGold = project.accent === "gold";

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer h-full"
      onClick={() => onSelect(project)}
    >
      {/* Glow Hover Backing */}
      <div
        className={`absolute -inset-0.5 rounded-2xl blur-md opacity-20 group-hover:opacity-100 transition duration-500 ${
          isGold ? "bg-gradient-to-r from-gold-accent to-amber-500" : "bg-gradient-to-r from-teal-500 to-emerald-400"
        }`}
      />

      {/* Main Glass Card Body */}
      <div className="relative h-full rounded-2xl bg-slate-card/90 border border-teal-500/20 p-6 flex flex-col justify-between backdrop-blur-xl group-hover:border-gold-accent/40 transition-colors shadow-xl">
        
        <div>
          {/* Top Category Badge & Metric Pill */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-xs font-mono px-3 py-1 rounded-full border ${
                isGold
                  ? "bg-amber-500/10 text-gold-accent border-amber-500/30"
                  : "bg-teal-500/10 text-teal-accent border-teal-500/30"
              }`}
            >
              {project.category}
            </span>
            <span className="text-[11px] font-mono text-muted flex items-center gap-1 bg-slate-dark px-2.5 py-1 rounded-md">
              <Sparkles className="w-3 h-3 text-gold-accent" />
              {project.metrics}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="text-xl font-bold font-sans text-offwhite group-hover:text-gold-accent transition-colors mb-2 flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold-accent" />
          </h3>

          <p className="text-sm font-sans text-muted mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-slate-300 bg-slate-dark/80 border border-slate-light/40 px-2.5 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-light/20 text-xs font-mono">
            <span className="text-teal-accent font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Details <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <div className="flex items-center gap-3 text-muted">
              <GithubIcon className="w-4 h-4 hover:text-offwhite transition-colors" />
              <ExternalLink className="w-4 h-4 hover:text-offwhite transition-colors" />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["All", "AI & Agents", "Full-Stack Web", "Cloud & Infrastructure"];

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-dark border border-teal-500/30 text-teal-accent text-xs font-mono mb-4"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO SHOWCASE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-offwhite tracking-tight mb-4"
          >
            Engineered for <span className="gradient-text-gold">Performance</span> & <span className="gradient-text-teal">Precision</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted font-sans text-base sm:text-lg max-w-2xl"
          >
            Explore a curated selection of autonomous systems, real-time web engines, and scalable microservices built with modern tools.
          </motion.p>

          {/* Filter Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-slate-dark/80 border border-teal-500/20 backdrop-blur-md"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-midnight font-bold shadow-lg shadow-teal-500/20"
                    : "text-muted hover:text-offwhite hover:bg-slate-light/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-midnight/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl rounded-2xl bg-slate-card border border-teal-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-dark text-muted hover:text-offwhite hover:bg-slate-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 text-teal-accent border border-teal-500/30">
                  {selectedProject.category}
                </span>
                <span className="text-xs font-mono text-gold-accent bg-slate-dark px-2.5 py-1 rounded-md">
                  {selectedProject.metrics}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-sans text-offwhite mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-sm font-sans text-teal-accent font-medium mb-4">
                {selectedProject.tagline}
              </p>

              <p className="text-sm text-muted leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <h4 className="text-xs font-mono text-gold-accent uppercase tracking-wider mb-3">
                Key Architectural Highlights
              </h4>
              <ul className="space-y-2 mb-6 text-sm text-slate-300">
                {selectedProject.fullDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-accent mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono text-offwhite bg-slate-dark border border-teal-500/20 px-3 py-1 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-light/30">
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-teal-accent text-midnight font-bold font-sans text-sm flex items-center gap-2 hover:bg-gold-accent transition-colors"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-slate-dark border border-teal-500/30 text-offwhite font-mono text-sm flex items-center gap-2 hover:text-teal-accent transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
