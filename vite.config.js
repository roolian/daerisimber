import { defineConfig } from "vite";
import { writeFile } from "fs";
import viteConfig from "./vite.json";
import themeConfig from "./theme.js";

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
                    if (command === "build") {
                        const path = "./theme/theme.json";
                        writeFile(path, JSON.stringify(themeConfig, null, 2), (error) => {
                            if (error) {
                                console.log("An error has occurred at theme.json creation", error);
                                return;
                            }
                            console.log("theme.json succefully generated");
                        });
                    }
                },
            },
        ],
    };
});
