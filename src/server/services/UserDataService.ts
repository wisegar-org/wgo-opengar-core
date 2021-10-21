import { UserEntity, RolEntity } from '../../';
import _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { LoginModel, UserLoginToken, SuccessResponse, ErrorResponse, Response, EmailOptions } from '@wisegar-org/wgo-opengar-shared';
import { EmailServer } from '../../server/services/EmailService';
import { Connection, Repository } from 'typeorm';
import { AuthService } from '../../server/services/AuthService';
import { AccessTokenData, generateAccessToken } from '../../server/services/JwtAuthService';
import { LanguageEntity } from '../database/entities/LanguageEntity';

export class UserDataService {
  private _userRepository: Repository<UserEntity>;
  private _roleRepository: Repository<RolEntity>;
  private _languageRepository: Repository<LanguageEntity>;
  private _connection: Connection;
  private _authService: AuthService;
  private _emailService: EmailServer;

  constructor(conn: Connection) {
    this._connection = conn;
    this._userRepository = this._connection.getRepository(UserEntity);
    this._roleRepository = this._connection.getRepository(RolEntity);
    this._languageRepository = this._connection.getRepository(LanguageEntity);
    this._authService = new AuthService(conn);
    this._emailService = new EmailServer();
  }

  all = async (criteria?: any): Promise<Response<UserEntity[]>> => {
    const users = await this._userRepository.find({
      relations: ['roles', 'language'],
      where: criteria,
    });
    return SuccessResponse.Response(users);
  };

  one = async (criteria?: any): Promise<Response<UserEntity>> => {
    const user = await this._userRepository.findOne({
      relations: ['roles', 'language'],
      where: criteria,
    });
    if (_.isUndefined(user)) {
      return ErrorResponse.Response('User not found');
    }
    return SuccessResponse.Response(user);
  };

  oneById = async (id: number): Promise<Response<UserEntity>> => {
    const user = await this._userRepository.findOne(id, {
      relations: ['roles', 'language'],
    });
    if (_.isUndefined(user)) {
      return ErrorResponse.Response('User not found');
    }
    return SuccessResponse.Response(user);
  };

  oneByUuId = async (uuid: string): Promise<Response<UserEntity>> => {
    const user = await this._userRepository.findOne({
      relations: ['roles', 'language'],
      where: { uuid },
    });
    return SuccessResponse.Response(user);
  };

  login = async (model: LoginModel): Promise<Response<UserLoginToken>> => {
    const { userName, password } = model;
    if (_.isEmpty(userName) || _.isEmpty(password)) {
      return ErrorResponse.Response('Error: UserName or password are empty');
    }

    try {
      const userResp = await this.one({ userName });
      if (userResp.isSuccess) {
        const user = userResp.result;
        const token = await this._authService.login({ user, password });
        const tokenUser: UserLoginToken = {
          token: token,
          user: user,
        };
        return SuccessResponse.Response(tokenUser);
      }
    } catch (error) {
      return ErrorResponse.Response('Login Error', `${error}`);
    }

    return ErrorResponse.Response('Login Error', `Probably there is not user with username ${userName}`);
  };

