import { Connection, getConnection, Repository } from 'typeorm';
import { Session } from '../database/entities/SessionEntity';
import UserEntity from '../database/entities/UserEntity';
import { AccessTokenData, generateAccessToken } from './JwtToken';
import * as bcrypt from 'bcrypt';

export class AuthService {
  private readonly utenteRepository: Repository<UserEntity>;
  private readonly sessionRepository: Repository<Session>;

  constructor(connection: Connection) {
    this.utenteRepository = connection.getRepository(UserEntity);
    this.sessionRepository = connection.getRepository(Session);
  }

  public async comparePassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }

  public async login(data: any): Promise<string> {
    const { email, password } = data;
    let utente = await this.utenteRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (!utente) {
      throw new Error(`login.wrongparameters`);
    }
    const result = await this.comparePassword(password, utente.password);
    if (!result) throw `login.wrongparameters`;
    if (!utente.roles || utente.roles.length === 0) throw 'login.wrongroles';

    const session = this.sessionRepository.create();
    session.userId = utente.uuid;
    session.email = utente.email;
    session.roles = utente.roles.map((role) => role.name);

    const savedSession = await this.sessionRepository.save(session);

    return generateAccessToken(<AccessTokenData>{
      sessionId: savedSession.id,
    });
  }
}
