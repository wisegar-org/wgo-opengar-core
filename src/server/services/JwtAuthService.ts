import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { SimpleConsoleLogger } from "typeorm";
import { GetPrivateKey, GetPublicKey } from "./EnvService";

export interface ITokenCheckResult {
  user: string;
  session: string;
  expiring: boolean;
}

export interface jwtUser {
  user: string;
  session: string;
}

declare global {
  namespace Express {
    interface Request {
      user: jwtUser;
    }
  }
}

export const saveJwt = (jwtUser: jwtUser) => {
  const privateKey = GetPrivateKey();
  const newToken = jwt.sign(jwtUser, privateKey, {
    expiresIn: "7d",
    algorithm: "RS256",
  });
  return newToken;
};

export const checkJwtToken = (token: string): ITokenCheckResult | null => {
  if (!token) {
    console.error("checkJwtToken: Token invalid!");
    return null;
  }
  let jwtPayload;
  try {
    const publicKey = GetPublicKey();
    jwtPayload = <any>jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    const { user, session } = jwtPayload;
    const result: ITokenCheckResult = {
      user: user,
      session: session,
      expiring: jwtPayload.exp > new Date().getTime() - 3600,
    };
    return result;
  } catch (error) {
    console.error("checkJwtToken => Error on token validation: ", error);
    return null;
  }
};

export const checkJwt = (req: Request, res: Response): unknown => {
  const token = <string>req.headers["auth-token"];
  if (!token) return undefined;
  try {
    const result: ITokenCheckResult = checkJwtToken(token);
    const { user, session } = result;
    if (result.expiring) {
      const newToken = saveJwt({ user, session });
      res.set("auth-token", newToken);
    }
    return { user, session };
  } catch (error) {
    return undefined;
  }
};
