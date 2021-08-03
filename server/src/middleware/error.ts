import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  return res.status(error.status || 500).json({
    message: error.message || 'Oops! Something went wrong',
  });
}

export class HttpException extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
