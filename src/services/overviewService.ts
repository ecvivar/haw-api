import prisma from '../utils/prisma';
import { OverviewDTO, OverviewTranslationDTO } from '../types';
import { ItemNotFoundException, SaveConflictException } from '../utils/errors';
import { config } from '../config';

export class OverviewService {
  private basePath = `${config.api.basePath}/overview`;

  async find(): Promise<OverviewDTO> {
    const overview = await prisma.overview.findFirst({ include: { translations: true } });
    if (!overview) throw new ItemNotFoundException();
    const translations = (overview as unknown as { translations?: Array<{ title?: string; description?: string; language?: string }> }).translations || [];
    const t = translations[0];
    return {
      uuid: overview.uuid, href: overview.href || undefined, thumbnail: overview.thumbnail || undefined,
      sources: overview.sources, created_at: overview.createdAt.toISOString(), updated_at: overview.updatedAt.toISOString(),
      languages: overview.languages, creators: overview.creators,
      ...(t ? { title: t.title, description: t.description, language: t.language } : {}),
    };
  }

  async save(data: Partial<Record<string, unknown>>): Promise<OverviewDTO> {
    const uuid = crypto.randomUUID();
    const href = `${this.basePath}/${uuid}`;
    const overview = await prisma.overview.create({
      data: {
        uuid, href, languages: (data.languages as string[]) || [], creators: (data.creators as string[]) || [],
        sources: (data.sources as string[]) || [], thumbnail: data.thumbnail as string,
      },
    });
    return {
      uuid: overview.uuid, href: overview.href || undefined, thumbnail: overview.thumbnail || undefined,
      sources: overview.sources, created_at: overview.createdAt.toISOString(), updated_at: overview.updatedAt.toISOString(),
      languages: overview.languages, creators: overview.creators,
    };
  }

  async patch(data: Partial<Record<string, unknown>>): Promise<OverviewDTO> {
    const overview = await prisma.overview.findFirst();
    if (!overview) throw new ItemNotFoundException();
    const updateData: Record<string, unknown> = {};
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.creators !== undefined) updateData.creators = data.creators;
    if (data.sources !== undefined) updateData.sources = data.sources;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;

    const updated = await prisma.overview.update({
      where: { uuid: overview.uuid },
      data: updateData,
    });
    return {
      uuid: updated.uuid, href: updated.href || undefined, thumbnail: updated.thumbnail || undefined,
      sources: updated.sources, created_at: updated.createdAt.toISOString(), updated_at: updated.updatedAt.toISOString(),
      languages: updated.languages, creators: updated.creators,
    };
  }

  async delete(): Promise<void> {
    const overview = await prisma.overview.findFirst();
    if (!overview) throw new ItemNotFoundException();
    await prisma.overview.delete({ where: { uuid: overview.uuid } });
  }

  async findAllTranslations(): Promise<OverviewTranslationDTO[]> {
    const overview = await prisma.overview.findFirst();
    if (!overview) return [];
    const translations = await prisma.overviewTranslation.findMany({ where: { overviewUuid: overview.uuid } });
    return translations.map(t => ({ language: t.language, title: t.title, description: t.description }));
  }

  async findTranslationBy(language: string): Promise<OverviewTranslationDTO> {
    const overview = await prisma.overview.findFirst();
    if (!overview) throw new ItemNotFoundException();
    const t = await prisma.overviewTranslation.findFirst({ where: { overviewUuid: overview.uuid, language } });
    if (!t) throw new ItemNotFoundException();
    return { language: t.language, title: t.title, description: t.description };
  }

  async saveTranslation(dto: OverviewTranslationDTO): Promise<OverviewTranslationDTO> {
    const overview = await prisma.overview.findFirst();
    if (!overview) throw new ItemNotFoundException();
    const existing = await prisma.overviewTranslation.findFirst({ where: { overviewUuid: overview.uuid, language: dto.language } });
    if (existing) throw new SaveConflictException(`Translation for '${dto.language}' already exists`);
    const t = await prisma.overviewTranslation.create({ data: { overviewUuid: overview.uuid, language: dto.language || '', title: dto.title || '', description: dto.description || '' } });
    return { language: t.language, title: t.title, description: t.description };
  }

  async patchTranslation(language: string, dto: OverviewTranslationDTO): Promise<OverviewTranslationDTO> {
    const overview = await prisma.overview.findFirst();
    if (!overview) throw new ItemNotFoundException();
    const existing = await prisma.overviewTranslation.findFirst({ where: { overviewUuid: overview.uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    const updated = await prisma.overviewTranslation.update({ where: { id: existing.id }, data: { ...(dto.title && { title: dto.title }), ...(dto.description && { description: dto.description }) } });
    return { language: updated.language, title: updated.title, description: updated.description };
  }

  async deleteTranslation(language: string): Promise<void> {
    const overview = await prisma.overview.findFirst();
    if (!overview) throw new ItemNotFoundException();
    const existing = await prisma.overviewTranslation.findFirst({ where: { overviewUuid: overview.uuid, language } });
    if (!existing) throw new ItemNotFoundException();
    await prisma.overviewTranslation.delete({ where: { id: existing.id } });
  }
}

export const overviewService = new OverviewService();
