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

  // Register Swagger
  await app.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'URL Shortener API',
        description: 'REST API for shortening URLs built with Fastify, Prisma, TypeScript and MySQL.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server',
        },
      ],
    },
  });

  await app.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
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
