import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { jwt } from './middlewares/JwtMiddleware';
import { InitializeRouter as bootRestServerRouter } from './RestServer';
import { JsonResponse } from './models/JsonResponse';
import ErrorHandler from './models/ErrorHandler';
import { IServerOptions } from './models/IServerOptions';
import 'reflect-metadata';
import cors from 'cors';
import { bootFullGql, bootGql as bootGqlServer } from './GraphQLServer';

export const bootRestOnly = (options: IServerOptions, seedCallback?: any) => {
  options.app = options.app ? options.app : express();
  options.app.use(cors());
  options.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  options.app.use(bodyParser.json({ limit: '50mb' }));

  options.app.use(jwt(options));

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  if (options.controllers) {
    bootRestServerRouter(options.controllers, options.app);
  }

  options.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, err.statusCode || 500, err.message);
    res.json(response);
  });

  options.app.use((req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, 404, 'resource not found');
    res.json(response);
  });

  (() => {
    options.app.listen(options.port, () => console.log(`> Listening on port ${options.port}`));
  })();

  if (seedCallback) seedCallback();

  console.log('Server port: ', process.env.PORT);

  process.on('SIGINT', function () {
    process.exit(0);
  });
};

export const boot = async (options: IServerOptions, seedCallback?: any) => {
  if (options.useOnlyGraphQL) {
    await bootFullGql(options);
    return;
  }

  options.app = options.app ? options.app : express();
  options.app.use(cors());
  options.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  options.app.use(bodyParser.json({ limit: '50mb' }));

  options.app.use(jwt(options));

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  if (options.controllers) {
    bootRestServerRouter(options.controllers, options.app);
  }

  if (options.resolvers) {
    await bootGqlServer(options);
  }

  options.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, err.statusCode || 500, err.message);
    res.json(response);
  });

  options.app.use((req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, 404, 'resource not found');
    res.json(response);
  });

  (() => {
    options.app.listen(options.port, () => console.log(`> Listening on port ${options.port}`));
  })();

  if (seedCallback) seedCallback();

  console.log('Server port: ', process.env.PORT);

  process.on('SIGINT', function () {
    process.exit(0);
  });
};
