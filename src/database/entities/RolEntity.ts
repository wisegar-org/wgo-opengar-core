import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import _ from "lodash";
import UserEntity from "./UserEntity";

@Entity({ name: "roles" })
export class RolEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // @ManyToMany(() => UserEntity)
  // users: UserEntity[];
  /**
   *
   */
  constructor(name: string, id?: number) {
    this.name = name;
    if (_.isNumber(id)) {
      this.id = id;
    }
  }
}

export default RolEntity;
