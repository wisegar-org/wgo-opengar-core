import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../decorators/rest/Controller';
import { Delete } from '../../decorators/rest/Delete';
import { Get } from '../../decorators/rest/Get';
import { Post } from '../../decorators/rest/Post';
import { Put } from '../../decorators/rest/Put';
import { FormRegister, FormSoc } from './TestController';

@Controller('/user')
export default class UserController {
  @Get('/', null, null, null)
  public index(req: Request, res: Response) {
    return res.send('User overview');
  }

  // TODO example add GET Form
  @Get('/:name', null, null, null)
  public details(req: Request, res: Response, data: any) {
    return res.send(`You are looking at the profile of ${req.params.name}`);
  }

  @Put('/test', null, FormRegister, null)
  public test(req: Request, res: Response, data: FormRegister) {
    return res.send(`PUT ${JSON.stringify(data)}`);
  }

  @Post('/register/:soc', FormSoc, FormRegister, null)
  public register(req: Request, res: Response, data: FormRegister) {
    return res.send(`POST ${JSON.stringify(data)}`);
  }

  @Delete('/delete', null, FormRegister, null)
  public delete(req: Request, res: Response, data: FormRegister) {
    return res.send(`Delete ${JSON.stringify(data)}`);
  }
}
