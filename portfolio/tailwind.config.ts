import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0B132B",
        "slate-dark": "#1C2541",
        "slate-card": "#141D36",
        "slate-light": "#2A365C",
        offwhite: "#F0F6FC",
        "teal-accent": "#00A896",
        "gold-accent": "#F4D03F",
      },
    },
  },
  plugins: [],
};

export default config;
