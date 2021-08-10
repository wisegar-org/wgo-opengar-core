import {
  ISettings,
  GetEmailPortKey,
  GetEmailSecureKey,
  GetEmailLogKey,
  GetEmailDebugKey,
  GetEmailHostKey,
  GetEmailSenderKey,
  GetEmailSenderPassKey,
} from './ConfigService';
import { SuccessResponse, EmailOptions, ErrorResponse } from '@wisegar-org/wgo-opengar-shared';
import nodemailer from 'nodemailer';
export class EmailServer {
  static async sendEmail(emailOpts: EmailOptions): Promise<any> {
    const transporter = nodemailer.createTransport({
      host: GetEmailHostKey(),
      logger: GetEmailLogKey(),
      debug: GetEmailDebugKey(),
      port: GetEmailPortKey(),
      secure: GetEmailSecureKey(),
      auth: {
        user: GetEmailSenderKey(),
        pass: GetEmailSenderPassKey(),
      },
      tls: {
        rejectUnauthorized: false,
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
