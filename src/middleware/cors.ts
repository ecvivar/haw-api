import cors from 'cors';
import { config } from '../config';

export const corsMiddleware = cors({
  origin: config.cors.origin,
  credentials: true,
  exposedHeaders: [
    'X-Pagination-Page-Index',
    'X-Pagination-Page-Size',
    'X-Pagination-Page-Total',
    'X-Pagination-Item-Total',
  ],
  allowedHeaders: ['Content-Type', 'Bearer'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});
