import { Entity, Column, ManyToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { RolEntity } from './RolEntity';
import { MediaEntity } from './MediaEntity';
import { IUser } from '@wisegar-org/wgo-opengar-shared';
import { OGBaseEntity } from './OGBaseEntity';
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

  @ManyToMany(() => RolEntity)
  @JoinTable()
  roles: RolEntity[];

  @OneToOne(() => MediaEntity)
  @JoinColumn()
  profileImage: MediaEntity;

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
    profileImage?: MediaEntity
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
