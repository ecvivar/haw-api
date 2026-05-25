import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

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
        url: config.api.url,
        description: 'Development server',
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
  apis: [process.env.NODE_ENV === 'production' ? './dist/routes/*.js' : './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
