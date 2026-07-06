"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const url_routes_1 = require("./modules/url/url.routes");
const buildApp = async () => {
    const app = (0, fastify_1.default)({
        logger: {
            transport: {
                target: 'pino-pretty',
            },
        },
    });
    // Register Middlewares
    await app.register(cors_1.default);
    await app.register(helmet_1.default);
    await app.register(rate_limit_1.default, {
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
    app.register(url_routes_1.urlRoutes, { prefix: '/urls' });
    app.register(url_routes_1.redirectRoutes);
    return app;
};
exports.buildApp = buildApp;
