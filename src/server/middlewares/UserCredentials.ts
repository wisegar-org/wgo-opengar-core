import { NextFunction, Request, Response } from 'express';
import { Context, RolEntityEnum } from '@wisegar-org/wgo-core';
declare module 'express-serve-static-core' {
  interface Request {
    context?: Context;
  }
}

export const AuthorizeUserRol = (roles: RolEntityEnum[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.context) {
        const context: Context = req.context;
        const validRroles =
          context.user && context.user.roles ? context.user.roles.filter((rol: string) => roles.indexOf(RolEntityEnum[rol]) !== -1) : [];
        if ((roles.length === 0 && !!context.user) || validRroles.length > 0) {
          next();
          return;
        }
      }
    } catch (error) {
      console.log('Invalid role access');
    }
    res.sendStatus(403);
  };
};
