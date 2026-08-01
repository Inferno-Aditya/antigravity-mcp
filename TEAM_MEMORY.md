# Team Memory & Portfolio Project Documentation

## Project Summary
- **App Directory**: `e:\Antigravity MCP\portfolio`
- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Animation Stack**: Framer Motion + Anime.js (v4) + HTML5 Canvas
- **Icon Set**: Lucide React + Custom SVG Social Icons

## Color Palette & Theme Tokens
- **Midnight Blue**: `#0B132B` (Primary Background)
- **Slate Gray**: `#1C2541` (Card background & section headers)
- **Slate Card**: `#141D36` (Glassmorphic containers)
- **Off-white**: `#F0F6FC` (Primary Text)
- **Teal Accent**: `#00A896` (Primary glow & active states)
- **Gold Accent**: `#F4D03F` (Secondary highlights & badges)
- *Strict Rule Enforced*: No purple/indigo/violet used anywhere.

## Components Created
1. `src/components/InteractiveCanvas.tsx`: Interactive particle constellation background canvas reacting to cursor position.
2. `src/components/Navbar.tsx`: Floating glassmorphism navbar with live status badge ("Available for Hire").
3. `src/components/HeroSection.tsx`: Staggered Anime.js text reveal on load + Framer Motion interactive IDE preview window with active code line highlights.
4. `src/components/TechMarquee.tsx`: Infinite scrolling tech stack banner.
5. `src/components/ProjectsSection.tsx`: Filterable project showcase with 3D mouse tilt cards (`rotateX`, `rotateY`, `scale`) and detail modal popups.
6. `src/components/ExperienceSection.tsx`: Glowing vertical timeline + interactive skill matrix meters with Framer Motion scroll progress.
7. `src/components/TerminalSection.tsx`: Interactive CLI terminal widget where visitors can type commands (`help`, `skills`, `projects`, `contact`, `sudo hire`) or click shortcut chips.
8. `src/components/ContactSection.tsx`: Glassmorphism contact form with interactive dispatch feedback & social links.
9. `src/components/Footer.tsx`: Signature footer with back-to-top action.

## Status
- `npm run build` compiled 100% cleanly statically and dynamically.
- Dev server active at `http://localhost:3000`.
