import prisma from '../utils/prisma';
import { config } from '../config';
import { parsePagination, buildPaginationHeaders } from '../utils/pagination';
import { FindAllParams, FindAllResult } from './baseService';

interface TranslationEntry {
  entity: string;
  entity_uuid: string;
  language: string;
  title?: string;
  name?: string;
  description: string;
}

export class TranslationService {
  async findAll(params: FindAllParams): Promise<FindAllResult<TranslationEntry>> {
    const language = params.language || config.language.default;
    const { skip, take, page, size } = parsePagination(params);

    const episodeRows = await prisma.episodeTranslation.findMany({
      where: language !== '*' ? { language } : {},
      select: { episodeUuid: true, language: true, title: true, description: true },
    });
    const seasonRows = await prisma.seasonTranslation.findMany({
      where: language !== '*' ? { language } : {},
      select: { seasonUuid: true, language: true, title: true, description: true },
    });
    const gameRows = await prisma.gameTranslation.findMany({
      where: language !== '*' ? { language } : {},
      select: { gameUuid: true, language: true, name: true, description: true },
    });
    const locationRows = await prisma.locationTranslation.findMany({
      where: language !== '*' ? { language } : {},
      select: { locationUuid: true, language: true, name: true, description: true },
    });
    const overviewRows = await prisma.overviewTranslation.findMany({
      where: language !== '*' ? { language } : {},
      select: { overviewUuid: true, language: true, title: true, description: true },
    });

    const allTranslations: TranslationEntry[] = [
      ...episodeRows.map(r => ({ entity: 'episodes', entity_uuid: r.episodeUuid, language: r.language, title: r.title, description: r.description })),
      ...seasonRows.map(r => ({ entity: 'seasons', entity_uuid: r.seasonUuid, language: r.language, title: r.title, description: r.description })),
      ...gameRows.map(r => ({ entity: 'games', entity_uuid: r.gameUuid, language: r.language, name: r.name, description: r.description })),
      ...locationRows.map(r => ({ entity: 'locations', entity_uuid: r.locationUuid, language: r.language, name: r.name, description: r.description })),
      ...overviewRows.map(r => ({ entity: 'overview', entity_uuid: r.overviewUuid, language: r.language, title: r.title, description: r.description })),
    ];

    const total = allTranslations.length;
    const data = allTranslations.slice(skip, skip + take);

    return { data, pagination: buildPaginationHeaders(total, page, size) };
  }
}

export const translationService = new TranslationService();