import * as jwt from 'jsonwebtoken';
import { AccessTokenData } from './JwtAuthService';

/**
 * @deprecated Please use JwtAuth Service
 */
export const TOKEN_SECRET = "87`'9zMh3VCQzsE8";

/**
 *
 * @deprecated Please use JWTAuthService definition
 *
 */
export const generateAccessToken = (user: AccessTokenData) => {
  return jwt.sign(user, TOKEN_SECRET, { expiresIn: '1d' });
};
/**
 *
 * @deprecated Please use JWTAuthService definition
 *
 */
export const verifyAccessToken = (res: any, token: string): AccessTokenData | undefined => {
  try {
    console.log(token);
    const data = jwt.verify(token, TOKEN_SECRET) as AccessTokenData;
    const now = Math.trunc(new Date().getTime() / 1000);
    if (data.exp < now) {
      console.log('token is expired');
      return undefined;
    }
    console.log(data.exp - now, now, data.iat);
    if (data.exp - 30 * 60 < now) {
      let newData = <AccessTokenData>{};
      newData.sessionId = data.sessionId;
      const newToken = generateAccessToken(newData);
      res.header('Access-Control-Expose-Headers', 'refreshToken');
      res.header('refreshToken', newToken);
    }
    return Object.assign(<AccessTokenData>{}, data);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
