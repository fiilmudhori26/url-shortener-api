import { z } from 'zod';

export const createUrlSchema = z.object({
  originalUrl: z.string().url('Format URL tidak valid'),
  customAlias: z.string().min(3, 'Alias minimal 3 karakter').max(10, 'Alias maksimal 10 karakter').optional(),
});

export const getUrlsQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page minimal 1').optional().default(1),
  limit: z.coerce.number().min(1, 'Limit minimal 1').optional().default(10),
  search: z.string().optional(),
});

export const updateUrlSchema = z.object({
  originalUrl: z.string().url('Format URL tidak valid').optional(),
  customAlias: z.string().min(3, 'Alias minimal 3 karakter').max(20, 'Alias maksimal 20 karakter').optional(),
}).refine(data => data.originalUrl !== undefined || data.customAlias !== undefined, {
  message: 'Minimal salah satu field (originalUrl atau customAlias) harus dikirim',
});

export const urlParamsSchema = z.object({
  id: z.string().uuid('Format ID tidak valid'),
});
