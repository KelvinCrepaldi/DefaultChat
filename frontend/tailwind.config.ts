import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        chatBackground0: "#181818",
        chatBackground1: "#1F1F1F",
        chatBackground2: "#2A2A2A",
        chatBorder: "#474747",
        chatTitle: "#33BBB0",
        chatText: "#D5D5D5",
        chatCard: "#393E46",
        chatCardHover: "#464f5d",
      },
    },
  },
  plugins: [],
};
export default config;
