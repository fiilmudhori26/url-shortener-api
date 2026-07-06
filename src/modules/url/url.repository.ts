import { PrismaClient, Url } from '@prisma/client';

export class UrlRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { originalUrl: string; shortCode: string }): Promise<Url> {
    return this.prisma.url.create({ data });
  }

  async findAll(params: { skip: number; take: number; search?: string }): Promise<[number, Url[]]> {
    const where: any = { isDeleted: false };
    
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

  async findById(id: string): Promise<Url | null> {
    return this.prisma.url.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.prisma.url.findUnique({ where: { shortCode } });
  }

  async update(id: string, data: Partial<{ originalUrl: string; shortCode: string }>): Promise<Url> {
    return this.prisma.url.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async incrementClickCount(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  }

  async getStats(id: string): Promise<Url | null> {
    return this.prisma.url.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  }
}
