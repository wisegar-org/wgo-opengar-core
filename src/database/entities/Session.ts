import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { OGBaseEntity } from "./OGBaseEntity";

// table session must not be exposed!

@Entity()
export class Session extends OGBaseEntity {
  @Column()
  userId: string;
  @Column()
  email: string;
  @Column("text", { array: true, default: "{}" })
  roles: string[];
  @Column({ type: "jsonb", nullable: true })
  extra: { [key: string]: unknown };
}
