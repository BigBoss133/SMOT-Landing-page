import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    timeout: 30000,
  },
});
