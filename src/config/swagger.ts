import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.API_URL || 'http://localhost:8080';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.api.title,
      description: config.api.description,
      version: config.api.version,
      license: {
        name: config.api.license,
        url: config.api.licenseUrl,
      },
    },
    servers: [
      {
        url: vercelUrl,
        description: process.env.VERCEL_URL ? 'Vercel production' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: process.env.VERCEL || process.env.NODE_ENV === 'production'
    ? ['./dist/routes/*.js']
    : ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
