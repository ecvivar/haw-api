import { Response } from 'express';
import { soundtrackService } from '../services/soundtrackService';
import { setPaginationHeaders } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class SoundtrackController {
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const result = await soundtrackService.findAll(req.query as Record<string, string>);
    setPaginationHeaders(res, result.pagination);
    res.json(result.data);
  }

  async findRandom(req: AuthRequest, res: Response): Promise<void> {
    const result = await soundtrackService.findRandom(req.query.language as string);
    res.json(result);
  }

  async findBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await soundtrackService.findBy(req.params.uuid, req.query.language as string);
    res.json(result);
  }

  async save(req: AuthRequest, res: Response): Promise<void> {
    const result = await soundtrackService.save(req.body);
    res.status(201).json(result);
  }

  async patch(req: AuthRequest, res: Response): Promise<void> {
    const result = await soundtrackService.patch(req.params.uuid, req.body);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await soundtrackService.deleteById(req.params.uuid);
    res.status(204).send();
  }
}

export const soundtrackController = new SoundtrackController();
