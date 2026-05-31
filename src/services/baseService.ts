import prisma from '../utils/prisma';
import { ItemNotFoundException } from '../utils/errors';
import { parsePagination, buildPaginationHeaders } from '../utils/pagination';
import { FilterMapping, buildRawWhereConditions } from '../utils/filters';

export interface FindAllParams {
  page?: string;
  size?: string;
  language?: string;
  [key: string]: string | undefined;
}

export interface FindAllResult<T> {
  data: T[];
  pagination: {
    'X-Pagination-Page-Index': number;
    'X-Pagination-Page-Size': number;
    'X-Pagination-Page-Total': number;
    'X-Pagination-Item-Total': number;
  };
}

export abstract class BaseService<T, D> {
  protected abstract modelName: string;
  protected abstract basePath: string;
  protected abstract allowedFilters: FilterMapping[];

  async findAll(
    params: FindAllParams,
  ): Promise<FindAllResult<D>> {
    const { skip, take, page, size } = parsePagination(params);

    const { text: whereText, values: whereValues } = buildRawWhereConditions(
      params as Record<string, string | undefined>,
      this.allowedFilters,
    );

    const where = whereText ? `WHERE ${whereText}` : '';

    const model = this.modelName;

    const countSql = `SELECT COUNT(*) FROM "${model}" a ${where}`;
    const totalResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(countSql, ...whereValues);
    const total = Number(totalResult[0]?.count || 0);

    const paramOffset = whereValues.length;
    const dataSql = `SELECT a.* FROM "${model}" a ${where} ORDER BY a."created_at" ASC LIMIT $${paramOffset + 1} OFFSET $${paramOffset + 2}`;
    const rows = await prisma.$queryRawUnsafe<unknown[]>(dataSql, ...whereValues, take, skip);

    const data = rows.map((row: unknown) => this.toDTO(row as Record<string, unknown>));

    return {
      data,
      pagination: buildPaginationHeaders(total, page, size),
    };
  }

  async findRandom(language?: string): Promise<D> {
    const model = this.modelName;

    const countSql = `SELECT COUNT(*) FROM "${model}" a`;
    const totalResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(countSql);
    const total = Number(totalResult[0]?.count || 0);

    if (total === 0) {
      throw new ItemNotFoundException('Empty list');
    }

    const randomIndex = Math.floor(Math.random() * total);
    const dataSql = `SELECT a.* FROM "${model}" a ORDER BY a."created_at" ASC LIMIT 1 OFFSET $1`;
    const rows = await prisma.$queryRawUnsafe<unknown[]>(dataSql, randomIndex);

    if (!rows || rows.length === 0) {
      throw new ItemNotFoundException();
    }

    return this.toDTO(rows[0] as Record<string, unknown>);
  }

  async findBy(uuid: string, _language?: string): Promise<D> {
    const model = this.modelName;
    const sql = `SELECT a.* FROM "${model}" a WHERE a."uuid" = $1::uuid`;
    const rows = await prisma.$queryRawUnsafe<unknown[]>(sql, uuid);

    if (!rows || rows.length === 0) {
      throw new ItemNotFoundException();
    }

    return this.toDTO(rows[0] as Record<string, unknown>);
  }

  async save(data: Partial<Record<string, unknown>>): Promise<D> {
    const model = this.modelName;
    const uuid = crypto.randomUUID();
    const href = `${this.basePath}/${uuid}`;

    const fields: string[] = [];
    const values: unknown[] = [];

    fields.push('"uuid"', '"href"');
    values.push(uuid, href);

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'uuid' && key !== 'href') {
        fields.push(`"${key}"`);
        values.push(value);
      }
    }

    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `INSERT INTO "${model}" (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await prisma.$queryRawUnsafe<unknown[]>(sql, ...values);
    return this.toDTO((result as Record<string, unknown>[])[0]);
  }

  async patch(uuid: string, data: Partial<Record<string, unknown>>): Promise<D> {
    const existing = await this.findBy(uuid);

    const sets: string[] = [];
    const values: unknown[] = [uuid];

    let idx = 2;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'uuid' && key !== 'href') {
        sets.push(`"${key}" = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (sets.length === 0) {
      return existing;
    }

    const model = this.modelName;
    const sql = `UPDATE "${model}" SET ${sets.join(', ')} WHERE "uuid" = $1::uuid RETURNING *`;
    const result = await prisma.$queryRawUnsafe<unknown[]>(sql, ...values);
    if (!result || (result as Record<string, unknown>[]).length === 0) {
      throw new ItemNotFoundException();
    }

    return this.toDTO((result as Record<string, unknown>[])[0]);
  }

  async deleteById(uuid: string): Promise<void> {
    const model = this.modelName;
    const sql = `DELETE FROM "${model}" WHERE "uuid" = $1::uuid RETURNING "uuid"`;
    const result = await prisma.$queryRawUnsafe<unknown[]>(sql, uuid);

    if (!result || (result as Record<string, unknown>[]).length === 0) {
      throw new ItemNotFoundException();
    }
  }

  protected abstract toDTO(row: Record<string, unknown>): D;
}

export function getCount(count: bigint | number): number {
  if (typeof count === 'bigint') return Number(count);
  return count;
}
