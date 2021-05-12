import { SuccessResponse, EmailOptions, ErrorResponse } from '@wisegar-org/wgo-opengar-shared';
import nodemailer from 'nodemailer';

export class EmailServer {
  static async sendEmail(emailOpts: EmailOptions): Promise<any> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      logger: true,
      debug: true,
      secure: false,
      auth: {
        user: process.env.EMAIL_SENDER_ADDRESS,
        pass: process.env.EMAIL_SENDER_PASSWORD,
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
