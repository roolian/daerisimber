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
    },
  },
  plugins: [
    plugin(
      ({ addBase, addUtilities, matchUtilities, theme }) => {
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
            `[class*="-background-color"] ${el}, [class*="surface-"] ${el}`
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
            "background-color": `var(--surface-${slug}-bg ,var(--color-${slug}, ${entry.color})) !important`,
            color: `var(--surface-text-color)`,
          };
          for (const el of elsList) {
            baseBlock[`--surface-text-color-${el}`] =
              `var(--surface-${slug}-${el}, var(--surface-${slug}))`;
          }
          utilities[`.has-${slug}-background-color, .surface-${slug}`] =
            baseBlock;
        }
        addUtilities(utilities);

        // surface-text-{color} — sets --surface-text-color to any theme color
        matchUtilities(
          { "surface-text": (value) => ({ "--surface-text-color": value }) },
          { values: theme("colors"), type: "color" },
        );
      },
    ),
  ],
};
