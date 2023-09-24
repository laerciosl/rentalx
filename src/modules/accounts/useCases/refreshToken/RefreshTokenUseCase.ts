import { config } from "dotenv";
import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider,
  ) {}
  async execute(token: string): Promise<string> {
    config();
    const { email, sub } = verify(
      token,
      process.env.SECRET_REFRESH_TOKEN!,
    ) as IPayload;

    const user_id = sub;

    const userToken =
      await this.usersTokensRepository.findUserByIdAndRefreshToken(
        user_id,
        token,
      );
    console.log(userToken);

    if (!userToken) {
      throw new AppError("Refresh Token does not exists!");
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, process.env.SECRET_REFRESH_TOKEN!, {
      subject: sub,
      expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN!,
    });

    const expires_date = this.dayjsDateProvider.addDays(
      Number(process.env.EXPIRES_REFRESH_TOKEN_DAYS),
    );

    await this.usersTokensRepository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    console.log(refresh_token);

    return refresh_token;
  }
}

export { RefreshTokenUseCase };
