import jwt from "jsonwebtoken";

export const TOKEN_SECRET = "87`'9zMh3VCQzsE8";

export interface AccessTokenData {
  session: string;
  sessionId: number;
}

export interface TokenData {
  session: string;
  sessionId: number;
  iat: number;
  exp: number;
}

export const generateAccessToken = (user: AccessTokenData) => {
  return jwt.sign(user, TOKEN_SECRET, { expiresIn: "1d" });
};

export const verifyAccessToken = (
  res: any,
  token: string
): AccessTokenData | undefined => {
  try {
    console.log(token);
    const data = jwt.verify(token, TOKEN_SECRET) as TokenData;
    const now = Math.trunc(new Date().getTime() / 1000);
    if (data.exp < now) {
      console.log("token is expired");
      return undefined;
    }
    console.log(data.exp - now, now, data.iat);
    if (data.exp - 30 * 60 < now) {
      let newData = <AccessTokenData>{};
      newData.session = data.session;
      const newToken = generateAccessToken(newData);
      res.header("Access-Control-Expose-Headers", "refreshToken");
      res.header("refreshToken", newToken);
    }
    return Object.assign(<AccessTokenData>{}, data);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
