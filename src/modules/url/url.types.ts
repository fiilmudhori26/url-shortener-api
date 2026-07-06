import { z } from 'zod';
import { createUrlSchema, getUrlsQuerySchema, updateUrlSchema, urlParamsSchema } from './url.schema';

export type CreateUrlDTO = z.infer<typeof createUrlSchema>;
export type GetUrlsQueryDTO = z.infer<typeof getUrlsQuerySchema>;
export type UrlParamsDTO = z.infer<typeof urlParamsSchema>;
export type UpdateUrlDTO = z.infer<typeof updateUrlSchema>;
export interface UrlQueryDTO {}
