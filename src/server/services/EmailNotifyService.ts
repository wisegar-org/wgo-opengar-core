import { EmailOptions, IEmailNotify } from '@wisegar-org/wgo-opengar-shared';
import { GetEmailAppAddressKey, GetEmailAppAddressNameKey } from './ConfigService';
import { EmailServer } from './EmailService';
import { HandlebarsTemplateService } from './HandlebarsTemplateService';

export class EmailNotifyService {
  private emailServer: EmailServer;
  private handlebarsTemplate: HandlebarsTemplateService;

  /**
   *
   */
  constructor() {
    this.emailServer = new EmailServer();
    this.handlebarsTemplate = new HandlebarsTemplateService();
  }

  async sendNotification(config: IEmailNotify) {
    const { to, subject } = config.emailOptions;
    const { template, data } = config.bodyTemplate;
    const body = data ? this.handlebarsTemplate.getTemplateData(template, data) : template;
    const result = await this.emailServer.send(<EmailOptions>{
      from: `${GetEmailAppAddressNameKey()} <${GetEmailAppAddressKey()}>`,
      subject: subject,
      to: to,
      html: body,
    });
    return result;
  }
}
