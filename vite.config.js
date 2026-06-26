import { defineConfig } from "vite";
import { writeFile } from "fs";
import tailwindcss from "@tailwindcss/vite";
import viteConfig from "./vite.json";
import themeConfig from "./theme/theme.js";

import { themeColors, contrastMap } from "./theme/theme-colors.js";

function generateContrastCSS(colors, contrastMap) {
  const els = "h1, h2, h3, h4, h5, h6, p, li, a, span";
  const slugs = Object.keys(contrastMap).join(",");
  let css = "/* Auto-generated — do not edit manually */\n\n";
  css += `@source inline("bg-{${slugs}}");\n\n`;

  for (const [slug, contrastSlug] of Object.entries(contrastMap)) {
    const bgColor   = colors[slug];
    const textColor = colors[contrastSlug] ?? contrastSlug;
    css += `.has-${slug}-background-color,\n`;
    css += `.bg-${slug} {\n`;
    css += `  --text-contrast: ${textColor};\n`;
    css += `  background-color: ${bgColor};\n`;
    css += `  color: ${textColor};\n`;
    css += `}\n`;
    css += `.has-${slug}-background-color :is(${els}),\n`;
    css += `.bg-${slug} :is(${els}) {\n`;
    css += `  color: var(--text-contrast);\n`;
    css += `}\n\n`;
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
            generateContrastCSS(themeColors, contrastMap),
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
