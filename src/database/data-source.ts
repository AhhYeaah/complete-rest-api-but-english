process.env.confg;
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { requiredEnv } from '../utils/env/Required';
import { Account } from './entities/Account';

export const AppDataSource = new DataSource({
  type: requiredEnv(process.env.TYPE),
  host: requiredEnv(process.env.HOST),
  port: requiredEnv(process.env.PORT),
  username: requiredEnv(process.env.ROOT_USERNAME),
  password: requiredEnv(process.env.PASSWORD),
  database: requiredEnv(process.env.DATABASE_NAME),
  synchronize: true,
  logging: false,
  entities: [Account],
});
