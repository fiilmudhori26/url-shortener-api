"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlRepository = void 0;
class UrlRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.url.create({ data });
    }
    async findAll(params) {
        const where = { isDeleted: false };
        if (params.search) {
            where.OR = [
                { originalUrl: { contains: params.search } },
                { shortCode: { contains: params.search } }
            ];
        }
        return this.prisma.$transaction([
            this.prisma.url.count({ where }),
            this.prisma.url.findMany({
                where,
                skip: params.skip,
                take: params.take,
                orderBy: { createdAt: 'desc' },
            })
        ]);
    }
    async findById(id) {
        return this.prisma.url.findFirst({
            where: {
                id,
                isDeleted: false,
            },
        });
    }
    async findByShortCode(shortCode) {
        return this.prisma.url.findUnique({ where: { shortCode } });
    }
    async update(id, data) {
        return this.prisma.url.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        await this.prisma.url.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
    async incrementClickCount(id) {
        await this.prisma.url.update({
            where: { id },
            data: { clickCount: { increment: 1 } },
        });
    }
    async getStats(id) {
        return this.prisma.url.findFirst({
            where: {
                id,
                isDeleted: false,
            },
        });
    }
}
exports.UrlRepository = UrlRepository;
