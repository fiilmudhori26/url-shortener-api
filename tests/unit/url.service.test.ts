import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UrlService } from '../../src/modules/url/url.service';
import { UrlRepository } from '../../src/modules/url/url.repository';
import { PrismaClient } from '@prisma/client';

// Mock UrlRepository
vi.mock('../../src/modules/url/url.repository');

describe('UrlService', () => {
  let urlService: UrlService;
  let mockUrlRepository: vi.Mocked<UrlRepository>;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // We pass a dummy PrismaClient because we mocked the whole repository class anyway
    const prismaDummy = {} as PrismaClient;
    mockUrlRepository = new UrlRepository(prismaDummy) as vi.Mocked<UrlRepository>;
    urlService = new UrlService(mockUrlRepository);
  });

  describe('A. createUrl()', () => {
    it('Berhasil membuat URL baru', async () => {
      mockUrlRepository.findByShortCode.mockResolvedValue(null);
      mockUrlRepository.create.mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'custom',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await urlService.createUrl({
        originalUrl: 'https://example.com',
        customAlias: 'custom',
      });

      expect(mockUrlRepository.findByShortCode).toHaveBeenCalledWith('custom');
      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        originalUrl: 'https://example.com',
        shortCode: 'custom'
      });
      expect(result.originalUrl).toBe('https://example.com');
      expect(result.shortCode).toBe('custom');
    });

    it('Gagal jika custom alias sudah digunakan', async () => {
      mockUrlRepository.findByShortCode.mockResolvedValue({
        id: '1',
        originalUrl: 'https://other.com',
        shortCode: 'custom',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(urlService.createUrl({
        originalUrl: 'https://example.com',
        customAlias: 'custom',
      })).rejects.toThrow('Custom alias sudah digunakan');
    });
  });

  describe('B. getUrls()', () => {
    it('Berhasil mengambil data, pagination berjalan, search berjalan', async () => {
      mockUrlRepository.findAll.mockResolvedValue([
        1,
        [{
          id: '1',
          originalUrl: 'https://example.com',
          shortCode: 'custom',
          clickCount: 0,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      ]);

      const result = await urlService.getUrls({ page: 2, limit: 5, search: 'test' });

      expect(mockUrlRepository.findAll).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        search: 'test'
      });
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(5);
    });
  });

  describe('C. getUrlById()', () => {
    it('Berhasil menemukan URL', async () => {
      mockUrlRepository.findById.mockResolvedValue({
        id: 'uuid-1',
        originalUrl: 'https://example.com',
        shortCode: 'custom',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await urlService.getUrlById('uuid-1');

      expect(mockUrlRepository.findById).toHaveBeenCalledWith('uuid-1');
      expect(result.id).toBe('uuid-1');
    });

    it('Return error jika tidak ditemukan', async () => {
      mockUrlRepository.findById.mockResolvedValue(null);

      await expect(urlService.getUrlById('uuid-unknown')).rejects.toThrow('Data URL tidak ditemukan');
    });
  });

  describe('D. updateUrl()', () => {
    it('Berhasil update originalUrl', async () => {
      mockUrlRepository.findById.mockResolvedValue({
        id: '1',
        originalUrl: 'https://old.com',
        shortCode: 'custom',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockUrlRepository.update.mockResolvedValue({
        id: '1',
        originalUrl: 'https://new.com',
        shortCode: 'custom',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await urlService.updateUrl('1', { originalUrl: 'https://new.com' });

      expect(mockUrlRepository.update).toHaveBeenCalledWith('1', { originalUrl: 'https://new.com' });
      expect(result.originalUrl).toBe('https://new.com');
    });

    it('Berhasil update customAlias', async () => {
      mockUrlRepository.findById.mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'oldAlias',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockUrlRepository.findByShortCode.mockResolvedValue(null);
      mockUrlRepository.update.mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'newAlias',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await urlService.updateUrl('1', { customAlias: 'newAlias' });

      expect(mockUrlRepository.findByShortCode).toHaveBeenCalledWith('newAlias');
      expect(mockUrlRepository.update).toHaveBeenCalledWith('1', { shortCode: 'newAlias' });
      expect(result.shortCode).toBe('newAlias');
    });

    it('Gagal jika alias sudah dipakai', async () => {
      mockUrlRepository.findById.mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'oldAlias',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockUrlRepository.findByShortCode.mockResolvedValue({
        id: '2',
        originalUrl: 'https://other.com',
        shortCode: 'usedAlias',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(urlService.updateUrl('1', { customAlias: 'usedAlias' }))
        .rejects.toThrow('Custom alias sudah digunakan');
    });
  });

  describe('E. deleteUrl()', () => {
    it('Berhasil soft delete', async () => {
      mockUrlRepository.findById.mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'custom',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await urlService.deleteUrl('1');

      expect(mockUrlRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('Gagal jika id tidak ditemukan', async () => {
      mockUrlRepository.findById.mockResolvedValue(null);

      await expect(urlService.deleteUrl('1')).rejects.toThrow('Data URL tidak ditemukan');
    });
  });

  describe('F. redirectUrl() (di service bernama getUrlByShortCode)', () => {
    it('Berhasil mengembalikan originalUrl dan clickCount bertambah', async () => {
      mockUrlRepository.findByShortCode.mockResolvedValue({
        id: '1',
        originalUrl: 'https://google.com',
        shortCode: 'ggl',
        clickCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await urlService.getUrlByShortCode('ggl');

      expect(mockUrlRepository.incrementClickCount).toHaveBeenCalledWith('1');
      expect(result).toBe('https://google.com');
    });

    it('Gagal jika shortCode tidak ditemukan atau sudah dihapus', async () => {
      mockUrlRepository.findByShortCode.mockResolvedValue(null);

      await expect(urlService.getUrlByShortCode('unknown')).rejects.toThrow('URL tidak ditemukan');
    });
  });

  describe('G. getStats()', () => {
    it('Berhasil mengambil statistik', async () => {
      mockUrlRepository.getStats.mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'custom',
        clickCount: 15,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await urlService.getUrlStats('1');

      expect(mockUrlRepository.getStats).toHaveBeenCalledWith('1');
      expect(result.clickCount).toBe(15);
    });

    it('Return 404/Error jika id tidak ditemukan', async () => {
      mockUrlRepository.getStats.mockResolvedValue(null);

      await expect(urlService.getUrlStats('unknown')).rejects.toThrow('Data URL tidak ditemukan');
    });
  });
});
