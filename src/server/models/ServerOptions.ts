import { AuthChecker, AuthMode, NonEmptyArray } from 'type-graphql';
import { Context } from '../graphql/Models';

export interface IServerOptions {
  /**
   * @summary If not provided a new instance on Express app server w'll be used
   */
  app?: any;
  controllers: any[];
  resolvers: NonEmptyArray<Function>;
  authenticator: AuthChecker<Context>;
  formatError: (err: Error) => Error;
  context: any;
  authMode?: AuthMode;
  production?: boolean;
}
