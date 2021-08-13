import { EmailOptions, IUser } from '@wisegar-org/wgo-opengar-shared';
import { Url } from 'node:url';
import {
  GetHostBaseKey,
  GetUserPoliceResetPwdEmailKey,
  GetUserPoliceResetPwdExpKey,
  GetUserPoliceResetPwdUrlKey,
  GetUserPoliceTokenKey,
} from '../ConfigService';
import { cypherData, decypherData } from '../CypherService';
import { EmailServer } from '../EmailService';

interface ITokenPayload {
  username: string;
  useremail: string;
  deferedKey: string;
  ramdonKey: string;
  expiration: string;
}

export class UserPoliceService {
  private readonly RESET_USER_PWD_KEY: string = 'Reset*User*Password*Key';
  private readonly CONFIRM_USER_PWD_KEY: string = 'Confirm*User*Password*Key';
  private readonly emailService: EmailServer;

  constructor() {
    this.emailService = new EmailServer();
  }

  generateResetUserPwdToken(user: IUser) {
    const tokenPayload: ITokenPayload = {
      deferedKey: this.RESET_USER_PWD_KEY,
      expiration: new Date().setMinutes(GetUserPoliceResetPwdExpKey()).toString(),
      ramdonKey: GetUserPoliceTokenKey(),
      useremail: user.email,
      username: user.username,
    };
    const userPoliceGenerationKey = JSON.stringify(tokenPayload);
    return cypherData(userPoliceGenerationKey);
  }

  validateResetUserPwdToken(cypherToken: string, user: IUser) {
    try {
      const decypheredToken = decypherData(cypherToken);
      const tokenPayload: ITokenPayload = JSON.parse(decypheredToken);
      if (new Date().getTime() > new Date(tokenPayload.expiration).getTime()) throw `ResetUserPwdToken expired`;
      if (tokenPayload.deferedKey !== this.RESET_USER_PWD_KEY) throw `ResetUserPwdToken invalid defered token data`;
      if (tokenPayload.ramdonKey !== GetUserPoliceTokenKey()) throw `ResetUserPwdToken invalid rmd token data`;
      if (tokenPayload.useremail !== user.email) throw `ResetUserPwdToken invalid umail token data`;
      if (tokenPayload.username !== user.username) throw `ResetUserPwdToken invalid uname token data`;
      return true;
    } catch (error) {
      throw `ResetUserPwdToken invalid: ${error}`;
    }
  }

  generateResetUserPwdTokenUrl(token: string): URL {
    const hostname = GetHostBaseKey();
    const resetPwdUrl = GetUserPoliceResetPwdUrlKey();
    return new URL(`${resetPwdUrl}/?val=${token}`, hostname);
  }

  defaultTokenHandler(user: IUser, link: URL, template: string) {
    template = template.replace('[LINK]', link.href);
    template = template.replace('[NAME]', user.name);
    template = template.replace('[LASTNAME]', user.lastname);
    template = template.replace('[USERNAME]', user.username);
    template = template.replace('[EMAIL]', user.email);
    return template;
  }

  loadResetUserPwdEmail(user: IUser, link: URL, tokenHander?: (user: IUser, link: URL, template: string) => string) {
    const fs = require('fs-extra');
    const resetUserPwdTemplate = GetUserPoliceResetPwdEmailKey();
    if (!fs.existsSync(resetUserPwdTemplate)) throw `Email template not found at ${resetUserPwdTemplate}`;
    let templateContent = fs.readFileSync(resetUserPwdTemplate);
    templateContent = templateContent.toString('utf8');
    if (tokenHander) return tokenHander(user, link, templateContent);
    return this.defaultTokenHandler(user, link, templateContent);
  }

  /**
   * @deprecated Please use requestResetUserPwd
   */
  async resetUserPwd(user: IUser, userIsValid: (user: IUser) => boolean) {
    const result = await this.requestResetUserPwd(user, userIsValid);
    return result;
  }

  async requestResetUserPwd(
    user: IUser,
    userIsValid: (user: IUser) => boolean,
    tokenHandler?: (token: string) => void
  ) {
    if (!userIsValid(user)) throw 'User not valid!';
    const resetUserPwdToken = this.generateResetUserPwdToken(user);
    const resetUserPwdUrl = this.generateResetUserPwdTokenUrl(resetUserPwdToken);
    if (tokenHandler) tokenHandler(resetUserPwdToken);
    const resetUserPwdTemplate = this.loadResetUserPwdEmail(user, resetUserPwdUrl);
    const result = await this.emailService.send({
      to: user.email,
      subject: 'Email Password Reset',
      html: resetUserPwdTemplate,
      from: undefined,
    });
    return result;
  }

  executeResetPwdToken(cypherToken: string, user: IUser, updatePassword: (user: IUser) => boolean) {
    const result = this.validateResetUserPwdToken(cypherToken, user);
    if (!result) throw `Impossible to execute the token validation`;
    if (!updatePassword) throw `User password update handler most be valid`;
    updatePassword(user);
  }
}
