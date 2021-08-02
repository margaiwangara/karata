import express, { Request, Response } from 'express';
import env from './env';
import { createConnection } from 'typeorm';
import { typeOrmConfig } from './config';
import { AuthController } from './controllers';
class Server {
  private app: express.Application;
  private PORT: number;
  private authController: AuthController;

  constructor() {
    this.app = express();
    this.PORT = env.PORT;
    this.connnectDB();
    this.authController = new AuthController();
    this.configuration();
    this.routes();
  }

  // connect db
  public async connnectDB() {
    await createConnection(typeOrmConfig);
  }

  // configure server
  public configuration() {
    this.app.use(express.json());
  }

  // configure routes
  public routes() {
    this.app.get('/', (_: Request, res: Response) => {
      res.send('Welcome to Karata!');
    });

    this.app.use('/api/auth', this.authController.router);
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
