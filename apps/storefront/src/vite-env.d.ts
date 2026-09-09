/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SALEOR_API_URL?: string;
  readonly VITE_SALEOR_CHANNEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
