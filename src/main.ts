import 'reflect-metadata';
import { createApp } from './app';
import { initializeDatabase } from './config/database';

async function bootstrap() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('Database connected successfully');

    // Create Express app
    const app = await createApp();

    // Start server
    const port = parseInt(process.env.PORT || '3000', 10);
    app.listen(port, '0.0.0.0', () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
