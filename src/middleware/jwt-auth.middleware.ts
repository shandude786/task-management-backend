import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException } from './validation.middleware';
import { getRepository } from '../config/database';
import { User } from '../users/entities/user.entity';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(401, 'Unauthorized - No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException(401, 'Unauthorized - Invalid token format');
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as unknown as {
      sub: number;
      email: string;
      iat: number;
      exp: number;
    };

    // Validate user exists
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.sub } });

    if (!user) {
      throw new HttpException(401, 'Unauthorized - User not found');
    }

    // Attach user to request
    req.user = {
      userId: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorized - Invalid token'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpException(401, 'Unauthorized - Token expired'));
    }
    next(error);
  }
};
