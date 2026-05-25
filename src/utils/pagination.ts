import { config } from '../config';
import { PaginationHeaders } from '../types';

export interface PageResult<T> {
  data: T[];
  pagination: PaginationHeaders;
}

export function parsePagination(query: { page?: string; size?: string }): {
  skip: number;
  take: number;
  page: number;
  size: number;
} {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  let size = parseInt(query.size || String(config.pagination.defaultPageSize), 10);
  size = Math.min(Math.max(1, size), config.pagination.maxPageSize);
  const skip = (page - 1) * size;

  return { skip, take: size, page, size };
}

export function buildPaginationHeaders(
  total: number,
  page: number,
  size: number,
): PaginationHeaders {
  return {
    'X-Pagination-Page-Index': page,
    'X-Pagination-Page-Size': size,
    'X-Pagination-Page-Total': Math.ceil(total / size) || 0,
    'X-Pagination-Item-Total': total,
  };
}
