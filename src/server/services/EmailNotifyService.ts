import { EmailOptions, EmailServer, IEmailNotify } from '@wisegar-org/wgo-mailer';
import { GetEmailAppAddressKey, GetEmailAppAddressNameKey } from '@wisegar-org/wgo-settings';
import { HandlebarsTemplateService } from '@wisegar-org/wgo-templating';

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
    const { template, data } = config.bodyTemplate;
    const body = data ? this.handlebarsTemplate.getTemplateData(template, data) : template;
    const result = await this.emailServer.send(<EmailOptions>{
      ...config.emailOptions,
      from: `${GetEmailAppAddressNameKey()} <${GetEmailAppAddressKey()}>`,
      html: body || config.emailOptions.html,
    });
    return result;
  }
}
