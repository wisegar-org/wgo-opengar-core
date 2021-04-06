import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { RolEntity } from "./RolEntity";
import { MediaEntity } from "./MediaEntity";
import { IUser } from "../../../shared/interfaces/IUser";
import { Field, ObjectType } from "type-graphql";
@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

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

  @Column()
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
    this.uuid =
      Math.random().toString(16).substring(2) +
      new Date().getTime().toString(16);
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
