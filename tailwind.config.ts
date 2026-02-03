import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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