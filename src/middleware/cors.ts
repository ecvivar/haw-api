import cors from 'cors';

export const corsMiddleware = cors({
  origin: '*',
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
