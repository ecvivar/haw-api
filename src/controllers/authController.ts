import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { UserUnauthorizedException } from '../utils/errors';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    if (!config.registration.enabled) {
      throw new UserUnauthorizedException('Registration is not available at the moment');
    }
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }

  async authenticate(req: Request, res: Response): Promise<void> {
    const result = await authService.authenticate(req.body);
    res.json(result);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await authService.delete(req.body);
    res.status(204).send();
  }
}

export const authController = new AuthController();
