import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { SeasonDTO, SeasonTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';

export class SeasonService extends BaseService<unknown, SeasonDTO> {
  protected modelName = 'seasons';
  protected basePath = `${config.api.basePath}/seasons`;
  protected allowedFilters: string[] = [];

  async findAll(params: FindAllParams): Promise<FindAllResult<SeasonDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = this.parsePagination(params);

    const total = language === '*'
      ? await prisma.season.count()
      : await prisma.season.count({ where: { translation: { language } } } as never);

    const totalPages = Math.ceil(total / size) || 0;

    const seasons = await prisma.season.findMany({
      skip, take, orderBy: { createdAt: 'asc' },
      ...(language !== '*' ? { where: { translation: { language } } } : {}),
      include: { translation: true },
    } as never);

    const data = (seasons as unknown[]).map((s) => {
      const row = s as Record<string, unknown>;
      const t = row.translation as { title?: string; description?: string; genres?: string[]; trailers?: string[]; language?: string } | undefined;
      return {
        uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
        sources: (row.sources || []) as string[],
        created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
        updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
        duration_total: (row as Record<string, unknown>).duration_total as number,
        season_num: (row as Record<string, unknown>).season_num as number,
        release_date: (row as Record<string, unknown>).release_date ? new Date((row as Record<string, unknown>).release_date as Date).toISOString().split('T')[0] : undefined,
        next_season: (row as Record<string, unknown>).next_season as string,
        prev_season: (row as Record<string, unknown>).prev_season as string,
        episodes: row.episodes as string[], soundtracks: row.soundtracks as string[],
        budget: row.budget as number, images: row.images as string[],
        ...(t ? { title: t.title, description: t.description, genres: t.genres, trailers: t.trailers, language: language === '*' ? t.language : language } : {}),
      } as SeasonDTO;
    });

    return { data, pagination: { 'X-Pagination-Page-Index': page, 'X-Pagination-Page-Size': size, 'X-Pagination-Page-Total': totalPages, 'X-Pagination-Item-Total': total } };
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

  private parsePagination(params: { page?: string; size?: string }) {
    const page = Math.max(1, parseInt(params.page || '1', 10));
    let size = parseInt(params.size || String(config.pagination.defaultPageSize), 10);
    size = Math.min(Math.max(1, size), config.pagination.maxPageSize);
    return { skip: (page - 1) * size, take: size, page, size };
  }
}

export const seasonService = new SeasonService();
