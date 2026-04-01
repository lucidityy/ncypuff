import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bangers"', "cursive"],
        sans: ['"Poppins"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"]
      },
      colors: {
        background: "#0d1117",
        surface: "#161b22",
        "surface-raised": "#1c2333",
        foreground: "#f0f6fc",
        "foreground-muted": "#8b949e",
        card: "#161b22",
        muted: "#1c2333",
        border: "rgba(57,255,20,0.12)",
        accent: "#39ff14",
        "accent-muted": "rgba(57,255,20,0.10)",
        "accent-dim": "rgba(57,255,20,0.5)",
        "accent-glow": "rgba(57,255,20,0.25)",
        neon: "#39ff14",
        "neon-soft": "#4ade80"
      },
      boxShadow: {
        card: "0 0 0 1px rgba(57,255,20,0.08), 0 2px 12px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(57,255,20,0.15), 0 0 60px rgba(57,255,20,0.05)",
        "glow-lg": "0 0 30px rgba(57,255,20,0.25), 0 0 80px rgba(57,255,20,0.1)",
        "neon": "0 0 5px #39ff14, 0 0 20px rgba(57,255,20,0.3)",
        "neon-lg": "0 0 10px #39ff14, 0 0 40px rgba(57,255,20,0.3), 0 0 80px rgba(57,255,20,0.1)"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem"
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "display-lg": ["2.25rem", { lineHeight: "2.2rem", letterSpacing: "0.04em" }],
        "display-sm": ["1.25rem", { lineHeight: "1.5rem", letterSpacing: "0.02em" }]
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" }
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px #39ff14, 0 0 20px rgba(57,255,20,0.3)" },
          "50%": { boxShadow: "0 0 10px #39ff14, 0 0 40px rgba(57,255,20,0.4)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "wiggle": "wiggle 0.4s ease-in-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