  create = async (
    user: UserEntity,
    roles?: number[],
    getEmailOptions: (token: string) => EmailOptions = () => null
  ): Promise<Response<UserEntity>> => {
    const { name, lastName, userName, email, password, isEmailConfirmed } = user;

    // checking if all parameters have a value
    if (
      _.isEmpty(name) ||
      (_.isEmpty(lastName) && !isEmailConfirmed) ||
      _.isEmpty(userName) ||
      (_.isEmpty(email) && !isEmailConfirmed) ||
      _.isEmpty(password)
    ) {
      return ErrorResponse.Response('At least one of the basic params is empty');
    }

    let usersCount = await this._userRepository.findAndCount({
      where: { userName },
    });

    if (usersCount[1] > 0) {
      return ErrorResponse.Response('userName', 'Error in register user: user name already exist');
    }

    if (!_.isEmpty(email)) {
      usersCount = await this._userRepository.findAndCount({
        where: { email },
      });

      if (usersCount[1] > 0) {
        return ErrorResponse.Response('email', 'Error in register user: email already exist');
      }
    }

    // let profileImg: MediaEntity = null
    // if (_.isEmpty(profileImage)) {
    //     profileImg = await MediaRepository.findOne({
    //         id: profileImage
    //     })
    // }
    let userRoles: RolEntity[] = [];
    if (roles && roles.length > 0) userRoles = await this._roleRepository.findByIds(roles);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userToCreate = new UserEntity(name, lastName, userName, email, hashedPassword, userRoles, isEmailConfirmed);
    try {
      const newUser = await this._userRepository.save(userToCreate);
      newUser.roles = userRoles;

      if (!isEmailConfirmed && !!getEmailOptions) {
        const token = generateAccessToken(<AccessTokenData>{
          userId: newUser.id,
        });

        const emailOptions = getEmailOptions(token);

        if (_.isUndefined(token)) {
          return ErrorResponse.Response('Token generation error.');
        }

        this._emailService
          .send(emailOptions)
          .then(
            () => {
              return SuccessResponse.Response(newUser, 'User registered, check email to confirm acount');
            },
            (error) => {
              const { message } = error;
              return ErrorResponse.Response('Error sending email after user register ' + message ? message : '');
            }
          )
          .catch(() => {
            return ErrorResponse.Response('Error sending email after user register');
          });
      }

      return SuccessResponse.Response(newUser, 'User registered');
    } catch (error) {
      const { message } = error;
      return ErrorResponse.Response('Error in register user: error saving user in DB ' + message ? message : '');
    }
  };

  setUserRoles = async (userUuid: string, roleIds: number[]): Promise<Response<UserEntity>> => {
    try {
      const user = await (await this.oneByUuId(userUuid)).result;
      if (user == null || user == undefined) {
        return ErrorResponse.Response("Error when add or remove user's roles: User not found");
      }
      const userRoles = await this._roleRepository.findByIds(roleIds);
      user.roles = userRoles;
      await this._userRepository.save(user);
      return SuccessResponse.Response(user);
    } catch (error) {
      return ErrorResponse.Response(error.message, "Error when add or remove user's roles");
    }
  };

  setUserLanguage = async (userUuid: string, langId: number): Promise<Response<UserEntity>> => {
    try {
      const user = await (await this.oneByUuId(userUuid)).result;
      if (user == null || user == undefined) {
        return ErrorResponse.Response("Error when set user's language: User not found");
      }
      const lang = await this._languageRepository.findOne(langId);
      user.language = lang;
      await this._userRepository.save(user);
      return SuccessResponse.Response(user);
    } catch (error) {
      return ErrorResponse.Response(error.message, "Error when set user's language");
    }
  };

  update = async (user: UserEntity): Promise<Response<UserEntity>> => {
    try {
      const newUser = await this._userRepository.save(user);
      return SuccessResponse.Response(newUser);
    } catch (error) {
      const { message } = error;
      return ErrorResponse.Response('Error trying to update user ' + message ? message : '');
    }
  };

  updatePassword = async (uuid: string, password: string): Promise<Response<UserEntity>> => {
    try {
      const user = await this._userRepository.findOne({
        uuid: uuid,
      });
      if (user) {
        user.password = await bcrypt.hash(password, 10);
        this._userRepository.save(user);
        return SuccessResponse.Response(user);
      }
      return ErrorResponse.Response('Error trying yo update user password');
    } catch (error) {
      const { message } = error;
      return ErrorResponse.Response('Error trying to update user ' + message ? message : '');
    }
  };

  remove = async (uuid: string): Promise<Response<UserEntity>> => {
    if (!_.isString(uuid)) {
      return ErrorResponse.Response("Error trying to remove user. User's uuid must be string");
    }
    const userResp = await this.one({ uuid: uuid });
    if (!userResp.isSuccess || userResp.result == null) {
      return ErrorResponse.Response('Error trying to remove user.User not found');
    }
    const userRemoved = await this._userRepository.remove(userResp.result);
    return SuccessResponse.Response(userRemoved, 'User removed successfully');
  };
}
