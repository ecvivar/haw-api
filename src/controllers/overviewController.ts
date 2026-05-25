import { Response } from 'express';
import { overviewService } from '../services/overviewService';
import { setContentLanguage } from '../utils/response';
import { getDefaultLanguage } from '../utils/language';
import { AuthRequest } from '../middleware/auth';

export class OverviewController {
  async getApiInfo(req: AuthRequest, res: Response): Promise<void> {
    const { config } = await import('../config');
    res.json({
      title: config.api.title,
      description: config.api.description,
      version: config.api.version,
      url: config.api.url,
      docs: config.api.docs,
      github: config.api.github,
      githubHome: config.api.githubHome,
      apiVersion: config.api.versionPath,
      apiPath: config.api.path,
      apiBaseUrl: config.api.basePath,
      license: config.api.license,
      licenseUrl: config.api.licenseUrl,
      languages: config.language.supported,
      defaultLanguage: config.language.default,
      enableRegistration: config.registration.enabled,
    });
  }

  async ping(req: AuthRequest, res: Response): Promise<void> {
    res.json('Pong');
  }

  async getEndpoints(req: AuthRequest, res: Response): Promise<void> {
    const { config } = await import('../config');
    res.json({
      api: `${config.api.basePath}`,
      characters: `${config.api.basePath}/characters`,
      actors: `${config.api.basePath}/actors`,
      episodes: `${config.api.basePath}/episodes`,
      games: `${config.api.basePath}/games`,
      locations: `${config.api.basePath}/locations`,
      seasons: `${config.api.basePath}/seasons`,
      soundtracks: `${config.api.basePath}/soundtracks`,
      overview: `${config.api.basePath}/overview`,
    });
  }

  async find(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.find();
    res.json(result);
  }

  async findAllTranslations(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.findAllTranslations();
    res.json(result);
  }

  async findTranslationBy(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.findTranslationBy(req.params.language);
    setContentLanguage(res, result.language || '');
    res.json(result);
  }

  async save(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.save(req.body);
    res.status(201).json(result);
  }

  async saveTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.saveTranslation(req.body);
    setContentLanguage(res, result.language || '');
    res.status(201).json(result);
  }

  async patch(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.patch(req.body);
    res.json(result);
  }

  async patchTranslation(req: AuthRequest, res: Response): Promise<void> {
    const result = await overviewService.patchTranslation(req.params.language, req.body);
    setContentLanguage(res, req.params.language);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await overviewService.delete();
    res.status(204).send();
  }

  async deleteTranslation(req: AuthRequest, res: Response): Promise<void> {
    await overviewService.deleteTranslation(req.params.language);
    res.status(204).send();
  }
}

export const overviewController = new OverviewController();
