import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

export type HonoEnv = {
  Bindings: Env;
};

export const createHonoApp = () => {
  const app = new Hono<HonoEnv>();

  // Middleware
  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: ['http://localhost:4321', 'http://localhost:5173'],
      credentials: true,
    })
  );

  // Health check endpoint
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'casual-chic-api',
    });
  });

  return app;
};
