import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import * as session from 'express-session';
import helmet from 'helmet';
import * as moduleAlias from 'module-alias';
import 'module-alias/register';
import * as path from 'path';
import { AppModule } from './app.module';
import { API_URL, APP_PORT, secretKeySession } from './constants';
moduleAlias.addAliases({
  '@domain': path.resolve(__dirname, 'domain'),
  '@application': path.resolve(__dirname, 'app'),
  '@infrastructure': path.resolve(__dirname, 'infrastructure'),
  '@constants': path.format({ dir: __dirname, name: 'constants' }),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(
    session({
      secret: secretKeySession,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );

  app.enableCors(configService.get('cors'));
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('API Collection')
    .setDescription('Collections')
    .setVersion('1.0')
    .addServer(API_URL + '/', 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(APP_PORT);
}
bootstrap();
