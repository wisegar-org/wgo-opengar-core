import UserEntity from "../../server/database/entities/UserEntity";
export interface LoginModel {
  userName: string;
  password: string;
}

export interface UserLoginToken {
  token: string;
  user: UserEntity;
}
