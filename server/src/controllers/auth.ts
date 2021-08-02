import { Router, Response, Request } from 'express';
import { AuthService } from '../services';
export class AuthController {
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.routes();
  }

  public register = async (_: Request, res: Response) => {
    res.send(await this.authService.register());
  };

  public login = async (_: Request, res: Response) => {
    res.send(await this.authService.login());
  };
  public forgotPassword = async (_: Request, res: Response) => {
    res.send(await this.authService.forgotPassword());
  };

  public resetPassword = async (_: Request, res: Response) => {
    res.send(await this.authService.resetPassword());
  };

  public confirmEmail = async (_: Request, res: Response) => {
    res.send(await this.authService.confirmEmail());
  };

  public routes() {
    this.router.post('/register', this.register);
    this.router.post('/login', this.login);
    this.router.post('/forgot-password', this.forgotPassword);
    this.router.post('/reset-password', this.resetPassword);
    this.router.get('/confirm-email', this.confirmEmail);
  }
}
