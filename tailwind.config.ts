import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        golddark: "#eba921",
        goldlight: "#e4d74f",
        bronzelight: "#f1a672",
        bronzedark: "#88593c",
      },
      backgroundImage: {
        'bug-casino': "url('/BugCasino.webp')",
      },
    },
  },
  plugins: [],
} satisfies Config;
