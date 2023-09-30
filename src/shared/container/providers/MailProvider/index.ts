import { container } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";

const mailProvider = {
  ethereal: EtherealMailProvider,
  ses: SESMailProvider,
};

container.registerSingleton<IMailProvider>(
  "MailProvider",
  process.env.MAIL_PROVIDER?.toLowerCase() === "ethereal"
    ? mailProvider.ethereal
    : mailProvider.ses,
);
