import { Language } from '@wisegar-org/wgo-opengar-shared';
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'translations' })
export class TranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ nullable: false }) key: string;
  @Column({ default: Language.IT }) language: Language;
  @Column({ default: 'Empty' }) value: string;
}

export default TranslationEntity;
