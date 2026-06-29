import { defineConfig } from "vite";
import { writeFile } from "fs";
import tailwindcss from "@tailwindcss/vite";
import viteConfig from "./vite.json";
import themeConfig from "./theme/theme.js";
import { palette } from "./theme/theme-colors.js";

const getDefault = (c) => typeof c === "string" ? c : (c.default ?? "#000000");
const elsList = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a", "span"];

function generateContrastVarsCSS(palette) {
  let css = "/* Auto-generated — do not edit manually */\n";
  css += "/* Override any variable with @theme inline in _theme.css */\n";
  css += "@theme inline {\n";
  for (const [slug, entry] of Object.entries(palette)) {
    const defaultColor = getDefault(entry.contrast);
    css += `  --contrast-color-bg-${slug}: ${defaultColor};\n`;
    for (const el of elsList) {
      const override = typeof entry.contrast === "object" ? (entry.contrast[el] ?? null) : null;
      css += `  --contrast-color-bg-${slug}-${el}: ${override ?? `var(--contrast-color-bg-${slug})`};\n`;
    }
  }
  css += "}\n";
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

          const pathContrastVars = "./src/assets/styles/generated/_contrast-vars.css";
          writeFile(
            pathContrastVars,
            generateContrastVarsCSS(palette),
            (error) => {
              if (error) console.log("Erreur génération _contrast-vars.css", error);
              else console.log(pathContrastVars + " successfully generated");
            },
          );
        },
      },
    ],
  };
});
