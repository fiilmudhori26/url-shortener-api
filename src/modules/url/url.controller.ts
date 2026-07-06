import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from './url.service';
import { createUrlSchema, getUrlsQuerySchema, urlParamsSchema, updateUrlSchema } from './url.schema';
import { ZodError } from 'zod';

export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  createUrl = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 0. Pastikan body tidak undefined (misal karena lupa header Content-Type di Postman)
      if (!request.body) {
        return reply.code(400).send({
          success: false,
          message: 'Request body kosong atau Content-Type bukan application/json',
        });
      }

      // 1. Validasi Body dengan Zod
      const parsedBody = createUrlSchema.parse(request.body);
      
      // 2. Panggil Service
      const url = await this.urlService.createUrl(parsedBody);
      
      // 3. Return Response Sukses
      return reply.code(201).send({
        success: true,
        message: 'URL berhasil diperpendek',
        data: {
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${request.protocol}://${request.hostname}/${url.shortCode}`,
          createdAt: url.createdAt,
        }
      });
    } catch (error) {
      // 4. Error Handling
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validasi gagal',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
        });
      }
      
      if (error instanceof Error && error.message === 'Custom alias sudah digunakan') {
        return reply.code(400).send({
          success: false,
          message: error.message,
        });
      }

      // Fallback internal server error
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  getUrls = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Validasi Query Parameter
      const query = getUrlsQuerySchema.parse(request.query);

      // 2. Panggil Service
      const result = await this.urlService.getUrls(query);

      // 3. Return Response
      return reply.code(200).send({
        success: true,
        message: 'Data URL berhasil diambil',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validasi query gagal',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  getUrlById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Validasi Parameter ID
      const { id } = urlParamsSchema.parse(request.params);

      // 2. Panggil Service
      const url = await this.urlService.getUrlById(id);

      // 3. Return Response
      return reply.code(200).send({
        success: true,
        message: 'Data URL berhasil diambil',
        data: url,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validasi parameter gagal',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
        });
      }

      if (error instanceof Error && error.message === 'Data URL tidak ditemukan') {
        return reply.code(404).send({
          success: false,
          message: error.message,
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  redirectUrl = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { shortCode } = request.params as { shortCode: string };
      if (!shortCode) {
         return reply.code(400).send({ success: false, message: 'shortCode tidak valid' });
      }

      const originalUrl = await this.urlService.getUrlByShortCode(shortCode);

      return reply.redirect(302, originalUrl);
    } catch (error) {
      if (error instanceof Error && error.message === 'URL tidak ditemukan') {
        return reply.code(404).send({
          success: false,
          message: error.message,
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
      });
    }
  }

  updateUrl = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.body || Object.keys(request.body as object).length === 0) {
        return reply.code(400).send({
          success: false,
          message: 'Request body kosong',
        });
      }

      const { id } = urlParamsSchema.parse(request.params);
      const parsedBody = updateUrlSchema.parse(request.body);

      const url = await this.urlService.updateUrl(id, parsedBody);

      return reply.code(200).send({
        success: true,
        message: 'URL berhasil diperbarui',
        data: {
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          clickCount: url.clickCount,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validasi gagal',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Data URL tidak ditemukan') {
          return reply.code(404).send({
            success: false,
            message: error.message,
          });
        }
        if (error.message === 'Custom alias sudah digunakan') {
          return reply.code(409).send({
            success: false,
            message: error.message,
          });
        }
      }

      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  deleteUrl = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = urlParamsSchema.parse(request.params);

      await this.urlService.deleteUrl(id);

      return reply.code(200).send({
        success: true,
        message: 'URL berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validasi parameter gagal',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
        });
      }

      if (error instanceof Error && error.message === 'Data URL tidak ditemukan') {
        return reply.code(404).send({
          success: false,
          message: error.message,
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  getUrlStats = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = urlParamsSchema.parse(request.params);

      const stats = await this.urlService.getUrlStats(id);

      return reply.code(200).send({
        success: true,
        message: 'Statistik URL berhasil diambil',
        data: {
          id: stats.id,
          originalUrl: stats.originalUrl,
          shortCode: stats.shortCode,
          clickCount: stats.clickCount,
          createdAt: stats.createdAt,
          updatedAt: stats.updatedAt,
          isDeleted: stats.isDeleted,
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validasi parameter gagal',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
        });
      }

      if (error instanceof Error && error.message === 'Data URL tidak ditemukan') {
        return reply.code(404).send({
          success: false,
          message: error.message,
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}
