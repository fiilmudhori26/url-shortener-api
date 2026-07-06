"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectUrlSchema = exports.getUrlStatsSchema = exports.deleteUrlSchema = exports.updateUrlSchema = exports.getUrlByIdSchema = exports.getUrlsSchema = exports.createUrlSchema = void 0;
exports.createUrlSchema = {
    description: 'Membuat URL pendek baru',
    tags: ['URL'],
    body: {
        type: 'object',
        required: ['originalUrl'],
        properties: {
            originalUrl: { type: 'string', format: 'uri' },
            customAlias: { type: 'string' }
        }
    },
    response: {
        201: {
            description: 'Berhasil',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        originalUrl: { type: 'string' },
                        shortCode: { type: 'string' },
                        shortUrl: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        400: {
            description: 'Validasi Gagal',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.getUrlsSchema = {
    description: 'Mengambil daftar URL dengan paginasi dan pencarian',
    tags: ['URL'],
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            search: { type: 'string' }
        }
    },
    response: {
        200: {
            description: 'Berhasil',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            originalUrl: { type: 'string' },
                            shortCode: { type: 'string' },
                            clickCount: { type: 'number' },
                            isDeleted: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.getUrlByIdSchema = {
    description: 'Mengambil detail URL berdasarkan ID',
    tags: ['URL'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    response: {
        200: {
            description: 'Berhasil',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        originalUrl: { type: 'string' },
                        shortCode: { type: 'string' },
                        clickCount: { type: 'number' },
                        isDeleted: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        400: {
            description: 'Validasi Gagal',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        404: {
            description: 'Tidak Ditemukan',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.updateUrlSchema = {
    description: 'Memperbarui data original URL atau custom alias',
    tags: ['URL'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    body: {
        type: 'object',
        properties: {
            originalUrl: { type: 'string', format: 'uri' },
            customAlias: { type: 'string' }
        }
    },
    response: {
        200: {
            description: 'Berhasil',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        originalUrl: { type: 'string' },
                        shortCode: { type: 'string' },
                        clickCount: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        400: {
            description: 'Validasi Gagal',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        404: {
            description: 'Tidak Ditemukan',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        409: {
            description: 'Conflict',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.deleteUrlSchema = {
    description: 'Soft delete URL',
    tags: ['URL'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    response: {
        200: {
            description: 'Berhasil',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        400: {
            description: 'Validasi Gagal',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        404: {
            description: 'Tidak Ditemukan',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.getUrlStatsSchema = {
    description: 'Mengambil statistik dari URL yang belum dihapus',
    tags: ['URL'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    response: {
        200: {
            description: 'Berhasil',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        originalUrl: { type: 'string' },
                        shortCode: { type: 'string' },
                        clickCount: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        isDeleted: { type: 'boolean' }
                    }
                }
            }
        },
        400: {
            description: 'Validasi Gagal',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        404: {
            description: 'Tidak Ditemukan',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.redirectUrlSchema = {
    description: 'Redirect ke original URL dan menambahkan clickCount',
    tags: ['Redirect'],
    params: {
        type: 'object',
        required: ['shortCode'],
        properties: {
            shortCode: { type: 'string' }
        }
    },
    response: {
        302: {
            description: 'Redirect Found',
            type: 'null'
        },
        404: {
            description: 'Tidak Ditemukan',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal Server Error',
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
