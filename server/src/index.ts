import express, { Request, Response } from 'express';
import env from './env';
import { createConnection } from 'typeorm';
import { typeOrmConfig } from './config';

class Server {
  private app: express.Application;
  private PORT: number;

  constructor() {
    this.app = express();
    this.PORT = env.PORT;
    this.connnectDB();
    this.configuration();
    this.routes();
  }

  // connect db
  public async connnectDB() {
    await createConnection(typeOrmConfig);
  }

  // configure server
  public configuration() {}

  // configure routes
  public routes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World!');
    });
  }

  /**
   * Start server
   */
  public start() {
    this.app.listen(this.PORT, () => {
      console.log(`App running on port ${this.PORT} in ${env.NODE_ENV}`);
    });
  }
}

const server = new Server();
server.start();
