import { Response } from 'express';
import { episodeService } from '../services/episodeService';
import { setPaginationHeaders, setContentLanguage } from '../utils/response';
import { getDefaultLanguage } from '../utils/language';
import { AuthRequest } from '../middleware/auth';

export class EpisodeController {
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const query = req.query as Record<string, string>;
    if (!query.language) query.language = getDefaultLanguage();
    const result = await episodeService.findAll(query);
    setPaginationHeaders(res, result.pagination);
    if (query.language) setContentLanguage(res, query.language);
    res.json(result.data);
  }

  async findRandom(req: AuthRequest, res: Response): Promise<void> {
    const language = (req.query.language as string) || getDefaultLanguage();
    const result = await episodeService.findRandom(language);
    setContentLanguage(res, language);
    res.json(result);
  }

  async findAllTranslationsBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await episodeService.findAllTranslationsBy(req.params.uuid);
    res.json(result);
  }

  async findRandomTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await episodeService.findRandomTranslation(req.params.uuid);
    setContentLanguage(res, result.language || '');
    res.json(result);
  }

  async findBy(req: AuthRequest, res: Response): Promise<void> {
    const language = (req.query.language as string) || getDefaultLanguage();
    const result = await episodeService.findBy(req.params.uuid, language);
    setContentLanguage(res, language);
    res.json(result);
  }

  async findTranslationBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await episodeService.findTranslationBy(req.params.uuid, req.params.language);
    setContentLanguage(res, result.language || '');
    res.json(result);
  }

  async save(req: AuthRequest, res: Response): Promise<void> {
    if (!req.body.language) req.body.language = getDefaultLanguage();
    const result = await episodeService.save(req.body);
    setContentLanguage(res, result.language || '');
    res.status(201).json(result);
  }

  async saveTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await episodeService.saveTranslation(req.params.uuid, req.body);
    setContentLanguage(res, result.language || '');
    res.status(201).json(result);
  }

  async patch(req: AuthRequest, res: Response): Promise<void> {
    req.body.language = getDefaultLanguage();
    const result = await episodeService.patch(req.params.uuid, req.body);
    res.json(result);
  }

  async patchTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await episodeService.patchTranslation(req.params.uuid, req.params.language, req.body);
    setContentLanguage(res, req.params.language);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await episodeService.deleteById(req.params.uuid);
    res.status(204).send();
  }

  async deleteTranslation(req: AuthRequest, res: Response): Promise<void> {
    await episodeService.deleteTranslation(req.params.uuid, req.params.language);
    res.status(204).send();
  }
}

export const episodeController = new EpisodeController();
