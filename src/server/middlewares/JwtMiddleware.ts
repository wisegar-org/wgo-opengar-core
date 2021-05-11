import express from 'express';
import { IServerOptions } from '../models/ServerOptions';
import { AccessTokenData, jwtMiddleware } from '../services/JwtAuthService';

export const jwt = (options: IServerOptions) => {
  return (req: express.Request, res: express.Response, next: () => void) => {
    const tokenData: AccessTokenData = jwtMiddleware(req, res);
    if (tokenData) {
      options.context(tokenData).then((result) => {
        (req as any).context = result;
        next();
      });
    } else {
      next();
    }
  };
};
