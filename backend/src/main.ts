import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  app.setGlobalPrefix('api');

  const allowedOrigins = (
    process.env.FRONTEND_URL || 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3001;

  await app.listen(port, '0.0.0.0');
  console.log('Coranimelist API is running!')
}
await bootstrap();
