import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('HTTP');

  // Log all requests
  app.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('FitClimbAI API')
    .setDescription('The FitClimbAI API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(express.urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  await app.listen(configService.get('PORT') ?? 3000, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
