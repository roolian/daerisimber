import twColors from "tailwindcss/colors";
//10 per line displayed in ACF color field
//6 per line displayed in Gutenberg color field

/**
 * Main palette — single source of truth.
 * Each entry: { color, contrast, dark?, darkContrast? }
 * - color        : base hex
 * - contrast     : string "#hex"  →  same color for all elements
 *                  object { default: "#hex", h2: "#hex", p: "#hex" }  →  per-selector overrides
 * - dark         : (optional) darker variant hex
 * - darkContrast : same as contrast, for the dark variant
 */
export const palette = {
  // Brand
  primary: {
    color: "#007D8F",
    contrast: { default: "#ffffff" },
    dark: "#005A67",
    darkContrast: { default: "#ffffff" },
  },
  "primary-light": {
    color: "#00ccea",
    contrast: { default: "#ffffff" },
    dark: "#00ccea",
    darkContrast: { default: "#ff0000" },
  },
  secondary: {
    color: "#030712",
    contrast: { default: "#ffffff", h2: "#00ccea", h1: "#00ccea" },
  },
  tertiary: {
    color: "#4CA882",
    contrast: "#000000",
  },
  light: {
    color: "#ffffff",
    contrast: "#030712",
  },
  dark: {
    color: "#000000",
    contrast: "#ffffff",
  },
};

/**
 * Tailwind custom color tokens — derived from palette, extends Tailwind's base palette.
 * Colors with a `dark` variant become { DEFAULT, dark } for Tailwind
 * (generates `bg-primary` and `bg-primary-dark`).
 */
export const tailwindCustomColors = Object.fromEntries(
  Object.entries(palette).map(([slug, { color, dark }]) => {
    const darkColor = typeof dark === "object" ? dark?.default : dark;
    return [
      slug,
      darkColor !== undefined ? { DEFAULT: color, dark: darkColor } : color,
    ];
  }),
);

/**
 * Extended Tailwind-only colors (not exported to WordPress palette).
 */
export const tailwindColors = {
  inherit: "inherit",
  success: twColors.emerald[500],
  warning: twColors.amber[500],
  error: twColors.red[900],
  info: twColors.blue[500],
};
