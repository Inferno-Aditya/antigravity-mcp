"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Send, Sparkles, CornerDownLeft, Play, RefreshCw, CheckCircle2 } from "lucide-react";

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalSection: React.FC = () => {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init",
      command: "init --welcome",
      output: (
        <div className="text-slate-300 space-y-1">
          <p className="text-teal-accent font-bold">Welcome to Antigravity Interactive CLI v2.4</p>
          <p className="text-muted">Type <span className="text-gold-accent font-semibold">&apos;help&apos;</span> to see available commands or click quick action tags below.</p>
        </div>
      ),
      timestamp: "00:00:01",
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    const now = new Date().toLocaleTimeString();

    let responseOutput: React.ReactNode = null;

    switch (trimmed) {
      case "help":
        responseOutput = (
          <div className="space-y-1 text-slate-300 font-mono">
            <p className="text-gold-accent font-semibold">Available Commands:</p>
            <p>• <span className="text-teal-accent font-semibold">whoami</span> — Display bio & core engineering focus</p>
            <p>• <span className="text-teal-accent font-semibold">skills</span> — List primary programming languages & frameworks</p>
            <p>• <span className="text-teal-accent font-semibold">projects</span> — Summary of featured showcase projects</p>
            <p>• <span className="text-teal-accent font-semibold">contact</span> — Reach out via email, LinkedIn, or GitHub</p>
            <p>• <span className="text-teal-accent font-semibold">clear</span> — Reset terminal output history</p>
            <p>• <span className="text-gold-accent font-semibold">sudo hire</span> — Initiate contract / hiring workflow</p>
          </div>
        );
        break;
      case "whoami":
        responseOutput = (
          <p className="text-slate-300">
            Alex Thorne — Creative Engineer & Systems Architect specializing in Next.js, Framer Motion, Anime.js, and autonomous AI subagent protocols.
          </p>
        );
        break;
      case "skills":
        responseOutput = (
          <div className="text-slate-300 space-y-1 font-mono">
            <p><span className="text-teal-accent">Frontend:</span> Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Anime.js, WebGL</p>
            <p><span className="text-gold-accent">Backend & AI:</span> Python, Node.js, FastAPI, Multi-Agent Architecture, WebSockets, PostgreSQL</p>
            <p><span className="text-emerald-400">DevOps:</span> Docker, CI/CD, Redis, Vercel, AWS</p>
          </div>
        );
        break;
      case "projects":
        responseOutput = (
          <div className="text-slate-300 space-y-1 font-mono">
            <p>1. <span className="text-gold-accent">Antigravity Supervisor</span> — Multi-agent CLI & Dashboard</p>
            <p>2. <span className="text-teal-accent">Aetheria Audio Visualizer</span> — WebGL shader engine</p>
            <p>3. <span className="text-emerald-400">Veritas Clinical AI</span> — AlphaFold 3D genomic predictor</p>
            <p className="text-muted text-xs">Run &apos;projects&apos; or scroll to Projects section for live demos.</p>
          </div>
        );
        break;
      case "contact":
        responseOutput = (
          <div className="text-slate-300 font-mono space-y-1">
            <p>Email: <a href="mailto:alex.thorne.dev@example.com" className="text-teal-accent hover:underline">alex.thorne.dev@example.com</a></p>
            <p>GitHub: <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gold-accent hover:underline">github.com/alexthorne</a></p>
            <p>LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-teal-accent hover:underline">linkedin.com/in/alexthorne</a></p>
          </div>
        );
        break;
      case "clear":
        setLogs([]);
        return;
      case "sudo hire":
      case "hire":
        responseOutput = (
          <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-accent font-mono space-y-1">
            <p className="font-bold text-gold-accent flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold-accent" />
              ACCESS GRANTED: ONBOARDING PROTOCOL INITIATED!
            </p>
            <p className="text-xs text-slate-300">
              Thank you for reaching out! Please drop your project details below or email directly to discuss contracts.
            </p>
          </div>
        );
        break;
      default:
        responseOutput = (
          <p className="text-rose-400 font-mono">
            Command not recognized: &quot;{cmdStr}&quot;. Type <span className="text-gold-accent">&apos;help&apos;</span> for valid commands.
          </p>
        );
        break;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmdStr,
        output: responseOutput,
        timestamp: now,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const quickCommands = ["help", "whoami", "skills", "projects", "contact", "sudo hire"];

  return (
    <section id="terminal" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-dark border border-teal-500/30 text-teal-accent text-xs font-mono mb-4">
            <Terminal className="w-3.5 h-3.5 text-gold-accent" />
            <span>INTERACTIVE CLI ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-offwhite tracking-tight mb-3">
            Explore via <span className="gradient-text-teal">Terminal Protocol</span>
          </h2>
          <p className="text-muted text-base max-w-xl">
            Type custom terminal commands or click shortcut chips to inspect system capabilities.
          </p>
        </div>

        {/* Terminal Window Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-slate-card/95 border border-teal-500/30 shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-dark border-b border-teal-500/20">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-muted flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
                alex-thorne@antigravity-mcp:~
              </span>
            </div>

            <button
              onClick={() => setLogs([])}
              className="text-xs font-mono text-muted hover:text-offwhite flex items-center gap-1 bg-slate-light/30 px-2 py-1 rounded"
            >
              <RefreshCw className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="px-4 py-2 bg-slate-dark/50 border-b border-teal-500/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-muted">Suggestions:</span>
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-card border border-teal-500/20 text-teal-accent hover:text-gold-accent hover:border-gold-accent/40 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Terminal Log Area */}
          <div className="p-6 font-mono text-sm max-h-[380px] overflow-y-auto space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="space-y-1.5">
                <div className="flex items-center gap-2 text-gold-accent">
                  <span className="text-teal-accent font-bold">➜</span>
                  <span className="text-muted/60 text-xs">[{log.timestamp}]</span>
                  <span className="font-semibold">{log.command}</span>
                </div>
                <div className="pl-5 text-slate-300 leading-relaxed">{log.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Input Bar */}
          <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 bg-slate-dark border-t border-teal-500/20">
            <span className="text-teal-accent font-bold font-mono mr-3">➜</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type a command (e.g. 'skills', 'projects', 'sudo hire')..."
              className="flex-1 bg-transparent text-offwhite placeholder:text-muted/50 font-mono text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-teal-accent text-midnight font-bold hover:bg-gold-accent transition-colors ml-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </motion.div>
      </div>
    </section>
  );
};
