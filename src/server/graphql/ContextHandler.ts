import { Context, ContextUser, SessionEntity } from '@wisegar-org/wgo-core';
import { verifyAccessToken } from '../services/JwtToken';

export const GetContext = async ({ req, res }) => {
  let user = undefined;
  const token = req.headers.authorization || null;
  const ctx: Context = {
    user: null,
  };

  if (!token) return ctx;

  const data = verifyAccessToken(res, token);
  if (data) {
    const session = await SessionEntity.findOne({ id: data.sessionId });
    if (session) {
      user = <ContextUser>{
        sessionId: data.sessionId.toString(),
        userId: session.userId,
        email: session.email,
        roles: session.roles,
        permissions: session.permissions,
        extra: session.extra,
      };
    }
  }
  ctx.user = user;
  return ctx;
};
