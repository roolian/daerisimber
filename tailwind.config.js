import plugin from "tailwindcss/plugin";
import { themeColors, tailwindColors, palette } from "./theme/theme-colors";

const getDefault = (c) =>
  typeof c === "string" ? c : (c.default ?? "#000000");
const getBg = (v) => (typeof v === "string" ? v : (v?.default ?? null));
const elsList = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a", "span"];

export default {
  theme: {
    extend: {
      //Edit theme-colors.js
      colors: { ...themeColors, ...tailwindColors },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities, matchUtilities, theme }) => {
      // Wildcard rules — @layer base (lowest priority, overridable by text-* utilities)
      const baseRules = {};
      for (const el of elsList) {
        baseRules[
          `[class*="-background-color"] ${el}, [class*="contrast-bg-"] ${el}`
        ] = {
          color: `var(--text-contrast-${el}, var(--text-contrast))`,
        };
      }
      addBase(baseRules);

      // Color blocks — @layer utilities
      const utilities = {};
      const darkUtilities = {};

      for (const [slug, entry] of Object.entries(palette)) {
        const defaultColor = getDefault(entry.contrast);
        const darkBg = entry.dark !== undefined ? getBg(entry.dark) : null;

        // Base block — shared, grouped selector for both WP and Tailwind classes
        const baseBlock = {
          "--text-contrast": `var(--contrast-color-bg-${slug})`,
          "background-color": `${entry.color} !important`,
          color: `var(--contrast-color-bg-${slug})`,
        };
        for (const el of elsList) {
          baseBlock[`--text-contrast-${el}`] = `var(--contrast-color-bg-${slug}-${el})`;
        }
        utilities[`.has-${slug}-background-color, .contrast-bg-${slug}`] = baseBlock;

        // Dark mode — separate rule, only for WP class (contrast-bg uses dark: prefix)
        if (darkBg && entry.darkContrast !== undefined) {
          const darkDefault = getDefault(entry.darkContrast);
          const darkBlock = { "background-color": `${darkBg} !important` };
          if (darkDefault !== defaultColor) {
            darkBlock["--text-contrast"] = darkDefault;
            darkBlock.color = darkDefault;
          }
          if (typeof entry.darkContrast === "object") {
            for (const [sel, color] of Object.entries(entry.darkContrast)) {
              if (sel !== "default") darkBlock[`--text-contrast-${sel}`] = color;
            }
          }
          darkUtilities[`.has-${slug}-background-color`] = {
            "@media (prefers-color-scheme: dark)": {
              "body:not(.editor-styles-wrapper) &": darkBlock,
            },
          };
        }
      }
      addUtilities(utilities);
      addUtilities(darkUtilities);

      // contrast-text-{color} — sets --text-contrast to any theme color
      matchUtilities(
        { "contrast-text": (value) => ({ "--text-contrast": value }) },
        { values: theme("colors"), type: "color" },
      );
    }),
  ],
};
