import { defineConfig } from "vite";

// Site 100 % statique : Vite sert uniquement le dossier tel quel en dev
// (aucun bundling nécessaire, `app.js` est déjà compilé par `tsc`).
export default defineConfig({
  root: ".",
  publicDir: false,
  server: {
    port: 5173,
    open: false
  }
});
