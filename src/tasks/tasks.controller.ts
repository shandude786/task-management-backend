import { Router, Request, Response, NextFunction } from 'express';
import { tasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { jwtAuthMiddleware } from '../middleware/jwt-auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { TaskStatus } from './entities/task.entity';

const router = Router();

// Apply JWT authentication to all routes
router.use(jwtAuthMiddleware);

// POST /tasks - Create a new task
router.post(
  '/',
  validationMiddleware(CreateTaskDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await tasksService.create(req.body, req.user!.userId);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// GET /tasks - Get all tasks with optional filtering and sorting
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as TaskStatus | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' | undefined;

      const tasks = await tasksService.findAll(
        req.user!.userId,
        status,
        sortBy,
        sortOrder
      );
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

// GET /tasks/:id - Get a single task
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const task = await tasksService.findOne(id, req.user!.userId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /tasks/:id - Update a task
router.put(
  '/:id',
  validationMiddleware(UpdateTaskDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const task = await tasksService.update(id, req.body, req.user!.userId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /tasks/:id - Delete a task
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await tasksService.remove(id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;