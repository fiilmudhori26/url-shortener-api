import { z } from 'zod';
import { createUrlSchema, getUrlsQuerySchema, urlParamsSchema } from './url.schema';

export type CreateUrlDTO = z.infer<typeof createUrlSchema>;
export type GetUrlsQueryDTO = z.infer<typeof getUrlsQuerySchema>;
export type UrlParamsDTO = z.infer<typeof urlParamsSchema>;
export interface UpdateUrlDTO {}
export interface UrlQueryDTO {}
