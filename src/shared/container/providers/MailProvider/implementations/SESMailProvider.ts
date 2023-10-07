import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import * as aws from "@aws-sdk/client-ses";

import { IMailProvider } from "../IMailProvider";

@injectable()
class SESMailProvider implements IMailProvider {
  private client!: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: {
        ses: new aws.SES({
          apiVersion: "2010-12-01",
          region: process.env.AWS_REGION,
          credentials: {
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          },
        }),
        aws,
      },
    });
  }
  async sendMail(
    to: string,
    subject: string,
    variables: object,
    path: string,
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      from: "Rentx <laercio.silva@mawad.com.br>",
      to,
      subject,
      html: templateHTML,
    });
  }
}

export { SESMailProvider };
