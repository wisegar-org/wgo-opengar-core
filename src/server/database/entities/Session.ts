import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ISessionLicenze } from "../../graphql/Models";
import { OGBaseEntity } from "./OGBaseEntity";

// table session can not be exposed!

@Entity()
export class Session extends OGBaseEntity {
  @Column()
  userId: string;
  @Column()
  email: string;
  @Column("text", { array: true, default: "{}" })
  roles: string[];
  @Column("json", { nullable: true })
  permissions: { [key: string]: string };
  @Column({ type: "jsonb", nullable: true })
  extra: { [key: string]: unknown };
  @Column({ type: "jsonb", nullable: true })
  applicazioni: ISessionLicenze;
  uuid: string;
}
