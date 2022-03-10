import { MediaEntityTypeEnum } from '@wisegar-org/wgo-core';
import { Entity, Column } from 'typeorm';
import { OGBaseEntity } from './OGBaseEntity';

@Entity({ name: 'media' })
export class MediaEntity extends OGBaseEntity {
  @Column({ default: '' })
  displayName: string;
  @Column({ default: '' })
  fileName: string;
  @Column({ default: '' })
  fileExt: string;
  @Column({ default: '' }) mimeType: string;
  @Column({ type: 'bytea' }) fileContent: Buffer;

  @Column({ nullable: true, default: false })
  isPublic: boolean;

  @Column({ default: MediaEntityTypeEnum.file })
  mediaType: MediaEntityTypeEnum;

  @Column({ nullable: true, default: '' })
  path: string;
}

export default MediaEntity;
