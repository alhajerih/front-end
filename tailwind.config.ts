import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-[url('/defaultpfp.png')]", // Safelist the custom background image class
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Define a 20-column grid
        20: "repeat(20, minmax(0, 1fr))",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".gradient-opacity-mask": {
          WebkitMaskImage:
            "linear-gradient(to bottom right, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.49) 100%)",
          WebkitMaskRepeat: "no-repeat",
          maskImage:
            "linear-gradient(to bottom right, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.49) 100%)",
          maskRepeat: "no-repeat",
          zIndex: "-1",
          position: "absolute",
          inset: "0",
          backgroundColor: "#060B28",
        },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".gradient-opacity-mask-flipped": {
          WebkitMaskImage:
            "linear-gradient(to top right, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.49) 100%)",
          WebkitMaskRepeat: "no-repeat",
          maskImage:
            "linear-gradient(to top right, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.39) 100%)",
          maskRepeat: "no-repeat",
          zIndex: "-1",
          position: "absolute",
          inset: "0",
          backgroundColor: "#060B28",
        },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".gradient-opacity-mask-light": {
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.00) 100%)",
          WebkitMaskRepeat: "no-repeat",
          maskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.00) 100%)",
          maskRepeat: "no-repeat",
          zIndex: "-1",
          position: "absolute",
          inset: "0",
          backgroundColor: "#060B28",
        },
      });
    }),
  ],
} satisfies Config;
