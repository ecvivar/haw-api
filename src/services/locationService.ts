import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { LocationDTO, LocationTranslationDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';

export class LocationService extends BaseService<unknown, LocationDTO> {
  protected modelName = 'locations';
  protected basePath = `${config.api.basePath}/locations`;
  protected allowedFilters: string[] = [];

  async findAll(params: FindAllParams): Promise<FindAllResult<LocationDTO>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = this.parsePagination(params);

    const total = language === '*'
      ? await prisma.location.count()
      : await prisma.location.count({ where: { translation: { language } } } as never);

    const totalPages = Math.ceil(total / size) || 0;

    const locations = await prisma.location.findMany({
      skip, take, orderBy: { createdAt: 'asc' },
      ...(language !== '*' ? { where: { translation: { language } } } : {}),
      include: { translation: true },
    } as never);

    const data = (locations as unknown[]).map((l) => {
      const row = l as Record<string, unknown>;
      const t = row.translation as { name?: string; description?: string; language?: string } | undefined;
      return {
        uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
        sources: (row.sources || []) as string[],
        created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
        updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
        images: row.images as string[],
        ...(t ? { title: t.name, description: t.description, language: language === '*' ? t.language : language } : {}),
      } as LocationDTO;
    });

    return { data, pagination: { 'X-Pagination-Page-Index': page, 'X-Pagination-Page-Size': size, 'X-Pagination-Page-Total': totalPages, 'X-Pagination-Item-Total': total } };
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

  private parsePagination(params: { page?: string; size?: string }) {
    const page = Math.max(1, parseInt(params.page || '1', 10));
    let size = parseInt(params.size || String(config.pagination.defaultPageSize), 10);
    size = Math.min(Math.max(1, size), config.pagination.maxPageSize);
    return { skip: (page - 1) * size, take: size, page, size };
  }
}

export const locationService = new LocationService();
