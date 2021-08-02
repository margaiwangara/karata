export class AuthService {
  constructor() {}

  public async register() {
    return {
      message: 'Register',
    };
  }

  public async login() {
    return {
      message: 'Login',
    };
  }

  public async forgotPassword() {
    return {
      message: 'Forgot Password',
    };
  }

  public async resetPassword() {
    return {
      message: 'Reset Password',
    };
  }

  public async confirmEmail() {
    return {
      message: 'Confirm Email',
    };
  }
}
