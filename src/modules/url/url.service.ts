import { UrlRepository } from './url.repository';
import { CreateUrlDTO, GetUrlsQueryDTO, UpdateUrlDTO } from './url.types';

export class UrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  private generateRandomCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createUrl(data: CreateUrlDTO) {
    let shortCode = data.customAlias;

    if (shortCode) {
      // Periksa apakah customAlias sudah digunakan
      const existing = await this.urlRepository.findByShortCode(shortCode);
      if (existing) {
        throw new Error('Custom alias sudah digunakan');
      }
    } else {
      // Generate short code acak dan pastikan unik
      let isUnique = false;
      while (!isUnique) {
        shortCode = this.generateRandomCode(6);
        const existing = await this.urlRepository.findByShortCode(shortCode);
        if (!existing) {
          isUnique = true;
        }
      }
    }

    return this.urlRepository.create({
      originalUrl: data.originalUrl,
      shortCode: shortCode!,
    });
  }

  async getUrls(query: GetUrlsQueryDTO) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const [total, data] = await this.urlRepository.findAll({ skip, take, search });
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUrlById(id: string) {
    const url = await this.urlRepository.findById(id);
    if (!url) {
      throw new Error('Data URL tidak ditemukan');
    }
    return url;
  }

  async getUrlByShortCode(shortCode: string) {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url || url.isDeleted) {
      throw new Error('URL tidak ditemukan');
    }
    
    await this.urlRepository.incrementClickCount(url.id);
    return url.originalUrl;
  }

  async updateUrl(id: string, data: UpdateUrlDTO) {
    const existingUrl = await this.urlRepository.findById(id);
    if (!existingUrl) {
      throw new Error('Data URL tidak ditemukan');
    }

    const updateData: Partial<{ originalUrl: string; shortCode: string }> = {};

    if (data.originalUrl) {
      updateData.originalUrl = data.originalUrl;
    }

    if (data.customAlias && data.customAlias !== existingUrl.shortCode) {
      const aliasExists = await this.urlRepository.findByShortCode(data.customAlias);
      if (aliasExists) {
        throw new Error('Custom alias sudah digunakan');
      }
      updateData.shortCode = data.customAlias;
    }

    return this.urlRepository.update(id, updateData);
  }

  async deleteUrl(id: string) {
    const existingUrl = await this.urlRepository.findById(id);
    if (!existingUrl) {
      throw new Error('Data URL tidak ditemukan');
    }

    await this.urlRepository.softDelete(id);
  }

  async getUrlStats(id: string) {
    const stats = await this.urlRepository.getStats(id);
    if (!stats) {
      throw new Error('Data URL tidak ditemukan');
    }
    return stats;
  }
}
