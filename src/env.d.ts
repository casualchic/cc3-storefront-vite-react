/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    brand: string;
    themeCSS: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_MEDUSA_API_URL: string;
  readonly PUBLIC_MEDUSA_PUBLISHABLE_KEY: string;
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  readonly PUBLIC_GOOGLE_PLACES_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  PRODUCT_CACHE: KVNamespace;
  CATEGORY_CACHE: KVNamespace;
  SEARCH_CACHE: KVNamespace;
  CART: DurableObjectNamespace;
  MEDUSA_API_URL: string;
  MEDUSA_API_KEY: string;
  PAYLOAD_API_URL: string;
  PAYLOAD_API_KEY: string;
}
