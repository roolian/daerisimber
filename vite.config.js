import { defineConfig } from "vite";
import { writeFile } from "fs";
import viteConfig from "./vite.json";
import themeConfig from "./theme-json/theme.js";

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
            {
                name: "build-script",
                buildStart(options) {
                    const wantedViteConfig = { ...viteConfig };
                    wantedViteConfig.environment = command === "build" ? "production" : "development";
                    const viteConfigWrite = viteConfig.environment != wantedViteConfig.environment;
                    const pathTheme = "./theme/theme.json";
                    const pathVite = "./vite.json";

                    if (command === "build") {
                        writeFile(pathTheme, JSON.stringify(themeConfig, null, 2), (error) => {
                            if (error) {
                                console.log("An error has occurred at theme.json creation", error);
                                return;
                            }
                            console.log(pathTheme + " succefully generated");
                        });
                    }

                    if (viteConfigWrite) {
                        writeFile(pathVite, JSON.stringify(wantedViteConfig, null, 2), (error) => {
                            if (error) {
                                console.log("An error has occurred at vite.json creation", error);
                                return;
                            }
                            console.log(pathVite + " succefully generated");
                        });
                    }
                },

            },
        ],
    };
});
