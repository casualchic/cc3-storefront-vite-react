/// <reference types="vite/client" />

// Cloudflare Zaraz browser API. Zaraz is injected by an external script tag at
// runtime, not bundled, so it is not always present. Its Ecommerce API is also
// optional: Zaraz can load without it registered, in which case `zaraz.ecommerce`
// is `undefined`. Both are typed as optional so callers must guard before use.
interface ZarazEcommerce {
  (event: string, payload?: Record<string, unknown>): void;
}

interface Zaraz {
  ecommerce?: ZarazEcommerce;
}

interface Window {
  zaraz?: Zaraz;
}
