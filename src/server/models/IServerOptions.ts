import { AuthMode, NonEmptyArray } from 'type-graphql';
import { Context } from '../graphql/Models';
import { IContextOptions } from './IContextOptions';

export interface IServerOptions {
  /**
   * @summary If not provided a new instance on Express app server w'll be used
   */
  app?: any;
  controllers: any[];
  resolvers?: NonEmptyArray<Function>;
  authenticator: (userContext: Context, roles: any) => Promise<boolean>;
  formatError: (err: Error) => Error;
  context: (contextOptions: IContextOptions) => Promise<Context>;
  authMode?: AuthMode;
  production?: boolean;
  middlewares?: (app: any) => void;
  port: number;
  //Max allowed non-file multipart form field size in bytes; enough for your queries (default: 1 MB).
  maxFieldSize?: number;
  //Max allowed file size in bytes (default: Infinity).
  maxFileSize?: number;
  //Max allowed number of files (default: Infinity).
  maxFiles?: number;
  useOnlyGraphQL?: boolean;
}
