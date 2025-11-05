import { Request, Response, NextFunction } from 'express';
import { HttpException } from './validation.middleware';

export const errorHandler = (
  error: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  // Handle specific error types
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      statusCode: 401,
      message: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      statusCode: 401,
      message: 'Token expired',
    });
  }

  // Default error
  console.error('Unhandled error:', error);
  return res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
};
