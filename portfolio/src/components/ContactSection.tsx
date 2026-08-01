"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/SocialIcons";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Full-Stack Web App",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("submitting");

    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", projectType: "Full-Stack Web App", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative z-10 bg-slate-dark/40 border-t border-teal-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-dark border border-teal-500/30 text-teal-accent text-xs font-mono mb-4">
                <Mail className="w-3.5 h-3.5 text-gold-accent" />
                <span>GET IN TOUCH</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-offwhite tracking-tight mb-4">
                Let&apos;s Build <span className="gradient-text-gold">Something Exceptional</span>
              </h2>

              <p className="text-muted font-sans text-base sm:text-lg mb-8 leading-relaxed">
                Whether you have an innovative web app idea, an AI subagent protocol to engineer, or a high-performance system to architect, I&apos;m ready to collaborate.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-card border border-teal-500/20 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-accent">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted uppercase">Direct Email</div>
                    <a href="mailto:alex.thorne.dev@example.com" className="text-sm font-semibold text-offwhite hover:text-gold-accent transition-colors font-sans">
                      alex.thorne.dev@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-card border border-teal-500/20 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-lg bg-gold-accent/10 flex items-center justify-center text-gold-accent">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted uppercase">Location & Timezone</div>
                    <div className="text-sm font-semibold text-offwhite font-sans">
                      San Francisco, CA (UTC-8) / Global Remote
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <div className="text-xs font-mono text-muted uppercase tracking-wider mb-3">Connect Across Platforms</div>
              <div className="flex items-center gap-3">
                {[
                  { name: "GitHub", icon: GithubIcon, href: "https://github.com" },
                  { name: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
                  { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-card border border-teal-500/20 text-muted hover:text-gold-accent hover:border-gold-accent/40 transition-all"
                      aria-label={s.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-slate-card/90 border border-teal-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative"
            >
              <h3 className="text-xl font-bold font-sans text-offwhite mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-accent" />
                <span>Send a Message</span>
              </h3>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-accent flex items-center justify-center text-teal-accent mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold font-sans text-offwhite">Message Received!</h4>
                  <p className="text-muted font-sans text-sm max-w-md">
                    Thank you for reaching out. I will respond to your inquiry within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-muted mb-2">YOUR NAME</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl bg-slate-dark border border-teal-500/20 text-offwhite placeholder:text-muted/40 font-sans text-sm focus:outline-none focus:border-teal-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted mb-2">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-dark border border-teal-500/20 text-offwhite placeholder:text-muted/40 font-sans text-sm focus:outline-none focus:border-teal-accent transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-muted mb-2">PROJECT TYPE</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-dark border border-teal-500/20 text-offwhite font-sans text-sm focus:outline-none focus:border-teal-accent transition-colors"
                    >
                      <option value="Full-Stack Web App">Full-Stack Web Application</option>
                      <option value="Autonomous AI Agent System">Autonomous AI Agent System</option>
                      <option value="Custom UI Design & Animation">Custom UI Design & Animation</option>
                      <option value="System Consulting & Audit">System Consulting & Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-muted mb-2">PROJECT DETAILS & SCOPE</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your goals, timelines, and technical requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-dark border border-teal-500/20 text-offwhite placeholder:text-muted/40 font-sans text-sm focus:outline-none focus:border-teal-accent transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-accent to-amber-400 text-midnight font-bold font-sans text-base shadow-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all"
                  >
                    {status === "submitting" ? (
                      <span>Dispatching Message...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
