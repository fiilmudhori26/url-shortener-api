"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlParamsSchema = exports.updateUrlSchema = exports.getUrlsQuerySchema = exports.createUrlSchema = void 0;
const zod_1 = require("zod");
exports.createUrlSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().url('Format URL tidak valid'),
    customAlias: zod_1.z.string().min(3, 'Alias minimal 3 karakter').max(10, 'Alias maksimal 10 karakter').optional(),
});
exports.getUrlsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1, 'Page minimal 1').optional().default(1),
    limit: zod_1.z.coerce.number().min(1, 'Limit minimal 1').optional().default(10),
    search: zod_1.z.string().optional(),
});
exports.updateUrlSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().url('Format URL tidak valid').optional(),
    customAlias: zod_1.z.string().min(3, 'Alias minimal 3 karakter').max(20, 'Alias maksimal 20 karakter').optional(),
}).refine(data => data.originalUrl !== undefined || data.customAlias !== undefined, {
    message: 'Minimal salah satu field (originalUrl atau customAlias) harus dikirim',
});
exports.urlParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Format ID tidak valid'),
});
