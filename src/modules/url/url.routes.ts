import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './url.repository';
import { prisma } from '../../config/prisma';

export const urlRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Dependency Injection
  const repository = new UrlRepository(prisma);
  const service = new UrlService(repository);
  const controller = new UrlController(service);

  // Endpoints mapping
  fastify.post('/', controller.createUrl);
  fastify.get('/', controller.getUrls);
  fastify.get('/:id', controller.getUrlById);
  fastify.patch('/:id', controller.updateUrl);
  fastify.delete('/:id', controller.deleteUrl);
  fastify.get('/:id/stats', controller.getUrlStats);
  
  // Note: Redirect endpoint (GET /:shortCode) will be registered at root level in app.ts
};

export const redirectRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const repository = new UrlRepository(prisma);
  const service = new UrlService(repository);
  const controller = new UrlController(service);

  fastify.get('/:shortCode', controller.redirectUrl);
};
