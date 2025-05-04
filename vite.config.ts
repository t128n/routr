import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

import path from "node:path";
import packageJson from "./package.json";

// https://vite.dev/config/
export default defineConfig({
	base: "/routr/",
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			srcDir: "src",
			filename: "sw/worker.ts",
			strategies: "injectManifest",
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
				type: "module",
			},
		}),
	],
	define: {
		"import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
		"import.meta.env.BUILD_TIME": JSON.stringify(new Date().toISOString()),
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
