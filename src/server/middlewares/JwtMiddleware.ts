import { AuthError } from '@wisegar-org/wgo-opengar-shared';
import express from 'express';
import { isNullOrUndefined } from '../../utils/Validator';
import { IContextOptions } from '../models/IContextOptions';
import { IServerOptions } from '../models/IServerOptions';
import { AccessTokenData, jwtMiddleware } from '../services/JwtAuthService';

const isGraphql = (req: express.Request) => {
  return req.originalUrl.includes('graphql');
};

const expressTokenErrorHandler = (res: express.Response, error: any) => {
  console.error(error);
  res.status(401);
  res.statusMessage = `${AuthError.NotAuthorized}`;
  res.end();
};

const graphqlTokenErrorHandler = (res: express.Response, error: any) => {
  console.error(error);
  res.status(200);
  res.send(`{"errors":[{"message":"${AuthError.NotAuthorized}"}, {"message":"${error}"}], "data":null }`);
  res.end();
};

export const jwt = (options: IServerOptions) => {
  return (req: express.Request, res: express.Response, next: () => void) => {
    try {
      /**
       * If graphql request, the token handler w'll be executed into the context server function. Context and token resolution here are actually unneeded!
       */
      if (isGraphql(req)) {
        next();
        return;
      }

      const tokenData: AccessTokenData = jwtMiddleware(req, res);
      if (isNullOrUndefined(tokenData)) {
        next();
        return;
      }
      const contextOptions: IContextOptions = Object.assign({}, tokenData);
      contextOptions.requestHeaders = req.headers;

      options.context(contextOptions).then((result) => {
        (req as any).context = result;
        next();
      });
    } catch (error) {
      if (isGraphql(req)) {
        graphqlTokenErrorHandler(res, error);
        return;
      }
      expressTokenErrorHandler(res, error);
    }
  };
};
