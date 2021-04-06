import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { formatError } from "./ErrorHandler";
import { GetContext } from "./ContextHandler";
import { Authenticator } from "./AuthHandler";
import { buildSchema } from "type-graphql";

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
