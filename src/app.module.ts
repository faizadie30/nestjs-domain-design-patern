import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './app/controllers/user/user.controller';
import { jwtConstants } from './constants';
import { UserService } from './domain/user/user.service';
import cors from './infrastructure/configs/cors';
import dataSource from './infrastructure/database/data-source';
import { DatabaseModule } from './infrastructure/database/database.module';
import { Films } from './infrastructure/models/films.model';
import { Users } from './infrastructure/models/users.model';
import { ConvertionHelper } from './infrastructure/helpers/convertion.helper';
import { UserHelper } from './infrastructure/helpers/user.helper';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JWTAuthGuard } from './infrastructure/guard/jwt.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
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
  controllers: [UserController],
  providers: [
    UserService,
    ConvertionHelper,
    UserHelper,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
  ],
})
export class AppModule {}
