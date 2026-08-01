'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B132B] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00A896]/10 blur-[120px] rounded-full pointer-events-none" />

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
            Initiate Contact
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#F0F6FC] tracking-tight"
          >
            Let&apos;s Build Something <span className="gradient-text-teal-gold">Extraordinary</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#94A3B8]"
          >
            Have a project in mind, need a full-stack architect, or want to discuss technical consultation? Send a message and let&apos;s talk.
          </motion.p>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card rounded-2xl p-8 border border-[#00A896]/30 space-y-6">
              <h3 className="text-2xl font-bold text-[#F0F6FC]">Contact Details</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Currently open for select freelance contracts, lead engineering roles, and high-impact software consulting.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#1C2541] text-[#00A896] border border-[#00A896]/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#94A3B8]">Email Address</div>
                    <a
                      href="mailto:contact@aditya.dev"
                      className="text-sm font-semibold text-[#F0F6FC] hover:text-[#00A896] transition-colors"
                    >
                      contact@aditya.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#1C2541] text-[#F4D03F] border border-[#F4D03F]/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#94A3B8]">Location</div>
                    <div className="text-sm font-semibold text-[#F0F6FC]">
                      San Francisco, CA / Remote Worldwide
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#1C2541] text-[#00A896] border border-[#00A896]/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#94A3B8]">Response Time</div>
                    <div className="text-sm font-semibold text-[#F0F6FC]">
                      Within 12 hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Links */}
              <div className="pt-6 border-t border-[#2A365C]/60 flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8]">Social Networks</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-[#141D36] text-[#94A3B8] hover:text-[#00A896] border border-[#2A365C] transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-[#141D36] text-[#94A3B8] hover:text-[#00A896] border border-[#2A365C] transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="glass-card-gold rounded-2xl p-8 border border-[#F4D03F]/30 relative">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00A896]/20 border border-[#00A896] flex items-center justify-center mx-auto text-[#00A896]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F0F6FC]">
                    Message Transmitted!
                  </h3>
                  <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
                    Thank you for getting in touch. I have received your dispatch and will reply shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#1C2541] border border-[#00A896] text-xs font-semibold text-[#00A896] hover:bg-[#00A896] hover:text-[#0B132B] transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[#0B132B]/80 border border-[#2A365C] text-[#F0F6FC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896] transition-colors text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#0B132B]/80 border border-[#2A365C] text-[#F0F6FC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Inquiry / Lead Engineering Opportunity"
                      className="w-full px-4 py-3 rounded-xl bg-[#0B132B]/80 border border-[#2A365C] text-[#F0F6FC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896] transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your vision, goals, or requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0B132B]/80 border border-[#2A365C] text-[#F0F6FC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896] transition-colors text-sm resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-[#00A896] text-[#0B132B] font-bold text-sm sm:text-base flex items-center justify-center gap-2 glow-teal hover:bg-[#00A896]/90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Transmitting Signal...</span>
                    ) : (
                      <>
                        <span>Send Transmission</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
