# URL Shortener API

![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Fastify](https://img.shields.io/badge/Fastify-4-black?logo=fastify)
![Prisma](https://img.shields.io/badge/Prisma-5-1B222D?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)
[![Continuous Integration](https://github.com/fiilmudhori26/url-shortener-api/actions/workflows/ci.yml/badge.svg)](https://github.com/fiilmudhori26/url-shortener-api/actions/workflows/ci.yml)

A fast, robust, and professional REST API for shortening URLs built with Node.js, Fastify, TypeScript, Prisma, and MySQL. It features custom alias capabilities, soft deletes, click statistics, advanced schema validation, and comprehensive automated testing.

## Features

- **Create Short URL**: Convert long URLs into compact short codes.
- **Custom Alias**: Define your own personalized short codes.
- **Redirect URL**: Fast and native HTTP 302 redirection.
- **Click Statistics**: Keep track of how many times a link is accessed.
- **Soft Delete**: Safely remove URLs without dropping data from the database.
- **Pagination**: Retrieve large datasets efficiently.
- **Search**: Search capabilities by original URL or short code.
- **Validation with Zod**: Strict runtime data validation and schema checking.
- **Unit Testing**: Thoroughly tested business logic using Vitest.
- **Swagger Documentation**: Interactive API documentation generated via Fastify Swagger.
- **Postman Collection**: Ready-to-import API workspace.
- **GitHub Actions CI**: Automated continuous integration pipeline.

## Tech Stack

| Technology      | Description                     |
| --------------- | ------------------------------- |
| **Fastify**     | High-performance web framework  |
| **TypeScript**  | Static typing for JavaScript    |
| **Prisma**      | Next-generation Node.js ORM     |
| **MySQL**       | Relational Database             |
| **Zod**         | Schema declaration & validation |
| **Vitest**      | Blazing fast unit test runner   |

## Project Structure

```text
.
├── .github
│   └── workflows
│       └── ci.yml
├── postman
│   ├── local.postman_environment.json
│   └── url-shortener-api.postman_collection.json
├── prisma
│   ├── migrations/
│   └── schema.prisma
├── src
│   ├── config
│   │   ├── env.ts
│   │   └── prisma.ts
│   ├── modules
│   │   └── url
│   │       ├── url.controller.ts
│   │       ├── url.repository.ts
│   │       ├── url.routes.ts
│   │       ├── url.schema.ts
│   │       ├── url.service.ts
│   │       ├── url.swagger.ts
│   │       └── url.types.ts
│   ├── app.ts
│   └── server.ts
├── tests
│   └── unit
│       └── url.service.test.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fiilmudhori26/url-shortener-api.git
   cd url-shortener-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory based on `.env.example` and add the following variables:

```env
# Server Port
PORT=3000

# Prisma MySQL Connection String
DATABASE_URL="mysql://username:password@localhost:3306/url_shortener_db"
```

## Database Migration

Generate the Prisma Client and run migrations to create the required tables:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

## Running Project

### Development
Start the server in development mode with auto-reload:
```bash
npm run dev
```

### Production
Build and start the compiled code:
```bash
npm run build
npm start
```

## Running Tests

Run the unit tests using Vitest:
```bash
npm test
```

To see the test coverage:
```bash
npm run coverage
```

## API Documentation

This project features an interactive **Swagger** (OpenAPI v3) UI. Once the server is running, you can access the documentation at:
- **Swagger UI:** `http://localhost:3000/docs`

## Postman Collection

A complete Postman workspace is included in the `postman/` folder.
1. Open Postman.
2. Click **Import**.
3. Select `postman/url-shortener-api.postman_collection.json` and `postman/local.postman_environment.json`.
4. Ensure the **Local** environment is selected in the top right corner before firing requests.

## API Endpoints

| Method   | Endpoint                  | Description                                      |
| -------- | ------------------------- | ------------------------------------------------ |
| `POST`   | `/urls`                   | Create a new short URL (Custom Alias optional)   |
| `GET`    | `/urls`                   | Get all active URLs (Supports pagination/search) |
| `GET`    | `/urls/:id`               | Get detail of a specific URL by ID               |
| `PATCH`  | `/urls/:id`               | Update the original URL or custom alias          |
| `DELETE` | `/urls/:id`               | Soft delete a URL                                |
| `GET`    | `/:shortCode`             | Redirects to the original URL (Increments clicks)|
| `GET`    | `/urls/:id/stats`         | Get click statistics for a specific URL          |

## Example Response

### Success Response
```json
{
  "success": true,
  "message": "URL berhasil diperpendek",
  "data": {
    "id": "8f3f05b8-e70f-4d34-b3a0-6f85c0f2c15d",
    "originalUrl": "https://google.com",
    "shortCode": "ggl",
    "shortUrl": "http://localhost:3000/ggl",
    "createdAt": "2026-07-06T03:22:15.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validasi parameter gagal",
  "errors": [
    {
      "field": "originalUrl",
      "message": "Format URL tidak valid"
    }
  ]
}
```

## GitHub Actions

This project utilizes **GitHub Actions** for Continuous Integration (CI). The workflow (`.github/workflows/ci.yml`) is triggered on every `push` or `pull_request` to the `main` branch. 

The CI pipeline automatically performs the following steps:
1. **Checkout code:** Pulls the latest commits.
2. **Setup Node.js:** Installs Node.js version 22 and caches npm modules.
3. **Install Dependencies:** Runs `npm install`.
4. **Prisma Generate:** Prepares the Prisma Client required for type safety and database operations.
5. **Build:** Compiles TypeScript into JavaScript (`npm run build`).
6. **Test:** Executes all Vitest unit tests (`npm test`). If any test fails, the workflow immediately fails to prevent broken code from being integrated.

## Future Improvements

- **Authentication:** Implement JWT-based auth to secure management endpoints.
- **Rate Limiting per User:** Strict usage limitations tied to individual user accounts to prevent abuse.
- **Analytics Dashboard:** Graphical analytics representing traffic and click locations.
- **QR Code Generator:** Automatically provide scannable QR codes for every generated short link.
- **Expiring URL:** Configurable expiration date and time for temporary links.

## Author

- **fiilmudhori26** - [GitHub](https://github.com/fiilmudhori26)
