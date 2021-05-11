import { NextFunction, Request, Response } from 'express';
import { RolEntityEnum, UserDataService } from '../../shared';
import UserEntity from '../database/entities/UserEntity';
import RolEntity from '../database/entities/RolEntity';
import { AccessTokenData, validateAccessToken } from '../services/JwtAuthService';

export interface RequestContext {
  tokenResult?: AccessTokenData;
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
      const tokenResult = validateAccessToken(authHeader);
      const user = await userDataService.one({
        id: tokenResult.userId,
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
