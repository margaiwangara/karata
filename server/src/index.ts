import connectRedis from 'connect-redis';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { sessionConfig, typeOrmConfig, swaggerOptions } from './config';
import { AuthController } from './controllers';
import { GameController } from './controllers';
import env from './env';
import { MyContext } from './types';
import { to } from './middleware/async';
import { errorMiddleware, HttpException } from './middleware/error';
// import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

class Server {
  private app: express.Application;
  private PORT: number;
  private authController: AuthController;
  private gameController: GameController;
  private RedisStore: connectRedis.RedisStore;
  private redis: Redis.Redis;
  private sessionMiddleware: any;
  private jsDocSpecs: any;

  constructor() {
    this.app = express();
    this.PORT = env.PORT;
    this.connnectDB();
    this.configuration();
    this.authController = new AuthController();
    this.gameController = new GameController();
    this.routes();
    this.error();
    this.jsDocSpecs = swaggerJSDoc(swaggerOptions);
  }

  // connect db
  public async connnectDB() {
    const [error, _result] = await to(createConnection(typeOrmConfig));

    if (error) {
      console.log('TypeOrm Conn Error', error);
    }
  }

  // configure server
  public configuration() {
    this.redis = new Redis();
    this.RedisStore = connectRedis(session);
    this.sessionMiddleware = session(
      sessionConfig(this.RedisStore, this.redis),
    );

    // init middleware
    this.app.set('view engine', 'ejs');
    this.app.set('views', __dirname + '/views');

    this.app.use(express.json());
    this.app.use(this.sessionMiddleware);
    this.app.use(express.static(__dirname + '/public'));
  }

  // attach redis to request and pass as middleware
  private attachRedis = (req: Request, _: Response, next: NextFunction) => {
    (req as MyContext).redis = this.redis;
    next();
  };

  // configure routes
  public routes() {
    this.app.get('/', (_: Request, res: Response) => {
      res.render('index');
    });
    // this.app.use(
    //   '/api-docs',
    //   swaggerUI.serve,
    //   swaggerUI.setup(this.jsDocSpecs),
    // );
    this.app.use('/api/auth', this.attachRedis, this.authController.router);
    this.app.use('/api', this.gameController.router);
  }

  // handle error
  private error() {
    this.app.use(function (_req: Request, _res: Response, next: NextFunction) {
      const error = new Error('Not Found');
      (error as HttpException).status = 404;
      next(error);
    });
    this.app.use(errorMiddleware);
  }

  // start server
  public start() {
    this.app.listen(this.PORT, () => {
      console.log(`App running on port ${this.PORT} in ${env.NODE_ENV}`);
    });
  }
}

const server = new Server();
server.start();
