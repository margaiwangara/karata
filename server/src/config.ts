import { createConnection } from 'typeorm';
import { User, GameEntity } from './entities';
import { __prod__ } from './constants';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';
import env from './env';

export const typeOrmConfig = {
  type: 'postgres',
  database: 'karata',
  username: 'postgres',
  password: 'postgres',
  entities: [User, GameEntity],
  logging: ['error'],
  synchronize: true,
} as Parameters<typeof createConnection>[0];

export const sessionConfig = (RedisStore: RedisStore, redisClient: Redis) => ({
  name: env.COOKIE_NAME_AUTH,
  store: new RedisStore({ client: redisClient, disableTouch: true }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 60 * 24 * env.COOKIE_EXPIRE,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: __prod__, // cookie only works in https
  },
});
