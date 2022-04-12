import { GetExpiresInKey, GetPrivateKey, GetPublicKey } from '@wisegar-org/wgo-settings';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AccessTokenData {
  userId: number;
  userName: string;
  sessionId: number;
  iat?: number;
  exp?: number;
  expiring?: boolean;
}

/**
 * @var algorithm Algotithm to apply encription and decription token
 */
const algorithm = 'RS256';
/**
 * @var timeBeforeExpiration Time to token expiration
 */
const timeBeforeExpiration = 3600;

export const generateAccessToken = (user: AccessTokenData) => {
  if (!user) throw 'generateAccessToken - AccessTokenData most be valid';
  if (!user.userId) throw 'generateAccessToken - user id param most be valid';

  const privateKey = GetPrivateKey();
  const expiresIn = GetExpiresInKey();

  const token = jwt.sign(user, privateKey, { expiresIn: expiresIn, algorithm: algorithm });
  return token;
};

export const validateAccessToken = (token: string): AccessTokenData => {
  if (!token) {
    console.error('validateAccessToken: Token invalid!');
    return null;
  }
  try {
    const jwtPayload: AccessTokenData = <AccessTokenData>jwt.verify(token, GetPublicKey(), { algorithms: [algorithm] });
    jwtPayload.expiring = jwtPayload.exp > new Date().getTime() - timeBeforeExpiration;
    return jwtPayload;
  } catch (error) {
    throw `validateAccessToken => Error on token validation:  ${error}`;
  }
};

export const jwtMiddleware = (req: Request, res: Response): AccessTokenData => {
  const token: string = req.headers['authorization'];
  if (!token) return;
  try {
    const result: AccessTokenData = validateAccessToken(token);
    if (result.expiring) {
      const { sessionId, userId, userName } = result;
      const newToken = generateAccessToken({ sessionId, userId, userName });
      res.set('authorization-refresh', newToken);
    }
    return result;
  } catch (error) {
    throw error;
  }
};
