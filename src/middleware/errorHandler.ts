import { Request, Response, NextFunction } from 'express';
import {
  BadRequestException,
  ItemNotFoundException,
  SaveConflictException,
  InternalServerErrorException,
  UserConflictException,
  UserNotFoundException,
  UserUnauthorizedException,
  RoleBadRequestException,
} from '../utils/errors';
import { ErrorResponse } from '../types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const timestamp = new Date().toISOString();
  const url = req.originalUrl;
  const method = req.method;

  let status = 500;
  let cause = 'Internal Server Error';

  if (err instanceof BadRequestException) {
    status = 400;
    cause = 'Bad Request';
  } else if (err instanceof ItemNotFoundException) {
    status = 404;
    cause = 'Not Found';
  } else if (err instanceof SaveConflictException) {
    status = 409;
    cause = 'Conflict';
  } else if (err instanceof InternalServerErrorException) {
    status = 500;
    cause = 'Internal Server Error';
  } else if (err instanceof UserConflictException) {
    status = 409;
    cause = 'Conflict';
  } else if (err instanceof UserNotFoundException) {
    status = 404;
    cause = 'Not Found';
  } else if (err instanceof UserUnauthorizedException) {
    status = 401;
    cause = 'Unauthorized';
  } else if (err instanceof RoleBadRequestException) {
    status = 400;
    cause = 'Bad Request';
  }

  const body: ErrorResponse = {
    code: status,
    status: cause,
    method,
    cause: err.message || cause,
    message: err.message || cause,
    timestamps: timestamp,
    url,
  };

  res.status(status).json(body);
}
