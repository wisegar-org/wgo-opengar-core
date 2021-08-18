import { PrimaryGeneratedColumn, Entity, Column, BaseEntity, ManyToOne } from 'typeorm';

export enum TemplateDocumentType {
  document = 'document',
  style = 'style',
}

@Entity()
export class TemplateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  title: string;
  @Column({ type: 'text' })
  body: string;
  @Column({ default: TemplateDocumentType.document })
  documentType: TemplateDocumentType;
  @Column({ default: 'style' })
  entityTemplate: string;
  @Column({ default: false })
  defaultTemplate: boolean;
  @Column({ nullable: true })
  styleTemplateId!: number;
  @ManyToOne(() => TemplateEntity, (template) => template.id, {
    nullable: true,
  })
  styleTemplate!: TemplateEntity;
}

export default TemplateEntity;
