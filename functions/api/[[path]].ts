import { createHonoApp } from '@/lib/api/hono-app';

const app = createHonoApp();

export const onRequest = app.fetch;
