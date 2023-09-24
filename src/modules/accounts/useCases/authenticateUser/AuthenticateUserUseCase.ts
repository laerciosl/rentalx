import { compare } from "bcrypt";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    config();
    const {
      SECRET_PRIVATE_KEY,
      EXPIRES_IN_TOKEN,
      SECRET_REFRESH_TOKEN,
      EXPIRES_IN_REFRESH_TOKEN,
      EXPIRES_REFRESH_TOKEN_DAYS,
    } = process.env;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!");
    }

    const token = sign({}, SECRET_PRIVATE_KEY!, {
      subject: user.id,
      expiresIn: EXPIRES_IN_TOKEN!,
    });

    const refresh_token = sign({ email }, SECRET_REFRESH_TOKEN!, {
      subject: user.id,
      expiresIn: EXPIRES_IN_REFRESH_TOKEN!,
    });

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(
      Number(EXPIRES_REFRESH_TOKEN_DAYS),
    );

    await this.usersTokensRepository.create({
      user_id: user.id!,
      expires_date: refresh_token_expires_date,
      refresh_token,
    });

    const tokenReturn: IResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
