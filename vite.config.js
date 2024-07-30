import { defineConfig } from 'vite'

import config from "./vite.json";

const {dest, entries, server} = config;

const objectMap = (obj, fn) =>
    Object.fromEntries(
      Object.entries(obj).map(
        ([k, v], i) => [k, fn(v, k, i)]
      )
    )

export default defineConfig(({ mode }) => {
  return {
    base: './',
    resolve: {
      alias: {
        '@': __dirname
      }
    },
    server,
    build: {
      outDir: dest,
      emptyOutDir: true,
      manifest: true,
      target: 'es2018',
      rollupOptions: {
        input: entries,
      },
      minify: true,
      write: true
    }
  }
})
