import {
  SuccessResponse,
  EmailOptions,
  ErrorResponse,
  GetEmailPortKey,
  GetEmailSecureKey,
  GetEmailLogKey,
  GetEmailDebugKey,
  GetEmailHostKey,
  GetEmailSenderKey,
  GetEmailSenderPassKey,
  GetEmailSenderAnonymousKey,
} from '@wisegar-org/wgo-core';
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

  public async sendAnonymous(options: EmailOptions) {
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
    if (!emailOpts) throw 'Invalid email options';
    if (!emailOpts.from) emailOpts.from = GetEmailSenderKey();
    const isAnonymous = GetEmailSenderAnonymousKey();
    const transporter = isAnonymous ? await this.getAnonymousTransport() : await this.getTransport();
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

  /**
   * @deprecated Please use send method and class instance
   */
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
