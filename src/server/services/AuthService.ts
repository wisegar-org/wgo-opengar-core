import { Connection, Repository } from 'typeorm';
import { SessionEntity } from '../database/entities/SessionEntity';
import UserEntity from '../database/entities/UserEntity';
import { AccessTokenData, generateAccessToken } from './JwtAuthService';
import * as bcrypt from 'bcrypt';
import { AuthError } from '@wisegar-org/wgo-core';

export class AuthService {
  private readonly utenteRepository: Repository<UserEntity>;
  private readonly sessionRepository: Repository<SessionEntity>;

  constructor(connection: Connection) {
    this.utenteRepository = connection.getRepository(UserEntity);
    this.sessionRepository = connection.getRepository(SessionEntity);
  }

  public async comparePassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }

  public async login(data: any): Promise<string> {
    const { email, password, user } = data;
    let utente: UserEntity = user
      ? user
      : await this.utenteRepository.findOne({
          where: { email },
          relations: ['roles'],
        });

    if (!utente) {
      throw AuthError.LoginWrongParameters;
    }
    const result = await this.comparePassword(password, utente.password);
    if (!result) throw AuthError.LoginWrongParameters;
    if (!utente.roles || utente.roles.length === 0) throw AuthError.LoginWrongRoles;

    const session = this.sessionRepository.create();
    session.userId = utente.uuid;
    session.email = utente.email;
    session.roles = utente.roles.map((role) => role.name);

    const savedSession = await this.sessionRepository.save(session);

    return generateAccessToken(<AccessTokenData>{
      sessionId: savedSession.id,
      userId: utente.id,
      userName: utente.email,
    });
  }
}
