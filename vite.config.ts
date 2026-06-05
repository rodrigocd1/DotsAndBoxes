import { defineConfig } from "vite";

export default defineConfig({
  // base './' é obrigatório para Capacitor funcionar (carrega do filesystem local)
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
