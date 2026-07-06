const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'postman');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const env = {
  id: "18cfc2cd-5b8d-4f05-8968-3860bb4a45a3",
  name: "Local",
  values: [
    {
      key: "base_url",
      value: "http://localhost:3000",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment",
  _postman_exported_using: "Postman/10.12.0"
};

fs.writeFileSync(path.join(dir, 'local.postman_environment.json'), JSON.stringify(env, null, 2));

const collection = {
  info: {
    name: "URL Shortener API",
    description: "API Documentation for URL Shortener project",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    {
      name: "POST /urls (Create URL)",
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: "{\n  \"originalUrl\": \"https://example.com\",\n  \"customAlias\": \"contoh\"\n}"
        },
        url: {
          raw: "{{base_url}}/urls",
          host: ["{{base_url}}"],
          path: ["urls"]
        }
      },
      response: [
        {
          name: "Success (201)",
          originalRequest: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: { mode: "raw", raw: "{\n  \"originalUrl\": \"https://example.com\",\n  \"customAlias\": \"contoh\"\n}" },
            url: { raw: "{{base_url}}/urls", host: ["{{base_url}}"], path: ["urls"] }
          },
          status: "Created",
          code: 201,
          body: "{\n  \"success\": true,\n  \"message\": \"URL berhasil diperpendek\",\n  \"data\": {\n    \"id\": \"uuid-123\",\n    \"originalUrl\": \"https://example.com\",\n    \"shortCode\": \"contoh\",\n    \"shortUrl\": \"http://localhost:3000/contoh\",\n    \"createdAt\": \"2023-01-01T00:00:00.000Z\"\n  }\n}"
        },
        {
          name: "Error - Validation (400)",
          originalRequest: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: { mode: "raw", raw: "{}" },
            url: { raw: "{{base_url}}/urls", host: ["{{base_url}}"], path: ["urls"] }
          },
          status: "Bad Request",
          code: 400,
          body: "{\n  \"success\": false,\n  \"message\": \"Validasi gagal\",\n  \"errors\": [\n    {\n      \"field\": \"originalUrl\",\n      \"message\": \"Required\"\n    }\n  ]\n}"
        },
        {
          name: "Error - Conflict (400/409)",
          originalRequest: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: { mode: "raw", raw: "{\n  \"originalUrl\": \"https://example.com\",\n  \"customAlias\": \"used\"\n}" },
            url: { raw: "{{base_url}}/urls", host: ["{{base_url}}"], path: ["urls"] }
          },
          status: "Bad Request",
          code: 400,
          body: "{\n  \"success\": false,\n  \"message\": \"Custom alias sudah digunakan\"\n}"
        }
      ]
    },
    {
      name: "GET /urls (List URLs)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{base_url}}/urls?page=1&limit=10&search=contoh",
          host: ["{{base_url}}"],
          path: ["urls"],
          query: [
            { key: "page", value: "1" },
            { key: "limit", value: "10" },
            { key: "search", value: "contoh" }
          ]
        }
      },
      response: [
        {
          name: "Success (200)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/urls", host: ["{{base_url}}"], path: ["urls"] }
          },
          status: "OK",
          code: 200,
          body: "{\n  \"success\": true,\n  \"message\": \"Data URL berhasil diambil\",\n  \"data\": [\n    {\n      \"id\": \"uuid-123\",\n      \"originalUrl\": \"https://example.com\",\n      \"shortCode\": \"contoh\",\n      \"clickCount\": 0,\n      \"isDeleted\": false,\n      \"createdAt\": \"2023-01-01T00:00:00.000Z\",\n      \"updatedAt\": \"2023-01-01T00:00:00.000Z\"\n    }\n  ],\n  \"pagination\": {\n    \"page\": 1,\n    \"limit\": 10,\n    \"total\": 1,\n    \"totalPages\": 1\n  }\n}"
        }
      ]
    },
    {
      name: "GET /urls/:id (Get URL by ID)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{base_url}}/urls/uuid-123",
          host: ["{{base_url}}"],
          path: ["urls", "uuid-123"]
        }
      },
      response: [
        {
          name: "Success (200)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/urls/uuid-123", host: ["{{base_url}}"], path: ["urls", "uuid-123"] }
          },
          status: "OK",
          code: 200,
          body: "{\n  \"success\": true,\n  \"message\": \"Data URL berhasil diambil\",\n  \"data\": {\n    \"id\": \"uuid-123\",\n    \"originalUrl\": \"https://example.com\",\n    \"shortCode\": \"contoh\",\n    \"clickCount\": 0,\n    \"isDeleted\": false,\n    \"createdAt\": \"2023-01-01T00:00:00.000Z\",\n    \"updatedAt\": \"2023-01-01T00:00:00.000Z\"\n  }\n}"
        },
        {
          name: "Error - Not Found (404)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/urls/unknown", host: ["{{base_url}}"], path: ["urls", "unknown"] }
          },
          status: "Not Found",
          code: 404,
          body: "{\n  \"success\": false,\n  \"message\": \"Data URL tidak ditemukan\"\n}"
        }
      ]
    },
    {
      name: "PATCH /urls/:id (Update URL)",
      request: {
        method: "PATCH",
        header: [
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: "{\n  \"originalUrl\": \"https://openai.com\",\n  \"customAlias\": \"openai\"\n}"
        },
        url: {
          raw: "{{base_url}}/urls/uuid-123",
          host: ["{{base_url}}"],
          path: ["urls", "uuid-123"]
        }
      },
      response: [
        {
          name: "Success (200)",
          originalRequest: {
            method: "PATCH",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: { mode: "raw", raw: "{\n  \"customAlias\": \"openai\"\n}" },
            url: { raw: "{{base_url}}/urls/uuid-123", host: ["{{base_url}}"], path: ["urls", "uuid-123"] }
          },
          status: "OK",
          code: 200,
          body: "{\n  \"success\": true,\n  \"message\": \"URL berhasil diperbarui\",\n  \"data\": {\n    \"id\": \"uuid-123\",\n    \"originalUrl\": \"https://openai.com\",\n    \"shortCode\": \"openai\",\n    \"clickCount\": 0,\n    \"createdAt\": \"2023-01-01T00:00:00.000Z\",\n    \"updatedAt\": \"2023-01-01T00:00:00.000Z\"\n  }\n}"
        },
        {
          name: "Error - Conflict (409)",
          originalRequest: {
            method: "PATCH",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: { mode: "raw", raw: "{\n  \"customAlias\": \"used\"\n}" },
            url: { raw: "{{base_url}}/urls/uuid-123", host: ["{{base_url}}"], path: ["urls", "uuid-123"] }
          },
          status: "Conflict",
          code: 409,
          body: "{\n  \"success\": false,\n  \"message\": \"Custom alias sudah digunakan\"\n}"
        },
        {
          name: "Error - Not Found (404)",
          originalRequest: {
            method: "PATCH",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: { mode: "raw", raw: "{\n  \"customAlias\": \"openai\"\n}" },
            url: { raw: "{{base_url}}/urls/unknown", host: ["{{base_url}}"], path: ["urls", "unknown"] }
          },
          status: "Not Found",
          code: 404,
          body: "{\n  \"success\": false,\n  \"message\": \"Data URL tidak ditemukan\"\n}"
        }
      ]
    },
    {
      name: "DELETE /urls/:id (Soft Delete URL)",
      request: {
        method: "DELETE",
        header: [],
        url: {
          raw: "{{base_url}}/urls/uuid-123",
          host: ["{{base_url}}"],
          path: ["urls", "uuid-123"]
        }
      },
      response: [
        {
          name: "Success (200)",
          originalRequest: {
            method: "DELETE",
            header: [],
            url: { raw: "{{base_url}}/urls/uuid-123", host: ["{{base_url}}"], path: ["urls", "uuid-123"] }
          },
          status: "OK",
          code: 200,
          body: "{\n  \"success\": true,\n  \"message\": \"URL berhasil dihapus\"\n}"
        },
        {
          name: "Error - Not Found (404)",
          originalRequest: {
            method: "DELETE",
            header: [],
            url: { raw: "{{base_url}}/urls/unknown", host: ["{{base_url}}"], path: ["urls", "unknown"] }
          },
          status: "Not Found",
          code: 404,
          body: "{\n  \"success\": false,\n  \"message\": \"Data URL tidak ditemukan\"\n}"
        }
      ]
    },
    {
      name: "GET /:shortCode (Redirect)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{base_url}}/contoh",
          host: ["{{base_url}}"],
          path: ["contoh"]
        }
      },
      response: [
        {
          name: "Success - Redirect (302)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/contoh", host: ["{{base_url}}"], path: ["contoh"] }
          },
          status: "Found",
          code: 302,
          body: ""
        },
        {
          name: "Error - Not Found (404)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/unknown", host: ["{{base_url}}"], path: ["unknown"] }
          },
          status: "Not Found",
          code: 404,
          body: "{\n  \"success\": false,\n  \"message\": \"URL tidak ditemukan\"\n}"
        }
      ]
    },
    {
      name: "GET /urls/:id/stats (URL Stats)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{base_url}}/urls/uuid-123/stats",
          host: ["{{base_url}}"],
          path: ["urls", "uuid-123", "stats"]
        }
      },
      response: [
        {
          name: "Success (200)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/urls/uuid-123/stats", host: ["{{base_url}}"], path: ["urls", "uuid-123", "stats"] }
          },
          status: "OK",
          code: 200,
          body: "{\n  \"success\": true,\n  \"message\": \"Statistik URL berhasil diambil\",\n  \"data\": {\n    \"id\": \"uuid-123\",\n    \"originalUrl\": \"https://example.com\",\n    \"shortCode\": \"contoh\",\n    \"clickCount\": 10,\n    \"createdAt\": \"2023-01-01T00:00:00.000Z\",\n    \"updatedAt\": \"2023-01-01T00:00:00.000Z\",\n    \"isDeleted\": false\n  }\n}"
        },
        {
          name: "Error - Not Found (404)",
          originalRequest: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/urls/unknown/stats", host: ["{{base_url}}"], path: ["urls", "unknown", "stats"] }
          },
          status: "Not Found",
          code: 404,
          body: "{\n  \"success\": false,\n  \"message\": \"Data URL tidak ditemukan\"\n}"
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(dir, 'url-shortener-api.postman_collection.json'), JSON.stringify(collection, null, 2));

console.log('Postman collection and environment generated.');
