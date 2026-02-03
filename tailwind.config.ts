import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fontFamily: {
        // This connects your arbitrary CSS variable to the Tailwind class 'font-monument'
        monument: ["var(--font-monument)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
