import { Response } from 'express';
import { translationService } from '../services/translationService';
import { setPaginationHeaders, setContentLanguage } from '../utils/response';
import { getDefaultLanguage } from '../utils/language';
import { AuthRequest } from '../middleware/auth';

export class TranslationController {
  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const query = req.query as Record<string, string>;
    if (!query.language) query.language = getDefaultLanguage();
    const result = await translationService.findAll(query);
    setPaginationHeaders(res, result.pagination);
    if (query.language && query.language !== '*') setContentLanguage(res, query.language);
    res.json(result.data);
  }
}

export const translationController = new TranslationController();