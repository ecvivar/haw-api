import { Prisma } from '@prisma/client';

export enum FilterOperator {
  LIKE = '*',
  NOT_LIKE = '!*',
  BETWEEN = '::',
  NOT_IN = '!:',
  IN = ':',
  GREATER_OR_EQUALS = '>=',
  LESS_OR_EQUALS = '<=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  NOT_EQUALS = '!',
  EQUALS = '',
}

const OPERATOR_PRECEDENCE = ['>=', '<=', '!*', '!:', '::', ':*', ':', '*', '>', '<', '!', ''];

export function detectOperator(value: string): FilterOperator {
  for (const op of OPERATOR_PRECEDENCE) {
    if (op && value.startsWith(op)) {
      return op as FilterOperator;
    }
  }
  return FilterOperator.EQUALS;
}

export function extractValue(value: string): { operator: FilterOperator; cleanValue: string } {
  const operator = detectOperator(value);
  const cleanValue = value.substring(operator.length);
  return { operator, cleanValue };
}

export interface FilterMapping {
  field: string;
  type: 'string' | 'number' | 'date' | 'string[]' | 'number[]';
  translationField?: string;
}

export function buildPrismaWhere<T>(
  filters: Record<string, string>,
  fieldMappings: FilterMapping[],
  language?: string,
): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = [];

  if (language && language !== '*') {
    conditions.push(Prisma.sql`t."language" = ${language}`);
  }

  for (const [key, value] of Object.entries(filters)) {
    if (key === 'language' || key === 'page' || key === 'size') continue;

    const mapping = fieldMappings.find(m => m.field === key);
    if (!mapping) continue;

    const { operator, cleanValue } = extractValue(value);
    const column = mapping.translationField
      ? Prisma.sql`t.${Prisma.raw(`"${mapping.translationField}"`)}`
      : Prisma.sql`a.${Prisma.raw(`"${key}"`)}`;

    switch (operator) {
      case FilterOperator.LIKE:
        conditions.push(Prisma.sql`${column} ILIKE ${`%${cleanValue}%`}`);
        break;
      case FilterOperator.NOT_LIKE:
        conditions.push(Prisma.sql`${column} NOT ILIKE ${`%${cleanValue}%`}`);
        break;
      case FilterOperator.GREATER_THAN:
        conditions.push(Prisma.sql`${column} > ${castValue(cleanValue, mapping.type)}`);
        break;
      case FilterOperator.LESS_THAN:
        conditions.push(Prisma.sql`${column} < ${castValue(cleanValue, mapping.type)}`);
        break;
      case FilterOperator.GREATER_OR_EQUALS:
        conditions.push(Prisma.sql`${column} >= ${castValue(cleanValue, mapping.type)}`);
        break;
      case FilterOperator.LESS_OR_EQUALS:
        conditions.push(Prisma.sql`${column} <= ${castValue(cleanValue, mapping.type)}`);
        break;
      case FilterOperator.NOT_EQUALS:
        conditions.push(Prisma.sql`${column} != ${cleanValue}`);
        break;
      case FilterOperator.IN: {
        const values = cleanValue.split(',');
        conditions.push(Prisma.sql`${column} = ANY(${values}::varchar[])`);
        break;
      }
      case FilterOperator.NOT_IN: {
        const values = cleanValue.split(',');
        conditions.push(Prisma.sql`NOT (${column} = ANY(${values}::varchar[]))`);
        break;
      }
      case FilterOperator.BETWEEN: {
        const [start, end] = cleanValue.split('::');
        conditions.push(Prisma.sql`${column} BETWEEN ${castValue(start, mapping.type)} AND ${castValue(end, mapping.type)}`);
        break;
      }
      case FilterOperator.EQUALS:
      default:
        conditions.push(Prisma.sql`${column} = ${cleanValue}`);
        break;
    }
  }

  return conditions;
}

function castValue(value: string, type: string): number | Date | string {
  switch (type) {
    case 'number':
    case 'number[]':
      return parseInt(value, 10);
    case 'date':
      return new Date(value);
    default:
      return value;
  }
}

export function buildRawWhereConditions(
  filters: Record<string, string | undefined>,
  fieldMappings: FilterMapping[],
  skipFields: string[] = ['page', 'size', 'language'],
): { text: string; values: unknown[] } {
  const clauses: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  for (const [key, rawValue] of Object.entries(filters)) {
    if (skipFields.includes(key) || rawValue === undefined) continue;

    const mapping = fieldMappings.find(m => m.field === key);
    if (!mapping || mapping.translationField) continue;

    const { operator, cleanValue } = extractValue(rawValue);
    const column = `a."${key}"`;

    switch (operator) {
      case FilterOperator.LIKE:
        clauses.push(`${column} ILIKE $${idx++}`);
        values.push(`%${cleanValue}%`);
        break;
      case FilterOperator.NOT_LIKE:
        clauses.push(`${column} NOT ILIKE $${idx++}`);
        values.push(`%${cleanValue}%`);
        break;
      case FilterOperator.GREATER_THAN:
        clauses.push(`${column} > $${idx++}`);
        values.push(castValue(cleanValue, mapping.type));
        break;
      case FilterOperator.LESS_THAN:
        clauses.push(`${column} < $${idx++}`);
        values.push(castValue(cleanValue, mapping.type));
        break;
      case FilterOperator.GREATER_OR_EQUALS:
        clauses.push(`${column} >= $${idx++}`);
        values.push(castValue(cleanValue, mapping.type));
        break;
      case FilterOperator.LESS_OR_EQUALS:
        clauses.push(`${column} <= $${idx++}`);
        values.push(castValue(cleanValue, mapping.type));
        break;
      case FilterOperator.NOT_EQUALS:
        clauses.push(`${column} != $${idx++}`);
        values.push(cleanValue);
        break;
      case FilterOperator.IN: {
        const items = cleanValue.split(',');
        const placeholders = items.map(() => `$${idx++}`).join(', ');
        clauses.push(`${column} IN (${placeholders})`);
        values.push(...items);
        break;
      }
      case FilterOperator.NOT_IN: {
        const items = cleanValue.split(',');
        const placeholders = items.map(() => `$${idx++}`).join(', ');
        clauses.push(`${column} NOT IN (${placeholders})`);
        values.push(...items);
        break;
      }
      case FilterOperator.BETWEEN: {
        const [start, end] = cleanValue.split('::');
        clauses.push(`${column} BETWEEN $${idx++} AND $${idx++}`);
        values.push(castValue(start, mapping.type), castValue(end, mapping.type));
        break;
      }
      case FilterOperator.EQUALS:
      default:
        clauses.push(`${column} = $${idx++}`);
        values.push(castValue(cleanValue, mapping.type));
        break;
    }
  }

  return { text: clauses.join(' AND '), values };
}
