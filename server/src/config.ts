import { createConnection } from 'typeorm';
import { User } from './entities';
import { __prod__ } from './constants';

export const typeOrmConfig = {
  type: 'postgres',
  database: 'karata',
  username: 'postgres',
  password: 'postgres',
  entities: [User],
  logging: !__prod__,
  synchronize: true,
} as Parameters<typeof createConnection>[0];
