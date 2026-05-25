import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),

  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hawapi',
  },

  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY || '',
    publicKey: process.env.JWT_PUBLIC_KEY || '',
    issuer: process.env.JWT_ISSUER || 'HawAPI',
    audience: process.env.JWT_AUDIENCE || 'http://localhost:8080/api/v1',
  },

  api: {
    title: process.env.API_TITLE || 'HawAPI',
    description: process.env.API_DESCRIPTION || 'A Free and Open Source API for Stranger Things.',
    version: process.env.API_VERSION || '1.2.0',
    url: process.env.API_URL || 'http://localhost:8080',
    path: process.env.API_PATH || '/api',
    versionPath: process.env.API_VERSION_PATH || 'v1',
    basePath: `${process.env.API_PATH || '/api'}/${process.env.API_VERSION_PATH || 'v1'}`,
    docs: `${process.env.API_URL || 'http://localhost:8080'}/docs`,
    github: 'https://github.com/HawAPI/HawAPI',
    githubHome: 'https://github.com/HawAPI',
    license: 'MIT License',
    licenseUrl: 'https://github.com/HawAPI/HawAPI/blob/main/LICENSE',
  },

  language: {
    default: process.env.DEFAULT_LANGUAGE || 'en-US',
    supported: (process.env.SUPPORTED_LANGUAGES || 'en-US,pt-BR').split(',').map(s => s.trim()),
  },

  rateLimit: {
    anonymous: parseInt(process.env.RATE_LIMIT_ANONYMOUS || '16', 10),
    basic: parseInt(process.env.RATE_LIMIT_BASIC || '20', 10),
    dev: parseInt(process.env.RATE_LIMIT_DEV || '24', 10),
    maintainer: parseInt(process.env.RATE_LIMIT_MAINTAINER || '30', 10),
    admin: parseInt(process.env.RATE_LIMIT_ADMIN || '60', 10),
    auth: parseInt(process.env.RATE_LIMIT_AUTH || '3', 10),
    authHours: parseInt(process.env.RATE_LIMIT_AUTH_HOURS || '12', 10),
  },

  pagination: {
    maxPageSize: parseInt(process.env.PAGE_MAX_SIZE || '20', 10),
    defaultPageSize: parseInt(process.env.PAGE_DEFAULT_SIZE || '10', 10),
  },

  registration: {
    enabled: process.env.ENABLE_REGISTRATION !== 'false',
  },
};
