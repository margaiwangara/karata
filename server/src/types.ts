import { Redis } from 'ioredis';
import { Request } from 'express';

export interface MyContext extends Request {
  redis: Redis;
}

export interface ErrorInterface {
  message: string;
  status: number;
}
