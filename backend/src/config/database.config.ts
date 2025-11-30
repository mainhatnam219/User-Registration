import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: ['query', 'error', 'warn'],
  ssl: { rejectUnauthorized: false },
};
