import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { formatError } from "./ErrorHandler";
import { GetContext } from "./ContextHandler";
import { Authenticator } from "./AuthHandler";
import {
  AuthChecker,
  AuthMode,
  buildSchema,
  NonEmptyArray,
} from "type-graphql";
import { Context } from "./Models";

export interface IServerOptions {
  app: any;
  production?: boolean;
  resolvers: NonEmptyArray<Function>;
  authenticator: AuthChecker<Context>;
  formatError: (err: Error) => Error;
  context: any;
  authMode?: AuthMode;
}

export const gqlBoot = async (options: IServerOptions) => {
  const schema = await buildSchema({
    resolvers: options.resolvers,
    authChecker: options.authenticator,
    authMode: options.authMode ? options.authMode : "null",
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

export async function boot(app: any, resolvers: any, production?: boolean) {
  const schema = await buildSchema({
    resolvers: resolvers,
    authChecker: Authenticator,
    authMode: "null",
  });

  const server = new ApolloServer({
    introspection: !production,
    playground: !production,
    schema,
    formatError: formatError,
    context: GetContext,
  });

  server.applyMiddleware({ app });

  console.log(server.graphqlPath);
}
