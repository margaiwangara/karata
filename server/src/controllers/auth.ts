import { Router, Response, Request, NextFunction } from 'express';
import { AuthService } from '../services';
import { User } from '../entities';
import { v4 as uuidv4 } from 'uuid';
import { storeTokenInRedis } from '../utils';
import { CONFIRM_EMAIL_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants';
import { MyContext } from '../types';
import { HttpException } from '../middleware/error';
import env from '../env';
export class AuthController {
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.routes();
  }

  public me = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session as any).userId;

    if (!userId) {
      return next(new HttpException('Unauthorized Access', 401));
    }

    const user = await User.findOne(userId);

    if (!user) {
      return next(new HttpException('Unauthorized Access', 401));
    }

    const { password, ...rest } = user;

    return res.status(200).json(rest);
  };

  public register = async (req: Request, res: Response) => {
    const body = req.body as User;
    const { password, ...user } = await this.authService.register(body);

    // generate token for email confirmation and store in Redis
    const token = uuidv4();

    await storeTokenInRedis(
      (req as MyContext).redis,
      CONFIRM_EMAIL_PREFIX + token,
      user.id,
      30,
    );

    return res.status(201).json(user);
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as User;
    const [error, user] = await this.authService.login(body);

    if (error) {
      return next(new HttpException(error.message, error.status));
    }

    // store id in session
    (req.session as any).userId = user?.id;

    return res
      .status(200)
      .json({ email: user?.email, name: user?.name, surname: user?.surname });
  };

  public forgotPassword = async (req: Request, res: Response) => {
    const body = req.body as User;
    const id = await this.authService.forgotPassword(body.email);

    if (!id) {
      return res.status(400).json({
        success: false,
      });
    }

    // store token in redis
    const token = uuidv4();
    await storeTokenInRedis(
      (req as MyContext).redis,
      FORGOT_PASSWORD_PREFIX + token,
      id,
      3,
    );

    return res.status(200).json({
      token,
      success: true,
    });
  };

  // /api/auth/reset-password/:token
  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { password, confirm_password } = req.body as User & {
      confirm_password: string;
    };
    const token = req.params.token;

    if (!password) {
      return next(new HttpException('Password is required', 400));
    }

    if (!confirm_password) {
      return next(new HttpException('Confirm Password is required', 400));
    }

    if (confirm_password !== password) {
      return next(
        new HttpException('Password and Confirm Password must match', 400),
      );
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await (req as MyContext).redis.get(key);

    if (!userId) {
      return next(new HttpException('Invalid token', 401));
    }

    const user = await this.authService.resetPassword(
      parseInt(userId, 10),
      password,
    );

    if (!user) {
      return next(new HttpException('User not found', 404));
    }

    // delete token from Redis
    await (req as MyContext).redis.del(key);

    return res.status(200).json({
      success: true,
    });
  };

  public logout(req: Request, res: Response, next: NextFunction) {
    return new Promise((resolve) =>
      req.session.destroy((error) => {
        if (error) {
          console.log('logout error', error);
          resolve(false);
          return next(new HttpException('User logout failed', 500));
        }

        res.clearCookie(env.COOKIE_NAME_AUTH);
        return res.status(200).json({
          success: true,
        });
      }),
    );
  }

  public confirmEmail = async (_: Request, res: Response) => {
    res.send(await this.authService.confirmEmail());
  };

  public routes() {
    this.router.post('/register', this.register);
    this.router.post('/login', this.login);
    this.router.post('/forgot-password', this.forgotPassword);
    this.router.post('/reset-password/:token', this.resetPassword);
    this.router.get('/confirm-email', this.confirmEmail);
    this.router.post('/logout', this.logout);
    this.router.get('/me', this.me);
  }
}
