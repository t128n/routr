/// <reference types="vite/client" />

declare module "virtual:pwa-register";
declare module "virtual:pwa-register/react";

interface ImportMetaEnv {
	readonly PACKAGE_VERSION: string;
	readonly BUILD_TIME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}