/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["./src/setupTests.ts"],
    },
    define: {
      "import.meta.env.PACKAGE_VERSION": JSON.stringify("1.0.0"),
      "import.meta.env.BUILD_TIME": JSON.stringify("2024-01-01T12:00:00.000Z"),
    },
  }),
);
