import { createConnection } from 'typeorm';
import { User, GameEntity } from './entities';
import { __prod__ } from './constants';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';
import env from './env';
import { Options } from 'swagger-jsdoc';

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

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Karata Card Game API',
      version: '0.0.1',
      description:
        'This is a card game API developed with Node, Express and TypeOrm.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Margai Wangara',
        url: 'https://margaiwangara.me',
        email: 'margaiwangara@gmail.com',
      },
    },
    schemes: ['http'],
    host: env.SERVER_URL,
    basePath: '/api',
    paths: {},
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./docs/auth.ts'],
};
