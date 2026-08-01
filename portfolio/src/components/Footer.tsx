'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] border-t border-[#1C2541] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1C2541] text-[#00A896]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#F0F6FC]">
              ADITYA<span className="text-[#F4D03F]">.DEV</span>
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              Architecting cinematic web applications.
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
          <a href="#projects" className="hover:text-[#00A896] transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-[#00A896] transition-colors">
            Skills
          </a>
          <a href="#contact" className="hover:text-[#00A896] transition-colors">
            Contact
          </a>
        </div>

        {/* Copyright & Social */}
        <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
          <span>© {new Date().getFullYear()} Aditya. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-md bg-[#141D36] hover:text-[#00A896] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-md bg-[#141D36] hover:text-[#00A896] transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
