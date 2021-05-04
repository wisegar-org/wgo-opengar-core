import { Request, Response } from 'express';

import { IsEmail, Length } from 'class-validator';
import { ExportableForm } from '../../decorators/rest/Export';
import { Controller } from '../../decorators/rest/Controller';
import { Get } from '../../decorators/rest/Get';
import { Put } from '../../decorators/rest/Put';

export class FormRegister extends ExportableForm {
  @IsEmail()
  email: string;
  @Length(6, 32)
  password: string;
  constructor() {
    super();
    this.email = '';
    this.password = '';
  }
}

export class FormTest extends ExportableForm {
  @Length(6, 32)
  name: string;
  constructor() {
    super();
    this.name = '';
  }
}
export class FormSoc extends ExportableForm {
  @Length(6, 8)
  soc: string;
  constructor() {
    super();
    this.soc = '';
  }
}

export class ResponseTest {
  name: string;
  constructor() {
    this.name = '';
  }
}

@Controller('/test')
export default class TestController {
  @Get('/', null, null, null)
  public index(req: Request, res: Response) {
    return res.send('User overview');
  }

  @Get('/:name', FormTest, null, null)
  public details(req: Request, res: Response) {
    if (!req.params.formIsValid) {
      return res.send(`Yours  parameters are wrong ${req.params.formErrors}`);
    }
    return res.send(`You are looking at the profile of ${JSON.stringify(req.params)}`);
  }

  @Put('/test', null, FormRegister, ResponseTest)
  public test(req: Request, res: Response) {
    if (!req.params.formIsValid) {
      return res.send(`Yours  parameters are wrong ${req.params.formErrors}`);
    }
    return res.send('ok');
  }
}
