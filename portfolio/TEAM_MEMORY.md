# Team Memory — Next.js Portfolio Project

## Architecture & Design Tokens
- **Background Palette**: Midnight Blue (`#0B132B`) -> Slate Dark (`#1C2541`) -> Slate Card (`#141D36`)
- **Text Palette**: Off-white (`#F0F6FC`), Muted (`#94A3B8`)
- **Accents**: Teal (`#00A896`), Gold (`#F4D03F`)
- **Strict Rule**: No purple colors anywhere in the theme or code.
- **Tailwind Config**: `tailwind.config.ts` & `src/app/globals.css` populated with `@theme` color tokens & CSS variables.

## Components Implemented
1. `Hero.tsx`: Staggered load text reveal with `Anime.js` v4 (`animate`, `stagger`), floating gradient orbs with `Framer Motion`, code window preview, call-to-action buttons.
2. `Projects.tsx`: Scroll-triggered entrance animations (`whileInView`), project card hover lift & tilt micro-interactions, category filter pills, metrics, tech tags, and career timeline view.
3. `Skills.tsx`: Technical proficiency progress indicators, categorized tech stacks, animated skill progress bars.
4. `Contact.tsx`: Interactive contact form with transmission state feedback and contact details.
5. `Navbar.tsx` & `Footer.tsx`: Glassmorphism header and footer with social links & brand mark.
6. `icons.tsx`: Dedicated SVG icons (`GithubIcon`, `LinkedinIcon`).
7. `page.tsx`: Assembled main page in full dark theme.

## Status
- `npm run build` passed cleanly with 0 errors.
