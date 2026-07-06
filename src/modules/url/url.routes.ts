import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './url.repository';
import { prisma } from '../../config/prisma';
import { 
  createUrlSchema, 
  getUrlsSchema, 
  getUrlByIdSchema, 
  updateUrlSchema, 
  deleteUrlSchema, 
  getUrlStatsSchema, 
  redirectUrlSchema 
} from './url.swagger';

export const urlRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Dependency Injection
  const repository = new UrlRepository(prisma);
  const service = new UrlService(repository);
  const controller = new UrlController(service);

  // Endpoints mapping
  fastify.post('/', { schema: createUrlSchema }, controller.createUrl);
  fastify.get('/', { schema: getUrlsSchema }, controller.getUrls);
  fastify.get('/:id', { schema: getUrlByIdSchema }, controller.getUrlById);
  fastify.patch('/:id', { schema: updateUrlSchema }, controller.updateUrl);
  fastify.delete('/:id', { schema: deleteUrlSchema }, controller.deleteUrl);
  fastify.get('/:id/stats', { schema: getUrlStatsSchema }, controller.getUrlStats);
  
  // Note: Redirect endpoint (GET /:shortCode) will be registered at root level in app.ts
};

export const redirectRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const repository = new UrlRepository(prisma);
  const service = new UrlService(repository);
  const controller = new UrlController(service);

  fastify.get('/:shortCode', { schema: redirectUrlSchema }, controller.redirectUrl);
};
