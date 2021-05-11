import express from 'express';
import { AccessTokenData, jwtMiddleware } from '../services/JwtAuthService';

export const jwt = () => {
  return (req: express.Request, res: express.Response, next: () => void) => {
    const JWT: AccessTokenData = jwtMiddleware(req, res);
    if (JWT) {
      // req.user = JWT;
    }
    next();
  };
};
