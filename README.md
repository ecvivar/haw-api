<div align="center">

<br>

# HawAPI

### A Free and Open Source API for Stranger Things

<br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/76869974/213164214-0d304263-3f40-44fb-827d-dcd21bb0f2ae.png"/>
</p>

<br>

![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br>

[![E2E Tests](https://github.com/HawAPI/HawAPI/actions/workflows/e2e.yml/badge.svg)](https://github.com/HawAPI/HawAPI/actions/workflows/e2e.yml)
[![Lint & Typecheck](https://github.com/HawAPI/HawAPI/actions/workflows/testing.yml/badge.svg)](https://github.com/HawAPI/HawAPI/actions/workflows/testing.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/HawAPI/HawAPI/blob/main/docs/CONTRIBUTING.md)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## About

**HawAPI** provides RESTful data from the Netflix show *Stranger Things* — characters, actors, episodes, locations, games, soundtracks, and more. All entities include translations in multiple languages.

Built with **Express** (TypeScript) + **Prisma** + **PostgreSQL** (Neon), and served via JSON over a RESTful API. A **Next.js** frontend is included for authentication and data exploration.

The API is deployed on **Vercel** as a serverless function. All `GET` endpoints are public; write operations require JWT authentication with role-based access.

## Dataset

| Entity      | Records  | Translations      |
|:------------|:--------:|:-----------------:|
| Characters  | 34       | —                 |
| Actors      | 34       | —                 |
| Episodes    | 34       | en, pt-BR, es, fr |
| Seasons     | 5        | en, pt-BR, es, fr |
| Locations   | 22       | en, pt-BR, es, fr |
| Games       | 3        | en, pt-BR, es, fr |
| Soundtracks | 74       | —                 |

## Tech Stack

| Layer        | Technology                                     |
|:-------------|:-----------------------------------------------|
| **Backend**  | Express + TypeScript + Prisma ORM              |
| **Database** | PostgreSQL via Neon (serverless)               |
| **Auth**     | JWT RS256 (asymmetric), bcryptjs               |
| **Frontend** | Next.js 14 (Pages Router) + Tailwind CSS       |
| **API Docs** | Swagger (OpenAPI 3.0)                          |
| **Deploy**   | Vercel (serverless functions)                  |

## API Endpoints

All `GET` endpoints are **public**. `POST`, `PATCH`, `DELETE` require JWT authentication with `ADMIN` or `MAINTAINER` role.

| Resource                      | Endpoints                                        |
|:------------------------------|:-------------------------------------------------|
| **Auth**                      | `POST /api/v1/auth/register`, `/authenticate`    |
| **Characters**                | `GET /api/v1/characters`, `/characters/:uuid`    |
| **Actors**                    | `GET /api/v1/actors`, `/actors/:uuid`, `/actors/:uuid/socials` |
| **Episodes**                  | `GET /api/v1/episodes`, `/episodes/:uuid`, `/episodes/:uuid/translations` |
| **Seasons**                   | `GET /api/v1/seasons`, `/seasons/:uuid`          |
| **Locations**                 | `GET /api/v1/locations`, `/locations/:uuid`      |
| **Games**                     | `GET /api/v1/games`, `/games/:uuid`              |
| **Soundtracks**               | `GET /api/v1/soundtracks`, `/soundtracks/:uuid`  |
| **Overview**                  | `GET /api/v1/overview`, `/overview/translations/:language` |
| **Random**                    | `/{resource}/random` on all entities             |
| **Health**                    | `GET /api/ping`, `/api/health`                   |
| **Docs**                      | `GET /api-docs/v3/openapi.json`                  |

Full documentation available at [Swagger UI](/docs).

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL instance (or [Neon](https://neon.tech) free tier)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/HawAPI/HawAPI.git
cd HawAPI

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT keys

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database
npx prisma db push

# 6. Seed data
npm run prisma:seed

# 7. Start development server
npm run dev
```

The API will be available at `http://localhost:3000`.

### JWT Keys

Generate RS256 key pair for authentication:

```bash
node -e "
const crypto = require('crypto');
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
});
console.log('Private:\\n' + privateKey);
console.log('Public:\\n' + publicKey);
"
```

Copy the output lines (with `\n`) into `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` in `.env`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL
npm run dev
```

The frontend will be available at `http://localhost:3001`.

### Scripts

| Script               | Description                          |
|:---------------------|:-------------------------------------|
| `npm run dev`        | Start backend in watch mode          |
| `npm run dev:all`    | Start backend + frontend concurrently |
| `npm run build`      | Compile TypeScript                   |
| `npm run lint`       | Lint source code                     |
| `npm run typecheck`  | Type-check without emitting          |
| `npm run prisma:seed`| Seed database with show data         |
| `npm run test`       | Run unit/integration tests           |

## Project Structure

```
HawAPI/
├── api/              # Vercel serverless handler
├── frontend/         # Next.js application
│   ├── components/   # UI components
│   ├── context/      # Auth context
│   ├── pages/        # Routes
│   ├── services/     # API client (axios)
│   └── styles/       # Global CSS
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed/         # Seed data (JSON) + loader
├── src/
│   ├── config/       # App configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/    # Auth, CORS, rate limiting
│   ├── routes/       # Route definitions
│   ├── services/     # Business logic
│   ├── types/        # TypeScript interfaces
│   └── utils/        # Prisma client, helpers
├── .github/
│   └── workflows/    # CI/CD pipelines
├── vercel.json       # Vercel deployment config
└── package.json
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

- Report bugs or suggest features via [issues](https://github.com/HawAPI/HawAPI/issues)
- Submit pull requests for review

## License

HawAPI is licensed under the [MIT License](LICENSE).
