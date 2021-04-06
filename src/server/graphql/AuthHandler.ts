import { AuthChecker } from "type-graphql";
import { Context } from "./Models";

export const Authenticator: AuthChecker<Context> = (
  { context: { user } },
  permissions
) => {
  if (permissions.length === 0) {
    if (user !== undefined) return true;
    throw new Error("Not Authorized");
  }
  if (!user) {
    throw new Error("Not Authorized");
  }
  if (user.permissions.hasOwnProperty(permissions[0])) {
    const permission = permissions[1].toLocaleUpperCase().split("") || [];
    const userPermission =
      user.permissions[permissions[0]].toUpperCase().split("") || [];

    let i = 0;
    for (i; i != permission.length; i++) {
      if (userPermission.indexOf(permission[i]) === -1) {
        break;
      }
    }
    if (i !== permission.length) throw new Error("Not Authorized");
    return true;
  }
  throw new Error("Not Authorized");
};
