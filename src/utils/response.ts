import { Response } from 'express';
import { PaginationHeaders } from '../types';

export function setPaginationHeaders(res: Response, pagination: PaginationHeaders): void {
  res.set('X-Pagination-Page-Index', String(pagination['X-Pagination-Page-Index']));
  res.set('X-Pagination-Page-Size', String(pagination['X-Pagination-Page-Size']));
  res.set('X-Pagination-Page-Total', String(pagination['X-Pagination-Page-Total']));
  res.set('X-Pagination-Item-Total', String(pagination['X-Pagination-Item-Total']));
}

export function setContentLanguage(res: Response, language: string): void {
  if (language) {
    res.set('Content-Language', language);
  }
}
