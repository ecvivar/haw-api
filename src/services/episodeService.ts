import { FilterMapping, buildRawWhereConditions } from '../utils/filters';
import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { EpisodeDTO, EpisodeTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';
import { parsePagination, buildPaginationHeaders } from '../utils/pagination';

export class EpisodeService extends BaseService<unknown, EpisodeDTO> {
  protected modelName = 'episodes';
  protected basePath = `${config.api.basePath}/episodes`;
  protected allowedFilters: FilterMapping[] = [
    { field: 'duration', type: 'number' },
    { field: 'episode_num', type: 'number' },
    { field: 'season', type: 'string' },
    { field: 'title', type: 'string', translationField: 'title' },
    { field: 'description', type: 'string', translationField: 'description' },
  ];

  async findAll(params: FindAllParams): Promise<FindAllResult<EpisodeDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = parsePagination(params);
    const { text: whereText, values: whereValues } = buildRawWhereConditions(
      params as Record<string, string | undefined>,
      this.allowedFilters,
    );
    const where = whereText ? `WHERE ${whereText}` : '';
    const countSql = `SELECT COUNT(*) FROM "episodes" a ${where}`;
    const totalResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(countSql, ...whereValues);
    const total = Number(totalResult[0]?.count || 0);
    const paramOffset = whereValues.length;
    const langJoin = language !== '*'
      ? `LEFT JOIN "episodes_translations" t ON t."episode_uuid" = a."uuid" AND t."language" = $${paramOffset + 1}`
      : `LEFT JOIN "episodes_translations" t ON t."episode_uuid" = a."uuid"`;
    if (language !== '*') whereValues.push(language);
    const dataSql = `SELECT a.*, t."title", t."description", t."language" AS "translation_language" FROM "episodes" a ${langJoin} ${where} ORDER BY a."created_at" ASC LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}`;
    whereValues.push(take, skip);
    const rows = await prisma.$queryRawUnsafe<unknown[]>(dataSql, ...whereValues);
    const data = rows.map((row) => {
      const r = row as Record<string, unknown>;
      const base = this.toDTO(r);
      return {
        ...base,
        title: r.title as string || undefined,
        description: r.description as string || undefined,
        language: r.translation_language as string || language,
      } as EpisodeDTO;
    });
    return { data, pagination: buildPaginationHeaders(total, page, size) };
  }

  async findAllTranslationsBy(uuid: string): Promise<EpisodeTranslationDTO[]> {
    const translations = await prisma.episodeTranslation.findMany({ where: { episodeUuid: uuid } });
    return translations.map(t => ({ language: t.language, title: t.title, description: t.description }));
  }

  async findRandomTranslation(uuid: string): Promise<EpisodeTranslationDTO> {
    const translations = await this.findAllTranslationsBy(uuid);
    if (translations.length === 0) throw new ItemNotFoundException();
    const index = Math.floor(Math.random() * translations.length);
    return translations[index];
  }

  async findTranslationBy(uuid: string, language: string): Promise<EpisodeTranslationDTO> {
    const translation = await prisma.episodeTranslation.findFirst({ where: { episodeUuid: uuid, language } });
    if (!translation) throw new ItemNotFoundException();
    return { language: translation.language, title: translation.title, description: translation.description };
  }

  async saveTranslation(uuid: string, dto: EpisodeTranslationDTO): Promise<EpisodeTranslationDTO> {
    const existing = await prisma.episodeTranslation.findFirst({ where: { episodeUuid: uuid, language: dto.language } });
    if (existing) throw new SaveConflictException(`Translation for '${dto.language}' already exists`);
    const translation = await prisma.episodeTranslation.create({
      data: { episodeUuid: uuid, language: dto.language || '', title: dto.title || '', description: dto.description || '' },
    });
    return { language: translation.language, title: translation.title, description: translation.description };
  }

  async patchTranslation(uuid: string, language: string, dto: EpisodeTranslationDTO): Promise<EpisodeTranslationDTO> {
    const existing = await prisma.episodeTranslation.findFirst({ where: { episodeUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    const updated = await prisma.episodeTranslation.update({
      where: { id: existing.id },
      data: { ...(dto.title && { title: dto.title }), ...(dto.description && { description: dto.description }) },
    });
    return { language: updated.language, title: updated.title, description: updated.description };
  }

  async deleteTranslation(uuid: string, language: string): Promise<void> {
    const existing = await prisma.episodeTranslation.findFirst({ where: { episodeUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    await prisma.episodeTranslation.delete({ where: { id: existing.id } });
  }

  protected toDTO(row: Record<string, unknown>): EpisodeDTO {
    return {
      uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
      sources: row.sources as string[], created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      duration: row.duration as number, episode_num: (row as Record<string, unknown>).episode_num as number,
      next_episode: (row as Record<string, unknown>).next_episode as string, prev_episode: (row as Record<string, unknown>).prev_episode as string,
      season: row.season as string, images: row.images as string[],
    };
  }
}

export const episodeService = new EpisodeService();
