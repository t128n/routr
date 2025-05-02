import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/app.tsx";

import "@/styles/globals.css";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
} else {
	document.body.innerText =
		"There has been a severe error with the app. Please check the console for more information.";
}
