import { BasicResponse, SuccessResponse } from '../models/responseModels/BasicResponse';
import nodemailer from "nodemailer";
import { EmailOptions } from "../models/EmailOptions";
import { ErrorResponse } from "../models/responseModels/BasicResponse";

export class EmailServer {
  static async sendEmail(emailOpts: EmailOptions): Promise<BasicResponse> {
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

    return new Promise<BasicResponse>((resolve, reject) => {
      transporter.sendMail(emailOpts, (err, info) => {
        if (err) {
          reject(new ErrorResponse("Error sending email: "+ err.stack))
        } else {
          resolve(new SuccessResponse("Email sent: " + info.response))
        }
      });
    })
  }
}
