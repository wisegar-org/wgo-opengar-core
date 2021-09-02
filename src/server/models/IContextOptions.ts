import { AccessTokenData } from '../services/JwtAuthService';

export interface IContextOptions extends AccessTokenData {
  requestHeaders?: any;
}
