import plugin from "tailwindcss/plugin";
import {
  tailwindCustomColors,
  tailwindColors,
  palette,
} from "./theme/theme-colors";

const getDefault = (c) =>
  typeof c === "string" ? c : (c.default ?? "#000000");
const elsList = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a", "span"];

export default {
  theme: {
    extend: {
      //Edit theme-colors.js
      colors: { ...tailwindCustomColors, ...tailwindColors },
      typography: {
        DEFAULT: {
          css: {
            color: null,
            "--tw-prose-bullets": "currentColor",
            h1: {
              color: null,
            },
            h2: {
              color: null,
            },
            h3: {
              color: null,
            },
            h4: {
              color: null,
            },
            h5: {
              color: null,
            },
            h6: {
              color: null,
            },
            p: {
              color: null,
            },
            strong: {
              color: null,
            },
            a: {
              color: null,
            },
            blockquote: {
              color: null,
              borderInlineStartColor: "currentColor",
            },
            em: {
              color: null,
            },
            code: {
              color: null,
            },
            pre: {
              color: null,
            },
            li: {
              color: null,
            },
          },
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities, matchUtilities, theme }) => {
      // Surface CSS variables — only explicit values, fallbacks handled by var() chain
      const surfaceVars = {};
      for (const [slug, entry] of Object.entries(palette)) {
        surfaceVars[`--surface-${slug}`] = getDefault(entry.contrast);
        if (typeof entry.contrast === "object") {
          for (const [el, color] of Object.entries(entry.contrast)) {
            if (el !== "default")
              surfaceVars[`--surface-${slug}-${el}`] = color;
          }
        }
      }
      addBase({ ":root": surfaceVars });

      // Wildcard rules — @layer base (lowest priority, overridable by text-* utilities)
      const baseRules = {};
      for (const el of elsList) {
        baseRules[
          `[class*="-background-color"] :where(${el}), [class*="surface-"] :where(${el})`
        ] = {
          color: `var(--surface-text-color-${el}, var(--surface-text-color))`,
        };
      }
      addBase(baseRules);

      // Color blocks — @layer utilities
      const utilities = {};
      for (const [slug, entry] of Object.entries(palette)) {
        const defaultColor = getDefault(entry.contrast);

        // Base block — shared, grouped selector for both WP and Tailwind classes
        const baseBlock = {
          "--surface-text-color": `var(--surface-${slug})`,
          "--surface-bg-color": `var(--surface-${slug}-bg ,var(--color-${slug}, ${entry.color}))`,
          "background-color": `var(--surface-bg-color) !important`,
          color: `var(--surface-text-color)`,
        };
        for (const el of elsList) {
          baseBlock[`--surface-text-color-${el}`] =
            `var(--surface-${slug}-${el}, var(--surface-${slug}))`;
        }
        utilities[`.has-${slug}-background-color, .surface-${slug}`] = baseBlock;
      }
      addBase(utilities);

      const noSurfaceBlock = {
        //"--surface-text-color": "reset",
      };
      for (const el of elsList) {
        noSurfaceBlock[`--surface-text-color-${el}`] = "reset";
      }

      addUtilities({ ".no-surface": noSurfaceBlock });

      // surface-text-{color} — sets --surface-text-color to any theme color
      matchUtilities(
        {
          "surface-text": (value) => ({
            "--surface-text-color": value,
            color: `var(--surface-text-color)`,
          }),
        },
        { values: theme("colors"), type: "color" },
      );
    }),
  ],
};
