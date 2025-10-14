import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for production
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://your-app.vercel.app', // Update this after deploying frontend
      /\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Important: listen on 0.0.0.0
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();