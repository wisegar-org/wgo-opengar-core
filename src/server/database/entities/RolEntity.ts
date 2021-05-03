import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import _ from "lodash";
import { OGBaseEntity } from "./OGBaseEntity";

@Entity({ name: "roles" })
export class RolEntity extends OGBaseEntity {
  @Column({ unique: true })
  name: string;
}

export default RolEntity;
