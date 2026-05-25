import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { EpisodeDTO, EpisodeTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';
import { getDefaultLanguage } from '../utils/language';

export class EpisodeService extends BaseService<unknown, EpisodeDTO> {
  protected modelName = 'episodes';
  protected basePath = `${config.api.basePath}/episodes`;
  protected allowedFilters = ['duration', 'episode_num', 'season', 'title', 'description'];

  async findAll(params: FindAllParams): Promise<FindAllResult<EpisodeDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = this.parsePagination(params);

    const countQuery = language === '*'
      ? prisma.episode.count()
      : prisma.episode.count({
          where: { translation: { language } },
        } as never);

    const total = await countQuery;
    const totalPages = Math.ceil(total / size) || 0;

    const episodes = await prisma.episode.findMany({
      skip,
      take,
      orderBy: { createdAt: 'asc' },
      ...(language !== '*' ? { where: { translation: { language } } } : {}),
      include: { translation: true },
    } as never);

    const data = await Promise.all(episodes.map(async (ep: Record<string, unknown>) => {
      const epRow = ep as { translation?: { language: string; title: string; description: string } } & Record<string, unknown>;
      return {
        uuid: epRow.uuid as string,
        href: epRow.href as string,
        thumbnail: epRow.thumbnail as string,
        sources: (epRow.sources || []) as string[],
        created_at: epRow.created_at ? new Date(epRow.created_at as Date).toISOString() : undefined,
        updated_at: epRow.updated_at ? new Date(epRow.updated_at as Date).toISOString() : undefined,
        title: epRow.translation?.title,
        description: epRow.translation?.description,
        language: language === '*' ? epRow.translation?.language : language,
        duration: epRow.duration as number,
        episode_num: (epRow as Record<string, unknown>).episode_num as number,
        next_episode: (epRow as Record<string, unknown>).next_episode as string,
        prev_episode: (epRow as Record<string, unknown>).prev_episode as string,
        season: epRow.season as string,
        images: epRow.images as string[],
      } as EpisodeDTO;
    }));

    return {
      data,
      pagination: {
        'X-Pagination-Page-Index': page,
        'X-Pagination-Page-Size': size,
        'X-Pagination-Page-Total': totalPages,
        'X-Pagination-Item-Total': total,
      },
    };
  }

  async findAllTranslationsBy(uuid: string): Promise<EpisodeTranslationDTO[]> {
    const translations = await prisma.episodeTranslation.findMany({
      where: { episodeUuid: uuid },
    });
    return translations.map(t => ({
      language: t.language,
      title: t.title,
      description: t.description,
    }));
  }

  async findRandomTranslation(uuid: string): Promise<EpisodeTranslationDTO> {
    const translations = await this.findAllTranslationsBy(uuid);
    if (translations.length === 0) throw new ItemNotFoundException();
    const index = Math.floor(Math.random() * translations.length);
    return translations[index];
  }

  async findTranslationBy(uuid: string, language: string): Promise<EpisodeTranslationDTO> {
    const translation = await prisma.episodeTranslation.findFirst({
      where: { episodeUuid: uuid, language },
    });
    if (!translation) throw new ItemNotFoundException();
    return { language: translation.language, title: translation.title, description: translation.description };
  }

  async saveTranslation(uuid: string, dto: EpisodeTranslationDTO): Promise<EpisodeTranslationDTO> {
    const existing = await prisma.episodeTranslation.findFirst({
      where: { episodeUuid: uuid, language: dto.language },
    });
    if (existing) throw new SaveConflictException(`Translation for '${dto.language}' already exists`);

    const translation = await prisma.episodeTranslation.create({
      data: {
        episodeUuid: uuid,
        language: dto.language || '',
        title: dto.title || '',
        description: dto.description || '',
      },
    });
    return { language: translation.language, title: translation.title, description: translation.description };
  }

  async patchTranslation(uuid: string, language: string, dto: EpisodeTranslationDTO): Promise<EpisodeTranslationDTO> {
    const existing = await prisma.episodeTranslation.findFirst({
      where: { episodeUuid: uuid, language },
    });
    if (!existing) throw new ItemNotFoundException();

    const updated = await prisma.episodeTranslation.update({
      where: { id: existing.id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
      },
    });
    return { language: updated.language, title: updated.title, description: updated.description };
  }

  async deleteTranslation(uuid: string, language: string): Promise<void> {
    const existing = await prisma.episodeTranslation.findFirst({
      where: { episodeUuid: uuid, language },
    });
    if (!existing) throw new ItemNotFoundException();
    await prisma.episodeTranslation.delete({ where: { id: existing.id } });
  }

  protected toDTO(row: Record<string, unknown>): EpisodeDTO {
    return {
      uuid: row.uuid as string,
      href: row.href as string,
      thumbnail: row.thumbnail as string,
      sources: row.sources as string[],
      created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      duration: row.duration as number,
      episode_num: (row as Record<string, unknown>).episode_num as number,
      next_episode: (row as Record<string, unknown>).next_episode as string,
      prev_episode: (row as Record<string, unknown>).prev_episode as string,
      season: row.season as string,
      images: row.images as string[],
    };
  }

  private parsePagination(params: { page?: string; size?: string }) {
    const page = Math.max(1, parseInt(params.page || '1', 10));
    let size = parseInt(params.size || String(config.pagination.defaultPageSize), 10);
    size = Math.min(Math.max(1, size), config.pagination.maxPageSize);
    return { skip: (page - 1) * size, take: size, page, size };
  }
}

export const episodeService = new EpisodeService();
