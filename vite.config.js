import { defineConfig } from "vite";
import { writeFile } from "fs";
import tailwindcss from "@tailwindcss/vite";
import viteConfig from "./vite.json";
import themeConfig from "./theme/theme.js";

import { palette } from "./theme/theme-colors.js";

function generateContrastCSS(palette) {
  const elsList = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a", "span"];
  const els = elsList.join(", ");

  // contrast/darkContrast can be a string or { default: "#hex", h2: "#hex", ... }
  const getDefault = (c) => typeof c === "string" ? c : (c.default ?? "#000000");
  // dark is always a single hex — extract default if accidentally written as object
  const getBg = (v) => typeof v === "string" ? v : (v?.default ?? null);

  let css = "/* Auto-generated — do not edit manually */\n\n";

  // Wildcard base rule
  css += `[class*="-background-color"] :is(${els}) {\n`;
  css += `  color: var(--text-contrast);\n`;
  css += `}\n\n`;

  // Per-element variable rules with fallback — allows per-selector overrides via CSS vars
  for (const el of elsList) {
    css += `[class*="-background-color"] ${el} {\n`;
    css += `  color: var(--text-contrast-${el}, var(--text-contrast));\n`;
    css += `}\n`;
  }
  css += `\n`;

  const writeBlock = (slug, bgColor, contrast) => {
    const defaultColor = getDefault(contrast);
    css += `.has-${slug}-background-color {\n`;
    css += `  --text-contrast: ${defaultColor};\n`;
    css += `  background-color: ${bgColor} !important;\n`;
    css += `  color: ${defaultColor};\n`;
    if (typeof contrast === "object") {
      for (const [sel, color] of Object.entries(contrast)) {
        if (sel === "default") continue;
        css += `  --text-contrast-${sel}: ${color};\n`;
      }
    }
    css += `}\n\n`;
  };

  for (const [slug, entry] of Object.entries(palette)) {
    writeBlock(slug, entry.color, entry.contrast);

    if (entry.dark !== undefined && entry.darkContrast !== undefined) {
      const darkBg = getBg(entry.dark);
      if (!darkBg) continue;

      // Auto dark mode via media query on the base class (excluded from wp-admin)
      const darkDefault = getDefault(entry.darkContrast);
      const baseDefault = getDefault(entry.contrast);
      css += `@media (prefers-color-scheme: dark) {\n`;
      css += `  body:not(.editor-styles-wrapper) .has-${slug}-background-color {\n`;
      css += `    background-color: ${darkBg} !important;\n`;
      if (darkDefault !== baseDefault) {
        css += `    --text-contrast: ${darkDefault};\n`;
        css += `    color: ${darkDefault};\n`;
      }
      if (typeof entry.darkContrast === "object") {
        for (const [sel, color] of Object.entries(entry.darkContrast)) {
          if (sel === "default") continue;
          css += `    --text-contrast-${sel}: ${color};\n`;
        }
      }
      css += `  }\n`;
      css += `}\n\n`;
    }
  }
  return css;
}

const { dest, entries, server } = viteConfig;

export default defineConfig(({ mode, command }) => {
  return {
    base: "./",
    resolve: {
      alias: {
        "@": __dirname,
      },
    },
    server,
    build: {
      outDir: dest,
      emptyOutDir: true,
      manifest: true,
      target: "es2018",
      rollupOptions: {
        input: entries,
      },
      minify: true,
      write: true,
    },
    plugins: [
      tailwindcss(),
      {
        name: "build-script",
        buildStart(options) {
          const wantedViteConfig = { ...viteConfig };
          wantedViteConfig.environment =
            command === "build" ? "production" : "development";
          const viteConfigWrite =
            viteConfig.environment != wantedViteConfig.environment;
          const pathTheme = "./theme.json";
          const pathVite = "./vite.json";

          if (command === "build") {
            writeFile(
              pathTheme,
              JSON.stringify(themeConfig, null, 2),
              (error) => {
                if (error) {
                  console.log(
                    "An error has occurred at theme.json creation",
                    error,
                  );
                  return;
                }
                console.log(pathTheme + " succefully generated");
              },
            );
          }

          if (viteConfigWrite) {
            writeFile(
              pathVite,
              JSON.stringify(wantedViteConfig, null, 2),
              (error) => {
                if (error) {
                  console.log(
                    "An error has occurred at vite.json creation",
                    error,
                  );
                  return;
                }
                console.log(pathVite + " succefully generated");
              },
            );
          }
          const pathContrast = "./src/assets/styles/gutenberg/_wp-contrast.css";
          writeFile(
            pathContrast,
            generateContrastCSS(palette),
            (error) => {
              if (error)
                console.log("Erreur génération _wp-contrast.css", error);
              else console.log(pathContrast + " successfully generated");
            },
          );
        },
      },
    ],
  };
});
