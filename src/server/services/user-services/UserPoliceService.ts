import { EmailOptions, IUser } from '@wisegar-org/wgo-opengar-shared';
import {
  GetHostBaseKey,
  GetUserPoliceResetPwdEmailKey,
  GetUserPoliceResetPwdUrlKey,
  GetUserPoliceTokenKey,
} from '../ConfigService';
import { cypherData } from '../CypherService';
import { EmailServer } from '../EmailService';

export class UserPoliceService {
  private readonly RESET_USER_PWD_KEY: string = 'Reset*User*Password*Key';
  private readonly CONFIRM_USER_PWD_KEY: string = 'Confirm*User*Password*Key';
  private readonly emailService: EmailServer;

  constructor() {
    this.emailService = new EmailServer();
  }

  generateResetUserPwdToken(user: IUser) {
    const ramdonKey = GetUserPoliceTokenKey();
    const userPoliceGenerationKey = `${user.username}*${this.RESET_USER_PWD_KEY}*${user.email}*${ramdonKey}`;
    return cypherData(userPoliceGenerationKey);
  }

  generateResetUserPwdTokenUrl(token: string): URL {
    const hostname = GetHostBaseKey();
    const resetPwdUrl = GetUserPoliceResetPwdUrlKey();
    return new URL(`${resetPwdUrl}/?val=${token}`, hostname);
  }

  loadResetUserPwdEmail(user: IUser, link: URL) {
    const fs = require('fs-extra');
    const resetUserPwdTemplate = GetUserPoliceResetPwdEmailKey();
    if (!fs.existsSync(resetUserPwdTemplate)) throw `Email template not found at ${resetUserPwdTemplate}`;
    let templateContent = fs.readFileSync(resetUserPwdTemplate);
    templateContent = templateContent.replace('[LINK]', link.href);
    templateContent = templateContent.replace('[NAME]', user.name);
    templateContent = templateContent.replace('[LASTNAME]', user.lastname);
    return templateContent;
  }

  async resetUserPwd(user: IUser, userIsValid: (user: IUser) => boolean) {
    if (!userIsValid(user)) throw 'User not valid!';
    const resetUserPwdToken = this.generateResetUserPwdToken(user);
    const resetUserPwdUrl = this.generateResetUserPwdTokenUrl(resetUserPwdToken);
    const resetUserPwdTemplate = this.loadResetUserPwdEmail(user, resetUserPwdUrl);

    const result = await this.emailService.send({
      to: user.email,
      subject: 'Email Password Reset',
      html: resetUserPwdTemplate,
      from: undefined,
    });
    return result;
  }
}
