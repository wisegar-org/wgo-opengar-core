import { AuthMode, NonEmptyArray } from 'type-graphql';
import { Context } from '../graphql/Models';

export interface IServerOptions {
  /**
   * @summary If not provided a new instance on Express app server w'll be used
   */
  app?: any;
  controllers: any[];
  resolvers?: NonEmptyArray<Function>;
  authenticator: (userContext: Context, roles: any) => Promise<boolean>;
  formatError: (err: Error) => Error;
  context: (payload: any) => Promise<Context>;
  authMode?: AuthMode;
  production?: boolean;
  middlewares?: (app: any) => void;
  port: number;
}
