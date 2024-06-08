import * as dotenv from 'dotenv';
import { ConvertionHelper } from './infrastructure/helpers/convertion.helper';
dotenv.config();

const convertionHelper = new ConvertionHelper();

export const TypeOrmConfig = {
  type: 'postgres',
  host: process.env.PG_DB_HOST,
  port: convertionHelper.convertDataToNumber(process.env.PG_DB_PORT),
  username: process.env.PG_DB_USERNAME,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,
  entities: ['dist/**/*.model{.ts,.js}'],
  migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
};

export const APP_PORT = process.env.PORT || 3000;
