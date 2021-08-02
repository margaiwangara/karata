import express, { Request, Response } from 'express';
import env from './env';

class Server {
  private app: express.Application;
  private PORT: number;

  constructor() {
    this.app = express();
    this.PORT = env.PORT || 5000;
    this.configuration();
    this.routes();
  }

  /**
   * Configure server
   */

  public configuration() {}

  /**
   * Configure routes
   */

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
