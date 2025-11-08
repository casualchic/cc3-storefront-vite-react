import { defineMiddleware } from 'astro:middleware';
import { getBrandFromDomain, getThemeCSS } from '@/lib/utils/theme';

export const onRequest = defineMiddleware(async (context, next) => {
  // Detect brand from domain
  const host = context.request.headers.get('host') || '';
  const brandId = getBrandFromDomain(host);

  // Inject brand context into locals
  context.locals.brand = brandId;
  context.locals.themeCSS = getThemeCSS(brandId);

  return next();
});
