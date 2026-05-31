import { FilterMapping, buildRawWhereConditions } from '../utils/filters';
import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { SeasonDTO, SeasonTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';
import { parsePagination, buildPaginationHeaders } from '../utils/pagination';

export class SeasonService extends BaseService<unknown, SeasonDTO> {
  protected modelName = 'seasons';
  protected basePath = `${config.api.basePath}/seasons`;
  protected allowedFilters: FilterMapping[] = [
    { field: 'season_num', type: 'number' },
    { field: 'duration_total', type: 'number' },
    { field: 'release_date', type: 'date' },
    { field: 'budget', type: 'number' },
    { field: 'title', type: 'string', translationField: 'title' },
  ];

  async findAll(params: FindAllParams): Promise<FindAllResult<SeasonDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = parsePagination(params);
    const { text: whereText, values: whereValues } = buildRawWhereConditions(
      params as Record<string, string | undefined>,
      this.allowedFilters,
    );
    const where = whereText ? `WHERE ${whereText}` : '';
    const countSql = `SELECT COUNT(*) FROM "seasons" a ${where}`;
    const totalResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(countSql, ...whereValues);
    const total = Number(totalResult[0]?.count || 0);
    const paramOffset = whereValues.length;
    const langJoin = language !== '*'
      ? `LEFT JOIN "seasons_translations" t ON t."season_uuid" = a."uuid" AND t."language" = $${paramOffset + 1}`
      : `LEFT JOIN "seasons_translations" t ON t."season_uuid" = a."uuid"`;
    if (language !== '*') whereValues.push(language);
    const dataSql = `SELECT a.*, t."title" AS "translation_title", t."description" AS "translation_description", t."genres", t."trailers", t."language" AS "translation_language" FROM "seasons" a ${langJoin} ${where} ORDER BY a."created_at" ASC LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}`;
    whereValues.push(take, skip);
    const rows = await prisma.$queryRawUnsafe<unknown[]>(dataSql, ...whereValues);
    const data = rows.map((row) => {
      const r = row as Record<string, unknown>;
      const base = this.toDTO(r);
      return {
        ...base,
        title: r.translation_title as string || undefined,
        description: r.translation_description as string || undefined,
        genres: r.genres as string[] || undefined,
        trailers: r.trailers as string[] || undefined,
        language: r.translation_language as string || language,
      } as SeasonDTO;
    });
    return { data, pagination: buildPaginationHeaders(total, page, size) };
  }

  async findAllTranslationsBy(uuid: string): Promise<SeasonTranslationDTO[]> {
    const translations = await prisma.seasonTranslation.findMany({ where: { seasonUuid: uuid } });
    return translations.map(t => ({ language: t.language, title: t.title, description: t.description, genres: t.genres, trailers: t.trailers }));
  }

  async findRandomTranslation(uuid: string): Promise<SeasonTranslationDTO> {
    const translations = await this.findAllTranslationsBy(uuid);
    if (translations.length === 0) throw new ItemNotFoundException();
    return translations[Math.floor(Math.random() * translations.length)];
  }

  async findTranslationBy(uuid: string, language: string): Promise<SeasonTranslationDTO> {
    const t = await prisma.seasonTranslation.findFirst({ where: { seasonUuid: uuid, language } });
    if (!t) throw new ItemNotFoundException();
    return { language: t.language, title: t.title, description: t.description, genres: t.genres, trailers: t.trailers };
  }

  async saveTranslation(uuid: string, dto: SeasonTranslationDTO): Promise<SeasonTranslationDTO> {
    const existing = await prisma.seasonTranslation.findFirst({ where: { seasonUuid: uuid, language: dto.language } });
    if (existing) throw new SaveConflictException(`Translation for '${dto.language}' already exists`);
    const t = await prisma.seasonTranslation.create({ data: { seasonUuid: uuid, language: dto.language || '', title: dto.title || '', description: dto.description || '', genres: dto.genres || [], trailers: dto.trailers || [] } });
    return { language: t.language, title: t.title, description: t.description, genres: t.genres, trailers: t.trailers };
  }

  async patchTranslation(uuid: string, language: string, dto: SeasonTranslationDTO): Promise<SeasonTranslationDTO> {
    const existing = await prisma.seasonTranslation.findFirst({ where: { seasonUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    const updated = await prisma.seasonTranslation.update({ where: { id: existing.id }, data: { ...(dto.title && { title: dto.title }), ...(dto.description && { description: dto.description }), ...(dto.genres && { genres: dto.genres }), ...(dto.trailers && { trailers: dto.trailers }) } });
    return { language: updated.language, title: updated.title, description: updated.description, genres: updated.genres, trailers: updated.trailers };
  }

  async deleteTranslation(uuid: string, language: string): Promise<void> {
    const existing = await prisma.seasonTranslation.findFirst({ where: { seasonUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    await prisma.seasonTranslation.delete({ where: { id: existing.id } });
  }

  protected toDTO(row: Record<string, unknown>): SeasonDTO {
    return {
      uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
      sources: row.sources as string[],
      created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      duration_total: (row as Record<string, unknown>).duration_total as number,
      season_num: (row as Record<string, unknown>).season_num as number,
      release_date: (row as Record<string, unknown>).release_date ? new Date((row as Record<string, unknown>).release_date as Date).toISOString().split('T')[0] : undefined,
      next_season: (row as Record<string, unknown>).next_season as string,
      prev_season: (row as Record<string, unknown>).prev_season as string,
      episodes: row.episodes as string[], soundtracks: row.soundtracks as string[],
      budget: row.budget as number, images: row.images as string[],
    };
  }
}

export const seasonService = new SeasonService();
