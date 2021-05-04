import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { jwt } from './middlewares/JwtMiddleware';
import { InitializeRouter } from './Router';
import { JsonResponse } from './models/JsonResponse';
import ErrorHandler from './models/ErrorHandler';
import { IServerOptions } from './models/ServerOptions';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

export const bootGql = async (options: IServerOptions) => {
  const schema = await buildSchema({
    resolvers: options.resolvers,
    authChecker: options.authenticator,
    authMode: options.authMode ? options.authMode : 'null',
  });

  const server = new ApolloServer({
    introspection: !options.production,
    playground: !options.production,
    schema: schema,
    formatError: options.formatError,
    context: options.context,
  });

  server.applyMiddleware({ app: options.app });

  console.log(server.graphqlPath);
};

export const boot = async (options: IServerOptions, seedCallback?: any) => {
  options.app = options.app ? options.app : express();
  options.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  options.app.use(bodyParser.json({ limit: '50mb' }));
  options.app.use(jwt());

  InitializeRouter(options.controllers, options.app);

  await bootGql(options);

  options.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, err.statusCode || 500, err.message);
    res.json(response);
  });

  options.app.use((req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, 404, 'resource not found');
    res.json(response);
  });

  ((port = process.env.PORT || 5000) => {
    options.app.listen(port, () => console.log(`> Listening on port ${port}`));
  })();

  if (seedCallback) seedCallback();

  console.log('Server port: ', process.env.PORT);

  process.on('SIGINT', function () {
    process.exit(0);
  });
};
