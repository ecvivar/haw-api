import { FilterMapping, buildRawWhereConditions } from '../utils/filters';
import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { GameDTO, GameTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';
import { parsePagination, buildPaginationHeaders } from '../utils/pagination';

export class GameService extends BaseService<unknown, GameDTO> {
  protected modelName = 'games';
  protected basePath = `${config.api.basePath}/games`;
  protected allowedFilters: FilterMapping[] = [
    { field: 'playtime', type: 'number' },
    { field: 'age_rating', type: 'string' },
    { field: 'release_date', type: 'date' },
    { field: 'name', type: 'string', translationField: 'name' },
  ];

  async findAll(params: FindAllParams): Promise<FindAllResult<GameDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = parsePagination(params);
    const { text: whereText, values: whereValues } = buildRawWhereConditions(
      params as Record<string, string | undefined>,
      this.allowedFilters,
    );
    const where = whereText ? `WHERE ${whereText}` : '';
    const countSql = `SELECT COUNT(*) FROM "games" a ${where}`;
    const totalResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(countSql, ...whereValues);
    const total = Number(totalResult[0]?.count || 0);
    const paramOffset = whereValues.length;
    const langJoin = language !== '*'
      ? `LEFT JOIN "games_translations" t ON t."game_uuid" = a."uuid" AND t."language" = $${paramOffset + 1}`
      : `LEFT JOIN "games_translations" t ON t."game_uuid" = a."uuid"`;
    if (language !== '*') whereValues.push(language);
    const dataSql = `SELECT a.*, t."name" AS "translation_name", t."description" AS "translation_description", t."genres", t."trailer", t."language" AS "translation_language" FROM "games" a ${langJoin} ${where} ORDER BY a."created_at" ASC LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}`;
    whereValues.push(take, skip);
    const rows = await prisma.$queryRawUnsafe<unknown[]>(dataSql, ...whereValues);
    const data = rows.map((row) => {
      const r = row as Record<string, unknown>;
      const base = this.toDTO(r);
      return {
        ...base,
        title: r.translation_name as string || undefined,
        description: r.translation_description as string || undefined,
        genres: r.genres as string[] || undefined,
        trailer: r.trailer as string || undefined,
        language: r.translation_language as string || language,
      } as GameDTO;
    });
    return { data, pagination: buildPaginationHeaders(total, page, size) };
  }

  async findAllTranslationsBy(uuid: string): Promise<GameTranslationDTO[]> {
    const translations = await prisma.gameTranslation.findMany({ where: { gameUuid: uuid } });
    return translations.map(t => ({ language: t.language, name: t.name, description: t.description, genres: t.genres, trailer: t.trailer || undefined }));
  }

  async findRandomTranslation(uuid: string): Promise<GameTranslationDTO> {
    const translations = await this.findAllTranslationsBy(uuid);
    if (translations.length === 0) throw new ItemNotFoundException();
    return translations[Math.floor(Math.random() * translations.length)];
  }

  async findTranslationBy(uuid: string, language: string): Promise<GameTranslationDTO> {
    const t = await prisma.gameTranslation.findFirst({ where: { gameUuid: uuid, language } });
    if (!t) throw new ItemNotFoundException();
    return { language: t.language, name: t.name, description: t.description, genres: t.genres, trailer: t.trailer || undefined };
  }

  async saveTranslation(uuid: string, dto: GameTranslationDTO): Promise<GameTranslationDTO> {
    const existing = await prisma.gameTranslation.findFirst({ where: { gameUuid: uuid, language: dto.language } });
    if (existing) throw new SaveConflictException(`Translation for '${dto.language}' already exists`);
    const t = await prisma.gameTranslation.create({
      data: { gameUuid: uuid, language: dto.language || '', name: dto.name || '', description: dto.description || '', genres: dto.genres || [], trailer: dto.trailer },
    });
    return { language: t.language, name: t.name, description: t.description, genres: t.genres, trailer: t.trailer || undefined };
  }

  async patchTranslation(uuid: string, language: string, dto: GameTranslationDTO): Promise<GameTranslationDTO> {
    const existing = await prisma.gameTranslation.findFirst({ where: { gameUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    const updated = await prisma.gameTranslation.update({ where: { id: existing.id }, data: { ...(dto.name && { name: dto.name }), ...(dto.description && { description: dto.description }), ...(dto.genres && { genres: dto.genres }), ...(dto.trailer && { trailer: dto.trailer }) } });
    return { language: updated.language, name: updated.name, description: updated.description, genres: updated.genres, trailer: updated.trailer || undefined };
  }

  async deleteTranslation(uuid: string, language: string): Promise<void> {
    const existing = await prisma.gameTranslation.findFirst({ where: { gameUuid: uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    await prisma.gameTranslation.delete({ where: { id: existing.id } });
  }

  protected toDTO(row: Record<string, unknown>): GameDTO {
    return {
      uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
      sources: row.sources as string[], created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      playtime: row.playtime as number, age_rating: (row as Record<string, unknown>).age_rating as string,
      stores: row.stores as string[], modes: row.modes as string[], platforms: row.platforms as string[],
      publishers: row.publishers as string[], developers: row.developers as string[], tags: row.tags as string[],
      release_date: row.release_date ? new Date(row.release_date as Date).toISOString().split('T')[0] : undefined,
      website: row.website as string, images: row.images as string[],
    };
  }
}

export const gameService = new GameService();
