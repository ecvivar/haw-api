import { FilterMapping } from '../utils/filters';
import prisma from '../utils/prisma';
import { BaseService, FindAllParams, FindAllResult } from './baseService';
import { ActorDTO, ActorSocialDTO } from '../types';
import { config } from '../config';
import { ItemNotFoundException } from '../utils/errors';

export class ActorService extends BaseService<unknown, ActorDTO> {
  protected modelName = 'actors';
  protected basePath = `${config.api.basePath}/actors`;
  protected allowedFilters: FilterMapping[] = [
    { field: 'first_name', type: 'string' },
    { field: 'last_name', type: 'string' },
    { field: 'gender', type: 'number' },
    { field: 'nationality', type: 'string' },
    { field: 'character', type: 'string' },
  ];

  async findAll(params: FindAllParams): Promise<FindAllResult<ActorDTO>> {
    return super.findAll(params);
  }

  async findAllSocials(uuid: string): Promise<ActorSocialDTO[]> {
    const socials = await prisma.actorSocial.findMany({ where: { actorUuid: uuid } });
    return socials.map(s => ({
      social: s.social,
      handle: s.handle,
      url: s.url,
    }));
  }

  async findRandomSocial(uuid: string): Promise<ActorSocialDTO> {
    const socials = await this.findAllSocials(uuid);
    if (socials.length === 0) throw new ItemNotFoundException();
    const index = Math.floor(Math.random() * socials.length);
    return socials[index];
  }

  async findSocialBy(uuid: string, name: string): Promise<ActorSocialDTO> {
    const social = await prisma.actorSocial.findFirst({
      where: { actorUuid: uuid, social: name },
    });
    if (!social) throw new ItemNotFoundException();
    return { social: social.social, handle: social.handle, url: social.url };
  }

  async saveSocial(uuid: string, dto: ActorSocialDTO): Promise<ActorSocialDTO> {
    const social = await prisma.actorSocial.create({
      data: {
        social: dto.social || '',
        handle: dto.handle || '',
        url: dto.url || '',
        actorUuid: uuid,
      },
    });
    return { social: social.social, handle: social.handle, url: social.url };
  }

  async patchSocial(uuid: string, name: string, dto: ActorSocialDTO): Promise<ActorSocialDTO> {
    const existing = await prisma.actorSocial.findFirst({
      where: { actorUuid: uuid, social: name },
    });
    if (!existing) throw new ItemNotFoundException();

    const updated = await prisma.actorSocial.update({
      where: { id: existing.id },
      data: {
        ...(dto.social && { social: dto.social }),
        ...(dto.handle && { handle: dto.handle }),
        ...(dto.url && { url: dto.url }),
      },
    });
    return { social: updated.social, handle: updated.handle, url: updated.url };
  }

  async deleteSocial(uuid: string, name: string): Promise<void> {
    const existing = await prisma.actorSocial.findFirst({
      where: { actorUuid: uuid, social: name },
    });
    if (!existing) throw new ItemNotFoundException();
    await prisma.actorSocial.delete({ where: { id: existing.id } });
  }

  protected toDTO(row: Record<string, unknown>): ActorDTO {
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
      nationality: row.nationality as string,
      seasons: row.seasons as string[],
      awards: row.awards as string[],
      character: row.character as string,
      images: row.images as string[],
    };
  }
}

export const actorService = new ActorService();
