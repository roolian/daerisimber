import { defineConfig } from "vite";
import { writeFile, readFileSync, writeFileSync } from "fs";
import tailwindcss from "@tailwindcss/vite";
import viteConfig from "./vite.json";
import themeConfig from "./theme/theme.js";
import { palette } from "./theme/theme-colors.js";

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

          // Inject surface class safelist into _wp-global.css
          const pathWpGlobal = "./src/assets/styles/gutenberg/_wp-global.css";
          const slugs = Object.keys(palette);
          const hasBg = slugs.map((s) => `has-${s}-background-color`).join(" ");
          const surfaces = slugs.map((s) => `surface-${s}`).join(" ");
          const generatedBlock = [
            "/* surface-classes:start — auto-generated, do not edit */",
            `@source inline("${hasBg}");`,
            `@source inline("${surfaces}");`,
            "/* surface-classes:end */",
          ].join("\n");

          try {
            const data = readFileSync(pathWpGlobal, "utf8");
            const startMarker = "/* surface-classes:start";
            const endMarker = "/* surface-classes:end */";
            let updated;
            const startIdx = data.indexOf(startMarker);
            const endIdx = data.indexOf(endMarker);
            if (startIdx !== -1 && endIdx !== -1) {
              updated = data.slice(0, startIdx) + generatedBlock + data.slice(endIdx + endMarker.length);
            } else {
              updated = data.trimEnd() + "\n\n" + generatedBlock + "\n";
            }
            writeFileSync(pathWpGlobal, updated);
            console.log(pathWpGlobal + " surface classes updated");
          } catch (e) {
            console.log("Error updating _wp-global.css", e);
          }
        },
      },
    ],
  };
});
