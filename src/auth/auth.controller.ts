import { Router, Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

// POST /auth/register
router.post(
  '/register',
  validationMiddleware(RegisterDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /auth/login
router.post(
  '/login',
  validationMiddleware(LoginDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;