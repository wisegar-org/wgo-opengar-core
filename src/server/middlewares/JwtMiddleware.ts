import { AuthError } from '@wisegar-org/wgo-opengar-shared';
import { registerDecorator } from 'class-validator';
import express from 'express';
import { IServerOptions } from '../models/ServerOptions';
import { AccessTokenData, jwtMiddleware } from '../services/JwtAuthService';

export const jwt = (options: IServerOptions) => {
  return (req: express.Request, res: express.Response, next: () => void) => {
    try {
      const tokenData: AccessTokenData = jwtMiddleware(req, res);
      if (tokenData) {
        options.context(tokenData).then((result) => {
          (req as any).context = result;
          next();
        });
      } else {
        next();
      }
    } catch (error) {
      console.error(error);
      if (req.originalUrl.includes('graphql')) {
        res.status(200);
        res.send(
          `{
            "errors":[
              {"message":${AuthError.NotAuthorized}}, 
              {"message":${error.name} - ${error.message}}
            ],
          "data":null
        }`
        );
      } else {
        res.statusCode = 401;
        res.statusMessage = `Error: ${error.name} - ${error.message}`;
      }
      res.end();
    }
  };
};
