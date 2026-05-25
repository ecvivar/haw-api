import { Response } from 'express';
import { characterService } from '../services/characterService';
import { setPaginationHeaders } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { Role } from '../types';

export class CharacterController {
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const result = await characterService.findAll(req.query as Record<string, string>);
    setPaginationHeaders(res, result.pagination);
    res.json(result.data);
  }

  async findRandom(req: AuthRequest, res: Response): Promise<void> {
    const result = await characterService.findRandom(req.query.language as string);
    res.json(result);
  }

  async findBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await characterService.findBy(req.params.uuid, req.query.language as string);
    res.json(result);
  }

  async save(req: AuthRequest, res: Response): Promise<void> {
    const result = await characterService.save(req.body);
    res.status(201).json(result);
  }

  async patch(req: AuthRequest, res: Response): Promise<void> {
    const result = await characterService.patch(req.params.uuid, req.body);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await characterService.deleteById(req.params.uuid);
    res.status(204).send();
  }
}

export const characterController = new CharacterController();
