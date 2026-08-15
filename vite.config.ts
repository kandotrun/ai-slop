import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/app/",
  plugins: [react()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node"
  }
});
