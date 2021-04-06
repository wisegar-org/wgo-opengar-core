import { buildSchema } from "type-graphql";
import { GetResolvers } from "./ResolverHandler";
import { Authenticator } from "./AuthHandler";

export const GetSchema = async () => {
  return await buildSchema({
    resolvers: GetResolvers(),
    authChecker: Authenticator,
    authMode: "null",
  });
};
