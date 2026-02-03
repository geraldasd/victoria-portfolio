import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This connects your arbitrary CSS variable to the Tailwind class 'font-monument'
        monument: ["var(--font-monument)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
export default config;