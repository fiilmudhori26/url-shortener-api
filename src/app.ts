import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { urlRoutes, redirectRoutes } from './modules/url/url.routes';

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  // Register Middlewares
  await app.register(cors);
  await app.register(helmet);
  await app.register(rateLimit, {
    max: 100, // 100 requests
    timeWindow: '1 minute',
  });

  // Health check route
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // Register Modules
  app.register(urlRoutes, { prefix: '/urls' });
  app.register(redirectRoutes);

  return app;
};
