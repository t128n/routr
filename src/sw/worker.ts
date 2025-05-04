// src/sw/worker.ts
/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

import { handleRequest, isRequestRelevant } from "./router";
import { clientsClaim, skipWaiting } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

clientsClaim();
skipWaiting();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event) => {
	if (!isRequestRelevant(event.request)) return;

	event.respondWith(handleRequest(event.request));
});
