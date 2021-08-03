import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const env = cleanEnv(process.env, {
  // node environment - production, testing, development
  NODE_ENV: str({ default: 'development' }),

  // node env port - 5000
  PORT: num({ default: 5000 }),

  // session
  COOKIE_NAME_AUTH: str(),
  SESSION_SECRET: str(),
  COOKIE_EXPIRE: num(),
});

export default env;
