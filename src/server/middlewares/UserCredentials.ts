import { JwtService } from '../services/JwtService';
import { NextFunction, Request, Response } from 'express';
import { privateKey, publicKey } from '../../shared/settings';
import { RolEntityEnum, TokenResult, UserDataService } from '../../shared';
import UserEntity from '../database/entities/UserEntity';
import RolEntity from '../database/entities/RolEntity';

export interface RequestContext {
  tokenResult?: TokenResult;
  user?: UserEntity;
}

declare module 'express-serve-static-core' {
  interface Request {
    context?: RequestContext;
  }
}

let userContext: RequestContext = {};

export const setUserCredentials = (userDataService: UserDataService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization.split(' ')[1];
      const JWTObj = new JwtService({
        privateKey,
        publicKey,
      });
      const tokenResult = JWTObj.verifyToken(authHeader);
      const user = await userDataService.one({
        userName: tokenResult.username,
      });
      req.context = {
        tokenResult: tokenResult,
        user: user.result,
      };
    } catch (error) {
      req.context = {};
    }
    userContext = req.context;
    next();
  };
};

export const getUserContext = () => {
  return userContext;
};

export const AuthorizeUserRol = (roles: RolEntityEnum[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const context: RequestContext = getUserContext();
      const validRroles =
        context.user && context.user.roles
          ? context.user.roles.filter((rol: RolEntity) => roles.indexOf(RolEntityEnum[rol.name]) !== -1)
          : [];
      if ((roles.length === 0 && !!context.user) || validRroles.length > 0) {
        next();
        return;
      }
    } catch (error) {
      console.log('Invalid role access');
    }
    res.sendStatus(403);
  };
};
