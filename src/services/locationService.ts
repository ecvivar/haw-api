import { FilterMapping, buildRawWhereConditions } from '../utils/filters';
import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { LocationDTO, LocationTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';
import { parsePagination, buildPaginationHeaders } from '../utils/pagination';

export class LocationService extends BaseService<unknown, LocationDTO> {
  protected modelName = 'locations';
  protected basePath = `${config.api.basePath}/locations`;
  protected allowedFilters: FilterMapping[] = [
    { field: 'name', type: 'string', translationField: 'name' },
  ];

  async findAll(params: FindAllParams): Promise<FindAllResult<LocationDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = parsePagination(params);
    const { text: whereText, values: whereValues } = buildRawWhereConditions(
      params as Record<string, string | undefined>,
      this.allowedFilters,
    );
    const where = whereText ? `WHERE ${whereText}` : '';
    const countSql = `SELECT COUNT(*) FROM "locations" a ${where}`;
    const totalResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(countSql, ...whereValues);
    const total = Number(totalResult[0]?.count || 0);
    const paramOffset = whereValues.length;
    const langJoin = language !== '*'
      ? `LEFT JOIN "locations_translations" t ON t."location_uuid" = a."uuid" AND t."language" = $${paramOffset + 1}`
      : `LEFT JOIN "locations_translations" t ON t."location_uuid" = a."uuid"`;
    if (language !== '*') whereValues.push(language);
    const dataSql = `SELECT a.*, t."name" AS "translation_name", t."description" AS "translation_description", t."language" AS "translation_language" FROM "locations" a ${langJoin} ${where} ORDER BY a."created_at" ASC LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}`;
    whereValues.push(take, skip);
    const rows = await prisma.$queryRawUnsafe<unknown[]>(dataSql, ...whereValues);
    const data = rows.map((row) => {
      const r = row as Record<string, unknown>;
      const base = this.toDTO(r);
      return {
        ...base,
        title: r.translation_name as string || undefined,
        description: r.translation_description as string || undefined,
        language: r.translation_language as string || language,
      } as LocationDTO;
    });
    return { data, pagination: buildPaginationHeaders(total, page, size) };
  }

  async findAllTranslationsBy(uuid: string): Promise<LocationTranslationDTO[]> {
    const translations = await prisma.locationTranslation.findMany({ where: { locationUuid: uuid } });
    return translations.map(t => ({ language: t.language, name: t.name, description: t.description }));
  }

  async findRandomTranslation(uuid: string): Promise<LocationTranslationDTO> {
    const translations = await this.findAllTranslationsBy(uuid);
    if (translations.length === 0) throw new ItemNotFoundException();
    return translations[Math.floor(Math.random() * translations.length)];
  }

  async findTranslationBy(uuid: string, language: string): Promise<LocationTranslationDTO> {
    const t = await prisma.locationTranslation.findFirst({ where: { locationUuid: uuid, language } });
    if (!t) throw new ItemNotFoundException();
    return { language: t.language, name: t.name, description: t.description };
  }

  async saveTranslation(uuid: string, dto: LocationTranslationDTO): Promise<LocationTranslationDTO> {
    const existing = await prisma.locationTranslation.findFirst({ where: { locationUuid: uuid, language: dto.language } });
    if (existing) throw new SaveConflictException(`Translation for '${dto.language}' already exists`);
    const t = await prisma.locationTranslation.create({ data: { locationUuid: uuid, language: dto.language || '', name: dto.name || '', description: dto.description || '' } });
    return { language: t.language, name: t.name, description: t.description };
  }

  async patchTranslation(uuid: string, language: string, dto: LocationTranslationDTO): Promise<LocationTranslationDTO> {
    const existing = await prisma.locationTranslation.findFirst({ where: { locationUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    const updated = await prisma.locationTranslation.update({ where: { id: existing.id }, data: { ...(dto.name && { name: dto.name }), ...(dto.description && { description: dto.description }) } });
    return { language: updated.language, name: updated.name, description: updated.description };
  }

  async deleteTranslation(uuid: string, language: string): Promise<void> {
    const existing = await prisma.locationTranslation.findFirst({ where: { locationUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    await prisma.locationTranslation.delete({ where: { id: existing.id } });
  }

  protected toDTO(row: Record<string, unknown>): LocationDTO {
    return {
      uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
      sources: row.sources as string[],
      created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      images: row.images as string[],
    };
  }
}

export const locationService = new LocationService();
