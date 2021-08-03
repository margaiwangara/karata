// import { UserRepository } from '../respositories';
// import { getConnection } from 'typeorm';
import { User } from '../entities';
import argon2 from 'argon2';
import { ErrorInterface } from '../types';

export class AuthService {
  // private userRepository: UserRepository;

  constructor() {
    // this.userRepository =
    //   getConnection('karata').getCustomRepository(UserRepository);
  }

  // register new user
  public register = async (user: User) => {
    const { password, ...rest } = user;
    const hashed = await argon2.hash(password);

    const newUser = await User.create({ ...rest, password: hashed }).save();

    return newUser;
  };

  // login user
  public login = async (
    user: User,
  ): Promise<[ErrorInterface | null, User | undefined]> => {
    const { password, email } = user;
    const usr = await User.findOne({ where: { email } });

    const error = {
      message: 'Invalid Email or Password',
      status: 400,
    } as ErrorInterface;

    if (!usr) {
      return [error, undefined];
    }

    const valid = await argon2.verify(usr!.password, password);

    if (!valid) {
      return [error, undefined];
    }

    return [null, usr];
  };

  // enter email to get token and link
  public forgotPassword = async (email: string): Promise<number | boolean> => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    return user.id;
  };

  public resetPassword = async (
    userId: number,
    password: string,
  ): Promise<boolean> => {
    const user = await User.findOne(userId);

    if (!user) {
      return false;
    }

    const hashedPassword = await argon2.hash(password);

    await User.update({ id: user.id }, { password: hashedPassword });

    return true;
  };

  public async confirmEmail() {
    return {
      message: 'Confirm Email',
    };
  }
}
