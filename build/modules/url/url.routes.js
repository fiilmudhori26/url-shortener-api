"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectRoutes = exports.urlRoutes = void 0;
const url_controller_1 = require("./url.controller");
const url_service_1 = require("./url.service");
const url_repository_1 = require("./url.repository");
const prisma_1 = require("../../config/prisma");
const url_swagger_1 = require("./url.swagger");
const urlRoutes = async (fastify) => {
    // Dependency Injection
    const repository = new url_repository_1.UrlRepository(prisma_1.prisma);
    const service = new url_service_1.UrlService(repository);
    const controller = new url_controller_1.UrlController(service);
    // Endpoints mapping
    fastify.post('/', { schema: url_swagger_1.createUrlSchema }, controller.createUrl);
    fastify.get('/', { schema: url_swagger_1.getUrlsSchema }, controller.getUrls);
    fastify.get('/:id', { schema: url_swagger_1.getUrlByIdSchema }, controller.getUrlById);
    fastify.patch('/:id', { schema: url_swagger_1.updateUrlSchema }, controller.updateUrl);
    fastify.delete('/:id', { schema: url_swagger_1.deleteUrlSchema }, controller.deleteUrl);
    fastify.get('/:id/stats', { schema: url_swagger_1.getUrlStatsSchema }, controller.getUrlStats);
    // Note: Redirect endpoint (GET /:shortCode) will be registered at root level in app.ts
};
exports.urlRoutes = urlRoutes;
const redirectRoutes = async (fastify) => {
    const repository = new url_repository_1.UrlRepository(prisma_1.prisma);
    const service = new url_service_1.UrlService(repository);
    const controller = new url_controller_1.UrlController(service);
    fastify.get('/:shortCode', { schema: url_swagger_1.redirectUrlSchema }, controller.redirectUrl);
};
exports.redirectRoutes = redirectRoutes;
