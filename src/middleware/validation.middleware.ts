import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class HttpException extends Error {
  constructor(public statusCode: number, public message: string, public errors?: any[]) {
    super(message);
    this.name = 'HttpException';
  }
}

export const validationMiddleware = (type: any, skipMissingProperties = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(type, req.body, {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      });

      const errors: ValidationError[] = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties,
      });

      if (errors.length > 0) {
        const messages = errors.map((error: ValidationError) => {
          return Object.values(error.constraints || {}).join(', ');
        });

        return next(new HttpException(400, 'Validation failed', messages));
      }

      // Replace request body with validated and transformed DTO
      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
};
