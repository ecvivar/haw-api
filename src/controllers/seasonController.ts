import { Response } from 'express';
import { seasonService } from '../services/seasonService';
import { setPaginationHeaders, setContentLanguage } from '../utils/response';
import { getDefaultLanguage } from '../utils/language';
import { AuthRequest } from '../middleware/auth';

export class SeasonController {
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const query = req.query as Record<string, string>;
    if (!query.language) query.language = getDefaultLanguage();
    const result = await seasonService.findAll(query);
    setPaginationHeaders(res, result.pagination);
    if (query.language) setContentLanguage(res, query.language);
    res.json(result.data);
  }

  async findRandom(req: AuthRequest, res: Response): Promise<void> {
    const language = (req.query.language as string) || getDefaultLanguage();
    const result = await seasonService.findRandom(language);
    setContentLanguage(res, language);
    res.json(result);
  }

  async findAllTranslationsBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.findAllTranslationsBy(req.params.uuid);
    res.json(result);
  }

  async findRandomTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.findRandomTranslation(req.params.uuid);
    setContentLanguage(res, result.language || '');
    res.json(result);
  }

  async findBy(req: AuthRequest, res: Response): Promise<void> {
    const language = (req.query.language as string) || getDefaultLanguage();
    const result = await seasonService.findBy(req.params.uuid, language);
    setContentLanguage(res, language);
    res.json(result);
  }

  async findTranslationBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.findTranslationBy(req.params.uuid, req.params.language);
    setContentLanguage(res, result.language || '');
    res.json(result);
  }

  async save(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.save(req.body);
    res.status(201).json(result);
  }

  async saveTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.saveTranslation(req.params.uuid, req.body);
    setContentLanguage(res, result.language || '');
    res.status(201).json(result);
  }

  async patch(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.patch(req.params.uuid, req.body);
    res.json(result);
  }

  async patchTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await seasonService.patchTranslation(req.params.uuid, req.params.language, req.body);
    setContentLanguage(res, req.params.language);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await seasonService.deleteById(req.params.uuid);
    res.status(204).send();
  }

  async deleteTranslation(req: AuthRequest, res: Response): Promise<void> {
    await seasonService.deleteTranslation(req.params.uuid, req.params.language);
    res.status(204).send();
  }
}

export const seasonController = new SeasonController();
