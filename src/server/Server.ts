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
import cors from 'cors';
import { Context } from './graphql/Models';
import { AccessTokenData, jwtMiddleware } from '..';
import { graphqlUploadExpress } from 'graphql-upload';

export const bootGql = async (options: IServerOptions) => {
  const schema = await buildSchema({
    resolvers: options.resolvers,
    authChecker: (context, roles: any) => {
      return options.authenticator(context as Context, roles);
    },
    authMode: options.authMode ? options.authMode : 'null',
  });

  const server = new ApolloServer({
    introspection: !options.production,
    playground: !options.production,
    schema: schema,
    formatError: options.formatError,
    context: async ({ req, res }) => {
      const tokenData: AccessTokenData = jwtMiddleware(req, res);
      const context = await options.context(tokenData);
      return context;
    },
  });

  options.app.use(graphqlUploadExpress());

  server.applyMiddleware({ app: options.app });

  console.log(`GraphQL Path: ${server.graphqlPath}`);
};

export const boot = async (options: IServerOptions, seedCallback?: any) => {
  options.app = options.app ? options.app : express();
  options.app.use(cors());
  options.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  options.app.use(bodyParser.json({ limit: '50mb' }));

  options.app.use(jwt(options));

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  if (options.disableRest && options.controllers) {
    InitializeRouter(options.controllers, options.app);
  }

  if (options.disableGraphQL && options.resolvers) {
    await bootGql(options);
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
