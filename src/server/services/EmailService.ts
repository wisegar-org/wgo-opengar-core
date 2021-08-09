import { ISettings, GetGenericConfig } from './ConfigService';
import { SuccessResponse, EmailOptions, ErrorResponse } from '@wisegar-org/wgo-opengar-shared';
import nodemailer from 'nodemailer';
import { GetEmailHostKey, GetEmailSenderKey, GetEmailSenderPassKey } from './ConfigService';

export class EmailServer {
  static async sendEmail(emailOpts: EmailOptions): Promise<any> {
    const config: ISettings = GetGenericConfig();
    const transporter = nodemailer.createTransport({
      host: GetEmailHostKey(),
      logger: true,
      debug: true,
      secure: false,
      auth: {
        user: GetEmailSenderKey(),
        pass: GetEmailSenderPassKey(),
      },
    });

    return new Promise<any>((resolve, reject) => {
      transporter.sendMail(emailOpts, (err, info) => {
        if (err) {
          reject(new ErrorResponse('Error sending email: ' + err.stack));
        } else {
          resolve(new SuccessResponse('Email sent: ' + info.response));
        }
      });
    });
  }
}
