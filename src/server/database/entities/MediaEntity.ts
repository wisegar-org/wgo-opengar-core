import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { MediaEntityTypeEnum } from "../../../shared/models/enums/MediaEntityTypeEnum";

@Entity({ name: "media" })
export class MediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @Column()
  mediaType: number;

  @Column()
  checkSum: string;

  @Column()
  path: string;

  /**
   *
   */
  constructor(
    name: string,
    createdAt: Date,
    mediaType: MediaEntityTypeEnum,
    checkSum: string,
    path: string
  ) {
    this.name = name;
    this.createdAt = createdAt;
    this.mediaType = mediaType;
    this.checkSum = checkSum;
    this.path = path;
  }
}

export default MediaEntity;
