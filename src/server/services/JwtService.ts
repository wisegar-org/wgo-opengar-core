import * as jwt from 'jsonwebtoken';
import { IJwtSettings, TokenResult, IUser } from '@wisegar-org/wgo-core';

/**
 * @deprecated Please use JWTAuthService definition
 * @var algorithm Algotithm to apply encription and decription token
 */
const algorithm = 'RS256';

/**
 * @deprecated Please use JWTAuthService definition
 * @var timeBeforeExpiration Time to token expiration
 * @default timeBeforeExpiration Default value 90 days (324000s)
 */
const defaultExpiration = 324000;

/**
 * @deprecated Please use JWTAuthService definition
 * @var timeBeforeExpiration Time to token expiration
 */
const timeBeforeExpiration = 3600;

/**
 * @deprecated Please use JWTAuthService definition
 */
export class JwtService {
  private jwtKeys: IJwtSettings;

  constructor(jwtSettings?: IJwtSettings) {
    this.jwtKeys = jwtSettings ? jwtSettings : { privateKey: '', publicKey: '' };
  }

  /**
   * @deprecated Please use JWTAuthService definition
   * @method generateToken Generates a Jwt Token from an user model
   */
  public generateToken(user: IUser) {
    const result = new TokenResult();
    if (!user || !user.username) {
      return result.SetError('Invalid user parameter');
    }
    try {
      const token = jwt.sign({ username: user.username }, this.jwtKeys.privateKey, {
        expiresIn: defaultExpiration,
        algorithm: algorithm,
      });
      if (!token || token === null) {
        return result.SetError('Error on token generation');
      }
      return result.SetUser(user, token);
    } catch (error) {
      return result.SetError(error.message);
    }
  }

  /**
   *  @deprecated Please use JWTAuthService definition
   * @method verifyToken  Verify the authenticity of the token generation throght the public key
   */
  public verifyToken(token: string) {
    const result = new TokenResult();
    if (!token) {
      result.error = 'Invalid token parameter';
      return result;
    }

    try {
      const jwtPayload = <any>jwt.verify(token, this.jwtKeys.publicKey, { algorithms: [algorithm] });

      result.token = token;
      result.username = jwtPayload.username;
      result.session = jwtPayload.sesion;
      result.isExpiring = jwtPayload.exp > new Date().getTime() - timeBeforeExpiration;
      return result;
    } catch (error) {
      result.error = error.message;
      return result;
    }
  }
}
