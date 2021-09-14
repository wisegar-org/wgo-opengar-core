import Handlebars from 'handlebars';

export class HandlebarsTemplateService {
  /**
   *
   */
  constructor() {
    this.registerHelpers();
  }

  private registerHelpers() {
    Handlebars.registerHelper('dateDMY', function (str: string) {
      const date = new Date(str);
      return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
    });

    Handlebars.registerHelper('dateYMD', function (str: string) {
      const date = new Date(str);
      return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
    });

    Handlebars.registerHelper('prod', function (o1: string, o2: string) {
      const op1 = parseInt(o1);
      const op2 = parseInt(o2);
      return `${op1 * op2}`;
    });

    Handlebars.registerHelper('div', function (o1: string, o2: string) {
      const op1 = parseInt(o1);
      const op2 = parseInt(o2);
      return `${op1 / op2}`;
    });

    Handlebars.registerHelper('sum', function (o1: string, o2: string) {
      const op1 = parseInt(o1);
      const op2 = parseInt(o2);
      return `${op1 + op2}`;
    });

    Handlebars.registerHelper('subs', function (o1: string, o2: string) {
      const op1 = parseInt(o1);
      const op2 = parseInt(o2);
      return `${op1 - op2}`;
    });

    Handlebars.registerHelper('valOrUnset', function (str: string) {
      return `${str ? str : 'Unset'}`;
    });
  }

  public getTemplateData(template: string, data: any) {
    const handlTemplate = Handlebars.compile(template);
    return handlTemplate(data);
  }
}
