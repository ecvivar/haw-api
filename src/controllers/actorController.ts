import { Response } from 'express';
import { actorService } from '../services/actorService';
import { setPaginationHeaders } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class ActorController {
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.findAll(req.query as Record<string, string>);
    setPaginationHeaders(res, result.pagination);
    res.json(result.data);
  }

  async findAllSocials(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.findAllSocials(req.params.uuid);
    res.json(result);
  }

  async findRandom(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.findRandom(req.query.language as string);
    res.json(result);
  }

  async findRandomSocial(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.findRandomSocial(req.params.uuid);
    res.json(result);
  }

  async findBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.findBy(req.params.uuid, req.query.language as string);
    res.json(result);
  }

  async findSocialBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.findSocialBy(req.params.uuid, req.params.name);
    res.json(result);
  }

  async save(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.save(req.body);
    res.status(201).json(result);
  }

  async saveSocial(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.saveSocial(req.params.uuid, req.body);
    res.status(201).json(result);
  }

  async patch(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.patch(req.params.uuid, req.body);
    res.json(result);
  }

  async patchSocial(req: AuthRequest, res: Response): Promise<void> {
    const result = await actorService.patchSocial(req.params.uuid, req.params.name, req.body);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await actorService.deleteById(req.params.uuid);
    res.status(204).send();
  }

  async deleteSocial(req: AuthRequest, res: Response): Promise<void> {
    await actorService.deleteSocial(req.params.uuid, req.params.name);
    res.status(204).send();
  }
}

export const actorController = new ActorController();
