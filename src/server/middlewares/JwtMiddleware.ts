import express from 'express';
import { IServerOptions } from '../models/ServerOptions';
import { AccessTokenData, jwtMiddleware } from '../services/JwtAuthService';

export const jwt = async (options: IServerOptions) => {
  return async (req: express.Request, res: express.Response, next: () => void) => {
    const tokenData: AccessTokenData = jwtMiddleware(req, res);
    if (tokenData) {
      (req as any).context = await options.context(tokenData);
    }
    next();
  };
};
