import type { Config } from "tailwindcss";
import openIndustrialTailwindPreset from "@o-industrial/atomic/tailwind/preset";

export default {
  content: ["./**/*.tsx"],
  presets: [openIndustrialTailwindPreset],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--sm-surface)",
          card: "var(--sm-surface-card)",
          elevated: "var(--sm-surface-elevated)",
          inset: "var(--sm-surface-inset)",
        },
        on: {
          surface: "var(--sm-text)",
          "surface-secondary": "var(--sm-text-secondary)",
          "surface-muted": "var(--sm-text-muted)",
          primary: "var(--sm-text-on-primary)",
        },
        primary: {
          DEFAULT: "var(--sm-primary)",
          hover: "var(--sm-primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--sm-secondary)",
          hover: "var(--sm-secondary-hover)",
        },
        border: {
          DEFAULT: "var(--sm-border)",
          input: "var(--sm-border-input)",
          subtle: "var(--sm-border-subtle)",
        },
        focus: "var(--sm-focus-ring)",
        link: "var(--sm-link)",
        status: {
          ready: "var(--sm-status-ready)",
          "ready-bg": "var(--sm-status-ready-bg)",
          "ready-text": "var(--sm-status-ready-text)",
          attention: "var(--sm-status-attention)",
          "attention-bg": "var(--sm-status-attention-bg)",
          "attention-text": "var(--sm-status-attention-text)",
          hold: "var(--sm-status-hold)",
          "hold-bg": "var(--sm-status-hold-bg)",
          "hold-text": "var(--sm-status-hold-text)",
          problem: "var(--sm-status-problem)",
          "problem-bg": "var(--sm-status-problem-bg)",
          "problem-text": "var(--sm-status-problem-text)",
        },
      },
      fontFamily: {
        sans: ["var(--sm-font-sans)"],
      },
    },
  },
} satisfies Config;
