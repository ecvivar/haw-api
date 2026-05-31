import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../utils/prisma';
import { UserUnauthorizedException } from '../utils/errors';
import { Role } from '../types';

export interface AuthRequest extends Request {
  user?: {
    uuid: string;
    username: string;
    email: string;
    role: string;
  };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    req.user = undefined;
    return next();
  }

  try {
    const publicKey = config.jwt.publicKey;
    const decoded = jwt.verify(token, publicKey, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    }) as { uuid?: string; username: string; email: string; role: string };

    req.user = {
      uuid: decoded.uuid || '',
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    req.user = undefined;
    next();
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UserUnauthorizedException('Authentication required');
    }
    if (!roles.includes(req.user.role)) {
      throw new UserUnauthorizedException('Insufficient permissions');
    }
    next();
  };
}

export function getRole(req: AuthRequest): string {
  if (req.user) {
    return `ROLE_${req.user.role}`;
  }
  return `ROLE_${Role.ANONYMOUS}`;
}

export function hasAdminAuth(req: AuthRequest): boolean {
  return req.user?.role === Role.ADMIN;
}
