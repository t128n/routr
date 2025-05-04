import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { registerSW } from "virtual:pwa-register";

import App from "@/app/page";
import "@/styles/globals.css";
import { toast } from "sonner";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}

registerSW({
	onNeedRefresh() {
		toast("New content available, click on the icon to refresh.");
		/* show “update available” UI */
	},
	onRegisterError() {
		toast.error(
			"Routr could not start routing engine. Please reload to try again.",
		);
	},
});