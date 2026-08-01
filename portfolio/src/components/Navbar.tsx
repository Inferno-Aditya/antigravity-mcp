'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Code2, Layers, Cpu, Mail } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B132B]/85 backdrop-blur-md border-b border-[#00A896]/20 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#1C2541] border border-[#00A896]/40 flex items-center justify-center group-hover:border-[#F4D03F] group-hover:shadow-lg group-hover:shadow-[#00A896]/20 transition-all">
            <Terminal className="w-5 h-5 text-[#00A896] group-hover:text-[#F4D03F] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg text-[#F0F6FC] tracking-tight group-hover:text-[#00A896] transition-colors">
              ADITYA<span className="text-[#F4D03F]">.DEV</span>
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-widest uppercase">
              Full-Stack Architect
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
          <a
            href="#projects"
            className="hover:text-[#00A896] transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-[#00A896]" />
            Projects
          </a>
          <a
            href="#skills"
            className="hover:text-[#00A896] transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4 text-[#F4D03F]" />
            Skills
          </a>
          <a
            href="#contact"
            className="hover:text-[#00A896] transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-[#00A896]" />
            Contact
          </a>
        </nav>

        {/* CTA Hire Me Button */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C2541] border border-[#F4D03F]/50 text-xs sm:text-sm font-semibold text-[#F4D03F] hover:bg-[#F4D03F] hover:text-[#0B132B] transition-all duration-300 shadow-md shadow-[#F4D03F]/10"
          >
            <Sparkles className="w-4 h-4" />
            Let&apos;s Connect
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
