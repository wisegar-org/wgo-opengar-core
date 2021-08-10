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
  protected async getAnonymousTransport() {
    return nodemailer.createTransport({
      host: GetEmailHostKey(),
      logger: GetEmailLogKey(),
      debug: GetEmailDebugKey(),
      port: GetEmailPortKey(),
      secure: GetEmailSecureKey(),
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  protected async getTransport() {
    return nodemailer.createTransport({
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
  }

  public async sendAnonimous(options: EmailOptions) {
    const transporter = await this.getAnonymousTransport();
    return new Promise<any>((resolve, reject) => {
      transporter.sendMail(options, (err, info) => {
        if (err) {
          reject(new ErrorResponse('Error sending email: ' + err.stack));
        } else {
          resolve(new SuccessResponse('Email sent: ' + info.response));
        }
      });
    });
  }

  public async send(emailOpts: EmailOptions) {
    const transporter = await this.getTransport();
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
