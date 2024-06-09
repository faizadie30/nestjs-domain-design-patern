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
import { NestExpressApplication } from '@nestjs/platform-express';
moduleAlias.addAliases({
  '@domain': path.resolve(__dirname, 'domain'),
  '@application': path.resolve(__dirname, 'app'),
  '@infrastructure': path.resolve(__dirname, 'infrastructure'),
  '@constants': path.format({ dir: __dirname, name: 'constants' }),
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(
    session({
      secret: secretKeySession,
      resave: true,
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

  const rootFile = path.join(__dirname, '../public');
  app.useStaticAssets(rootFile, {
    prefix: '/public/',
  });

  const options = new DocumentBuilder()
    .setTitle('API Collection')
    .setDescription('Collections')
    .setVersion('1.0')
    .addBearerAuth({
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .addServer(API_URL + '/', 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(APP_PORT);
}
bootstrap();
