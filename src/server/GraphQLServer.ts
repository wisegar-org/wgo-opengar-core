import express, { Request, Response, NextFunction } from 'express';
import { jwt } from './middlewares/JwtMiddleware';
import { JsonResponse } from './models/JsonResponse';
import ErrorHandler from './models/ErrorHandler';
import { IServerOptions } from './models/IServerOptions';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Context } from '@wisegar-org/wgo-core';
import { IContextOptions } from './models/IContextOptions';

const getGqlSchema = async (options: IServerOptions) => {
  return await buildSchema({
    resolvers: options.resolvers,
    authChecker: (context, roles: any) => {
      return options.authenticator(context as Context, roles);
    },
    authMode: options.authMode ? options.authMode : 'null',
  });
};

const getGqlServer = async (options: IServerOptions) => {
  const schema = await getGqlSchema(options);
  return new ApolloServer({
    introspection: !options.production,
    playground: !options.production,
    schema: schema,
    formatError: options.formatError,
    context: async ({ req, res }) => {
      const contextOptions: IContextOptions = {
        tokenPayload: (req as any).tokenPayload,
        requestHeaders: req.headers,
      };
      return await options.context(contextOptions);
    },
    uploads: true,
  });
};

export const bootFullGql = async (options: IServerOptions, seedCallback?: any) => {
  options.app = options.app ? options.app : express();
  options.app.use(jwt(options));

  const server = await getGqlServer(options);

  if (options.middlewares) {
    options.middlewares(options.app);
  }

  server.applyMiddleware({ app: options.app });

  console.log(`GraphQL Path: ${server.graphqlPath}`);

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

export const bootGql = async (options: IServerOptions) => {
  const server = await getGqlServer(options);

  server.applyMiddleware({ app: options.app });

  console.log(`GraphQL Path: ${server.graphqlPath}`);
};
