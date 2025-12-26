/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Layout / Backgrounds
        "bg-main": "#18181b", // zinc-900
        "bg-dark": "#09090b", // zinc-950
        "bg-panel": "#27272a", // zinc-800

        // Borders
        "border-main": "#3f3f46", // zinc-700
        "border-light": "#52525b", // zinc-600

        // Text
        "text-main": "#f4f4f5", // zinc-100
        "text-secondary": "#d4d4d8", // zinc-300
        "text-muted": "#a1a1aa", // zinc-400
        "text-dim": "#71717a", // zinc-500

        // Brand / Actions
        brand: "#d97706", // amber-600
        "brand-hover": "#b45309", // amber-700
        accent: "#eab308", // yellow-500

        // Functional Colors
        success: "#22c55e", // green-500
        danger: "#ef4444", // red-500
        "danger-light": "#f87171", // red-400 (used for Food text sometimes)
        info: "#93c5fd", // blue-300 (population icon)
      },
      fontFamily: {
        // We can add custom fonts here later
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
