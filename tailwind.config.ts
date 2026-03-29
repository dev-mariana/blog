import { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{vue,ts,js}",
    "./server/**/*.{ts,js}",
    "./prisma/**/*.{ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
      },
    },
  },
  plugins: [],
};

export default config;
