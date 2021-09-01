import { AuthError } from '@wisegar-org/wgo-opengar-shared';
import express from 'express';
import { isNullOrUndefined } from '../../utils/Validator';
import { IServerOptions } from '../models/ServerOptions';
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
      if (!isGraphql(req)) {
        next();
        return;
      }
      const tokenData: AccessTokenData = jwtMiddleware(req, res);
      if (isNullOrUndefined(tokenData)) {
        next();
        return;
      }
      options.context(tokenData).then((result) => {
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
