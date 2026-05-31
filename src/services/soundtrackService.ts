import { FilterMapping } from '../utils/filters';
import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { SoundtrackDTO } from '../types';
import { config } from '../config';

export class SoundtrackService extends BaseService<unknown, SoundtrackDTO> {
  protected modelName = 'soundtracks';
  protected basePath = `${config.api.basePath}/soundtracks`;
  protected allowedFilters: FilterMapping[] = [
    { field: 'name', type: 'string' },
    { field: 'duration', type: 'number' },
    { field: 'artist', type: 'string' },
    { field: 'album', type: 'string' },
    { field: 'release_date', type: 'date' },
  ];

  async findAll(params: FindAllParams): Promise<FindAllResult<SoundtrackDTO>> {
    return super.findAll(params);
  }

  protected toDTO(row: Record<string, unknown>): SoundtrackDTO {
    return {
      uuid: row.uuid as string, href: row.href as string, thumbnail: row.thumbnail as string,
      sources: row.sources as string[],
      created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      name: row.name as string, duration: row.duration as number,
      artist: row.artist as string, album: row.album as string,
      release_date: (row as Record<string, unknown>).release_date ? new Date((row as Record<string, unknown>).release_date as Date).toISOString().split('T')[0] : undefined,
      urls: row.urls as string[],
    };
  }
}

export const soundtrackService = new SoundtrackService();
