import express, { Express } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import authRouter from './auth/auth.controller';
import tasksRouter from './tasks/tasks.controller';
import { errorHandler } from './middleware/error-handler';

dotenv.config();

export const createApp = async (): Promise<Express> => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS configuration
  app.use(
    cors({
      origin: [
        'http://localhost:3001',
        'https://your-app.vercel.app',
        /\.vercel\.app$/,
      ],
      credentials: true,
    })
  );

  // Routes
  app.use('/auth', authRouter);
  app.use('/tasks', tasksRouter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

// Export for testing
export default createApp;
