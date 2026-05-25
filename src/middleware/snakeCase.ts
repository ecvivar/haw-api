import { Request, Response, NextFunction } from 'express';

export function snakeCaseFilter(req: Request, _res: Response, next: NextFunction): void {
  if (req.query) {
    const converted: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      converted[snakeKey] = String(value);
    }
    req.query = converted as unknown as typeof req.query;
  }
  next();
}
