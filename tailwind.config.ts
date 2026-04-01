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
        display: ['"Outfit"', "system-ui", "sans-serif"],
        sans: ['"Poppins"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"]
      },
      colors: {
        background: "#08060f",
        surface: "#110e1f",
        "surface-raised": "#1a1530",
        foreground: "#f4f0ff",
        "foreground-muted": "#8a82a6",
        card: "#110e1f",
        muted: "#1a1530",
        border: "rgba(168,85,247,0.12)",
        accent: "#a855f7",
        "accent-muted": "rgba(168,85,247,0.10)",
        "accent-dim": "rgba(168,85,247,0.5)",
        "accent-glow": "rgba(168,85,247,0.25)",
        neon: "#a855f7",
        "neon-soft": "#c084fc",
        pink: "#ec4899",
        "pink-glow": "rgba(236,72,153,0.25)"
      },
      boxShadow: {
        card: "0 0 0 1px rgba(168,85,247,0.08), 0 2px 12px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(168,85,247,0.15), 0 0 60px rgba(168,85,247,0.05)",
        "glow-lg": "0 0 30px rgba(168,85,247,0.25), 0 0 80px rgba(168,85,247,0.1)",
        neon: "0 0 5px #a855f7, 0 0 20px rgba(168,85,247,0.3)",
        "neon-lg": "0 0 10px #a855f7, 0 0 40px rgba(168,85,247,0.3), 0 0 80px rgba(168,85,247,0.1)",
        "neon-pink": "0 0 5px #ec4899, 0 0 20px rgba(236,72,153,0.3)"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem"
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "display-lg": ["2.25rem", { lineHeight: "2.2rem", letterSpacing: "-0.02em" }],
        "display-sm": ["1.25rem", { lineHeight: "1.5rem", letterSpacing: "-0.01em" }]
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
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" }
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px #a855f7, 0 0 20px rgba(168,85,247,0.3)" },
          "50%": { boxShadow: "0 0 10px #a855f7, 0 0 40px rgba(168,85,247,0.4)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        "shimmer-x": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        wiggle: "wiggle 0.4s ease-in-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "shimmer-x": "shimmer-x 4s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
