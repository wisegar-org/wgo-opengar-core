import 'reflect-metadata';
import { RouteDefinition } from './decorators/models/RouteDefinition';
import { ExportableForm, SimpleValidationError } from './decorators/rest/Export';
import { Request, Response } from 'express';

export class ExportData {
  static instance: ExportData;
  routes: RouteDefinition[];

  errorResponse: (errors: unknown) => unknown;

  defaultErrorResponse(errors: unknown): unknown {
    return { ok: false, data: errors, error: 'form.wrong.data' };
  }

  constructor() {
    this.routes = [];
    this.errorResponse = this.defaultErrorResponse;
  }

  setResponseErrorTransform(transformFn: Function): boolean {
    if (typeof transformFn == 'function') {
      this.errorResponse = transformFn as (errors: unknown) => unknown;
      return true;
    }
    return false;
  }

  static getInstance(): ExportData {
    if (!this.instance) {
      this.instance = new ExportData();
    }
    return this.instance;
  }
}

const parseForms = async (instance: any, route: RouteDefinition, req: Request, res: Response): Promise<void> => {
  const exports = ExportData.getInstance();
  let paramsErrors: SimpleValidationError[] = [];
  if (route.formParams) {
    paramsErrors = await (route.formParams as ExportableForm).parseBody(req.params);
  }
  let bodyErrors: SimpleValidationError[] = [];
  if (route.formBody) {
    bodyErrors = await (route.formBody as ExportableForm).parseBody(req.body);
  }
  if (paramsErrors.length > 0 || bodyErrors.length > 0) {
    res.json(exports.errorResponse(paramsErrors.concat(bodyErrors)));
    return;
  }
  instance[route.methodName](req, res, route.formParams, route.formBody);
  return;
};

export const InitializeRouter = (controllers: any[], app: any) => {
  controllers.forEach((controller) => {
    const exports = ExportData.getInstance();
    const instance = new controller();
    const prefix = Reflect.getMetadata('prefix', controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

    exports.routes = exports.routes.concat(routes);

    routes.forEach((route) => {
      switch (route.requestMethod) {
        case 'get':
          app.get(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;

        case 'post':
          app.post(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;

        case 'put':
          app.put(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;

        case 'delete':
          app.delete(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;
      }
    });
  });
};
