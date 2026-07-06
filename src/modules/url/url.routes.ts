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
  
  // Note: Redirect endpoint (GET /:shortCode) will be registered at root level in app.ts,
  // or we can register it here and prefix it differently, but URL shorteners usually 
  // have the redirect at the root level (e.g., domain.com/xyz).
  // For now, we will register it here, but we might need to adjust the prefix later.
  fastify.get('/redirect/:shortCode', controller.redirectUrl);
};
