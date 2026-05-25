import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { CharacterDTO } from '../types';
import { config } from '../config';

export class CharacterService extends BaseService<unknown, CharacterDTO> {
  protected modelName = 'characters';
  protected basePath = `${config.api.basePath}/characters`;
  protected allowedFilters = ['first_name', 'last_name', 'gender', 'birth_date', 'death_date', 'nicknames', 'actor'];

  async findAll(params: FindAllParams): Promise<FindAllResult<CharacterDTO>> {
    return super.findAll(params);
  }

  protected toDTO(row: Record<string, unknown>): CharacterDTO {
    return {
      uuid: row.uuid as string,
      href: row.href as string,
      thumbnail: row.thumbnail as string,
      sources: row.sources as string[],
      created_at: row.created_at ? new Date(row.created_at as Date).toISOString() : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at as Date).toISOString() : undefined,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      nicknames: row.nicknames as string[],
      birth_date: row.birth_date ? new Date(row.birth_date as Date).toISOString().split('T')[0] : undefined,
      death_date: row.death_date ? new Date(row.death_date as Date).toISOString().split('T')[0] : undefined,
      gender: row.gender as number,
      actor: row.actor as string,
      images: row.images as string[],
    };
  }
}

export const characterService = new CharacterService();
