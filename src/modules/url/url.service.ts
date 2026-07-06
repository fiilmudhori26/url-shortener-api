import { UrlRepository } from './url.repository';
import { CreateUrlDTO, GetUrlsQueryDTO } from './url.types';

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

  async getUrlByShortCode() {}

  async updateUrl() {}

  async deleteUrl() {}

  async getUrlStats() {}
}
