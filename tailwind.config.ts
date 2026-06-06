import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: "#0A0A0A",
          fg: "#FFFFFF",
          red: "#CD2E3A",
          blue: "#0047A0",
          muted: "#A1A1AA",
        },
      },
    },
  },
  plugins: [],
};

export default config;
