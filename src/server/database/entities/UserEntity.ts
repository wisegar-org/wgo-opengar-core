import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { RolEntity } from './RolEntity';
import { MediaEntity } from './MediaEntity';
import { IUser, Language } from '@wisegar-org/wgo-opengar-shared';
import { OGBaseEntity } from './OGBaseEntity';
import { LanguageEntity } from './LanguageEntity';
@Entity({ name: 'users' })
export class UserEntity extends OGBaseEntity {
  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ nullable: true })
  languageId: number;
  @ManyToOne(() => LanguageEntity, (lang) => lang.id)
  language: LanguageEntity;

  @ManyToMany(() => RolEntity)
  @JoinTable()
  roles: RolEntity[];

  @Column({ nullable: true })
  profileImageId: number;
  @ManyToOne(() => MediaEntity, (media) => media.id)
  profileImage: MediaEntity;

  @Column({ nullable: true })
  confirmationToken: string;

  /**
   *
   */
  constructor(
    name?: string,
    lastName?: string,
    userName?: string,
    email?: string,
    password?: string,
    roles?: RolEntity[],
    isEmailConfirmed?: Boolean,
    profileImage?: MediaEntity,
    confirmationToken?: string
  ) {
    super();
    this.name = name;
    this.lastName = lastName;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.profileImage = profileImage;
    this.isEmailConfirmed = !!isEmailConfirmed;
    this.confirmationToken = confirmationToken;
  }

  getJWTUser(): IUser {
    const user: IUser = {
      username: this.userName,
      name: this.name,
      email: this.email,
      lastname: this.lastName,
    };
    return user;
  }
}

export default UserEntity;
