import { UserEntity } from '../database/entities/UserEntity'
import { RolEntity } from "../database/entities/RolEntity";
import * as _ from "lodash";
import * as bcrypt from "bcrypt";
import {
  ErrorResponse,
  Response,
  SuccessResponse,
} from "../models/responseModels/Response";
import { LoginModel, UserLoginToken } from "../models/AuthModels";
import { IUser } from '../interfaces/IUser';
import { JwtService } from "../services/JwtService";
import { privateKey, publicKey } from "../settings";
import { EmailServer } from "../services/EmailService";
import { Service } from "typedi";
import { Connection, Repository } from 'typeorm';


export class UserDataService {
  private _userRepository: Repository<UserEntity>;
  private _roleRepository: Repository<RolEntity>;
  private _connection: Connection

  constructor(conn: Connection) {
    this._connection = conn
    this._userRepository = this._connection.getRepository(UserEntity)
    this._roleRepository = this._connection.getRepository(RolEntity)
  }


  all = async (criteria?: any): Promise<Response<UserEntity[]>> => {
    const users = await this._userRepository.find({
      relations: ["roles"],
      where: criteria,
    });
    return SuccessResponse.Response(users);
  };

  one = async (criteria?: any): Promise<Response<UserEntity>> => {
    const user = await this._userRepository.findOne({
      relations: ["roles"],
      where: criteria,
    });
    if (_.isUndefined(user)) {
      return ErrorResponse.Response("User not found");
    }
    return SuccessResponse.Response(user);
  };

  oneById = async (id: number): Promise<Response<UserEntity>> => {
    const user = await this._userRepository.findOne(id, {
      relations: ["roles"],
    });
    if (_.isUndefined(user)) {
      return ErrorResponse.Response("User not found");
    }
    return SuccessResponse.Response(user);
  };

  oneByUuId = async (uuid: string): Promise<Response<UserEntity>> => {
    const user = await this._userRepository.findOne({
      relations: ["roles"],
      where: { uuid },
    });
    return SuccessResponse.Response(user);
  };

  login = async (model: LoginModel): Promise<Response<UserLoginToken>> => {
    const { userName, password } = model;
    if (_.isEmpty(userName) || _.isEmpty(password)) {
      return ErrorResponse.Response("Error: UserName or password are empty");
    }

    const userResp = await this.one({ userName });
    if (userResp.isSuccess) {
      const user = userResp.result;
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return ErrorResponse.Response("Login Error", "Password are wrong");
      }
      const JWTObj = new JwtService({
        privateKey: privateKey,
        publicKey: publicKey,
      });

      const userObj: IUser = user.getJWTUser();
      const tokenResult = JWTObj.generateToken(userObj);
      if (_.isUndefined(tokenResult) || _.isEmpty(tokenResult.token)) {
        return ErrorResponse.Response(
          "Token generation error." + tokenResult.error
        );
      }
      const tokenUser: UserLoginToken = {
        token: tokenResult.token,
        user: user,
      };
      return SuccessResponse.Response(tokenUser);
    }
    return ErrorResponse.Response(
      "Login Error",
      `Probably there is not user with username ${userName}`
    );
  };

  create = async (
    user: UserEntity,
    roles?: number[]
  ): Promise<Response<UserEntity>> => {
    debugger;
    const { name, lastName, userName, email, password } = user;

    // checking if all parameters have a value
    if (
      _.isEmpty(name) ||
      _.isEmpty(lastName) ||
      _.isEmpty(userName) ||
      _.isEmpty(email) ||
      _.isEmpty(password)
    ) {
      return ErrorResponse.Response(
        "At least one of the basic params is empty"
      );
    }

    let usersCount = await this._userRepository.findAndCount({
      where: { userName },
    });

    if (usersCount[1] > 0) {
      return ErrorResponse.Response(
        "userName",
        "Error in register user: user name already exist"
      );
    }

    usersCount = await this._userRepository.findAndCount({
      where: { email },
    });

    if (usersCount[1] > 0) {
      return ErrorResponse.Response(
        "email",
        "Error in register user: email already exist"
      );
    }

    // let profileImg: MediaEntity = null
    // if (_.isEmpty(profileImage)) {
    //     profileImg = await MediaRepository.findOne({
    //         id: profileImage
    //     })
    // }
    let userRoles: RolEntity[] = [];
    if (roles && roles.length > 0)
      userRoles = await this._roleRepository.findByIds(roles);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userToCreate = new UserEntity(
      name,
      lastName,
      userName,
      email,
      hashedPassword,
      userRoles,
      false
    );
    try {
      const newUser = await this._userRepository.save(userToCreate);
      newUser.roles = userRoles;
      const JWTObj = new JwtService({
        privateKey: privateKey,
        publicKey: publicKey,
      });
      const userObj: IUser = user.getJWTUser();
      const tokenResult = JWTObj.generateToken(userObj);
      if (_.isUndefined(tokenResult) || _.isEmpty(tokenResult.token)) {
        return ErrorResponse.Response(
          "Token generation error." + tokenResult.error
        );
      }

      EmailServer.sendEmail({
        from: process.env.EMAIL_SENDER_ADDRESS,
        to: user.email,
        subject: "Confrim Email",
        html: `
                   <h2>ConfirmEmail</h2>
                   <p>${process.env.CLIENT_URL}/auth/checkEmailConfirmation/${tokenResult.token}</p>
                   `,
      })
        .then(
          () => {
            return SuccessResponse.Response(
              newUser,
              "User registered, check email to confirm acount"
            );
          },
          (error) => {
            const { message } = error;
            return ErrorResponse.Response(
              "Error sending email after user register " + message
                ? message
                : ""
            );
          }
        )
        .catch(() => {
          return ErrorResponse.Response(
            "Error sending email after user register"
          );
        });

      return SuccessResponse.Response(newUser, "User registered");
    } catch (error) {
      const { message } = error;
      return ErrorResponse.Response(
        "Error in register user: error saving user in DB " + message
          ? message
          : ""
      );
    }
  };

  setUserRoles = async (
    userUuid: string,
    roleIds: number[]
  ): Promise<Response<UserEntity>> => {
    try {
      const user = await (await this.oneByUuId(userUuid)).result;
      if (user == null || user == undefined) {
        return ErrorResponse.Response(
          "Error when add or remove user's roles: User not found"
        );
      }
      const userRoles = await this._roleRepository.findByIds(roleIds);
      user.roles = userRoles;
      await this._userRepository.save(user);
      return SuccessResponse.Response(user);
    } catch (error) {
      return ErrorResponse.Response(
        error.message,
        "Error when add or remove user's roles"
      );
    }
  };

  update = async (user: UserEntity): Promise<Response<UserEntity>> => {
    try {
      const newUser = await this._userRepository.save(user);
      return SuccessResponse.Response(newUser);
    } catch (error) {
      const { message } = error;
      return ErrorResponse.Response(
        "Error trying to update user " + message ? message : ""
      );
    }
  };

  remove = async (uuid: string): Promise<Response<UserEntity>> => {
    if (!_.isString(uuid)) {
      return ErrorResponse.Response(
        "Error trying to remove user. User's uuid must be string"
      );
    }
    const userResp = await this.one({ uuid: uuid });
    if (!userResp.isSuccess || userResp.result == null) {
      return ErrorResponse.Response(
        "Error trying to remove user.User not found"
      );
    }
    const userRemoved = await this._userRepository.remove(userResp.result);
    return SuccessResponse.Response(userRemoved, "User removed successfully");
  };
}
