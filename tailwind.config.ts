import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        charcoal: "#1A1A1A",
        charcoalHover: "#333333",
        bone: "#F5F5F5",
        gold: "#C9A96E",
        goldDeep: "#A88A52",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.18em",
        widest2: "0.28em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.12) translate(-1.5%, -1.5%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,169,110,0.45)" },
          "50%": { boxShadow: "0 0 0 14px rgba(201,169,110,0)" },
        },
        chevronBounce: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.7" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        drawCheck: {
          "0%": { strokeDashoffset: "60" },
          "100%": { strokeDashoffset: "0" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        kenburns: "kenburns 8s ease-out forwards",
        shimmer: "shimmer 2.4s linear infinite",
        pulseSoft: "pulseSoft 2.4s ease-out infinite",
        chevronBounce: "chevronBounce 1.8s ease-in-out infinite",
        floatY: "floatY 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
