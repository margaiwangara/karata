import { Router, Response, Request } from 'express';

export class AuthController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  /**
   * register, login, forgot password, reset password, confirm email
   */
  public async register(req: Request, res: Response) {
    // email, name, password
    // const { email, password, name } = req.body;
  }
  /**
   * Configure routes for auth controller
   */
  public routes() {}
}
