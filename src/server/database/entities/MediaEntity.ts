import { Entity, Column } from 'typeorm';
import { OGBaseEntity } from './OGBaseEntity';

@Entity({ name: 'media' })
export class MediaEntity extends OGBaseEntity {
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
}

export default MediaEntity;
