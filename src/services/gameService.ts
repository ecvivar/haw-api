import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { GameDTO, GameTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';

export class GameService extends BaseService<unknown, GameDTO> {
  protected modelName = 'games';
  protected basePath = `${config.api.basePath}/games`;
  protected allowedFilters = ['playtime', 'age_rating', 'release_date', 'name'];

  async findAll(params: FindAllParams): Promise<FindAllResult<GameDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = this.parsePagination(params);

    const total = language === '*'
      ? await prisma.game.count()
      : await prisma.game.count({ where: { translation: { language } } } as never);

    const totalPages = Math.ceil(total / size) || 0;

    const games = await prisma.game.findMany({
      skip, take, orderBy: { createdAt: 'asc' },
      ...(language !== '*' ? { where: { translation: { language } } } : {}),
      include: { translation: true },
    } as never);

    const data = (games as unknown[]).map((g) => {
      const row = g as Record<string, unknown>;
      const t = row.translation as { name?: string; description?: string; genres?: string[]; trailer?: string; language?: string } | undefined;
      return {
        uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
        sources: (row.sources || []) as string[], created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
        updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
        playtime: row.playtime as number, age_rating: (row as Record<string, unknown>).age_rating as string,
        stores: row.stores as string[], modes: row.modes as string[], platforms: row.platforms as string[],
        publishers: row.publishers as string[], developers: row.developers as string[], tags: row.tags as string[],
        release_date: row.release_date ? new Date(row.release_date as Date).toISOString().split('T')[0] : undefined,
        website: row.website as string, images: row.images as string[],
        ...(t ? { title: t.name, description: t.description, genres: t.genres, trailer: t.trailer, language: language === '*' ? t.language : language } : {}),
      } as GameDTO;
    });

    return { data, pagination: { 'X-Pagination-Page-Index': page, 'X-Pagination-Page-Size': size, 'X-Pagination-Page-Total': totalPages, 'X-Pagination-Item-Total': total } };
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

  private parsePagination(params: { page?: string; size?: string }) {
    const page = Math.max(1, parseInt(params.page || '1', 10));
    let size = parseInt(params.size || String(config.pagination.defaultPageSize), 10);
    size = Math.min(Math.max(1, size), config.pagination.maxPageSize);
    return { skip: (page - 1) * size, take: size, page, size };
  }
}

export const gameService = new GameService();
