import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmController } from './app/controllers/film/film.controller';
import { UserController } from './app/controllers/user/user.controller';
import { jwtConstants } from './constants';
import { FilmService } from './domain/film/film.service';
import { UserService } from './domain/user/user.service';
import cors from './infrastructure/configs/cors';
import dataSource from './infrastructure/database/data-source';
import { DatabaseModule } from './infrastructure/database/database.module';
import { JWTAuthGuard } from './infrastructure/guard/jwt.guard';
import { ConvertionHelper } from './infrastructure/helpers/convertion.helper';
import { GlobalHelper } from './infrastructure/helpers/global.helper';
import { UserHelper } from './infrastructure/helpers/user.helper';
import { Films } from './infrastructure/models/films.model';
import { Users } from './infrastructure/models/users.model';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
      load: [dataSource, cors],
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([Users, Films]),
    PassportModule,
  ],
  controllers: [UserController, FilmController],
  providers: [
    UserService,
    FilmService,
    ConvertionHelper,
    UserHelper,
    GlobalHelper,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
  ],
})
export class AppModule {}
