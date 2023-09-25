import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider,
    @inject("EtherealMailProvider")
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "forgotPassword.hbs",
    );
    const subject = "Recuperação de senha";

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const token = uuidV4();

    const expires_date = this.dayjsDateProvider.addHours(
      Number(process.env.EXPIRES_EMAIL_FORGOT_PASSWORD_HOURS),
    );

    await this.usersTokensRepository.create({
      user_id: user.id!,
      expires_date,
      refresh_token: token,
    });

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };

    console.log("teste");

    await this.mailProvider.sendMail(email, subject, variables, templatePath);
  }
}

export { SendForgotPasswordMailUseCase };
