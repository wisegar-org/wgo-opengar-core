import { Connection, Repository } from 'typeorm';
import TemplateEntity, { TemplateDocumentType } from '../database/entities/TemplateEntity';

export class TemplateService {
  private connection: Connection;
  private templateRepository: Repository<TemplateEntity>;
  /**
   *
   */
  constructor(conn: Connection) {
    this.connection = conn;
    this.templateRepository = this.connection.getRepository(TemplateEntity);
  }

  async saveDocumentTamplate(id: number, title: string, body: string, entityTemplate: string, idStyle?: number) {
    let template: TemplateEntity;
    if (id) {
      template = await this.templateRepository.findOne({
        where: {
          id,
        },
      });
    }

    if (!template) {
      template = new TemplateEntity();
    }

    template.title = title;
    template.body = body;
    template.defaultTemplate = true;
    template.entityTemplate = entityTemplate;
    template.documentType = TemplateDocumentType.document;
    if (idStyle) {
      template.styleTemplateId = idStyle;
    }
    return await this.templateRepository.manager.save(template);
  }

  async saveStyleTemplate(id: number, title: string, body: string, documentToSet: number) {
    let template: TemplateEntity;
    if (id) {
      template = await this.templateRepository.findOne({
        where: {
          id,
        },
      });
    }

    if (!template) {
      template = new TemplateEntity();
    }

    template.title = title;
    template.body = body;
    template.defaultTemplate = true;
    template.documentType = TemplateDocumentType.style;
    template = await this.templateRepository.manager.save(template);

    if (documentToSet) {
      const document = await this.templateRepository.findOne({
        id: documentToSet,
        documentType: TemplateDocumentType.document,
      });

      if (document) {
        document.styleTemplateId = template.id;
        await this.templateRepository.manager.save(document);
      }
    }

    return template;
  }

  async getTemplateByEntityTemplate(entityTemplate: string) {
    const template = await this.templateRepository.findOne({
      where: {
        entityTemplate,
        defaultTemplate: true,
      },
      relations: ['styleTemplate'],
    });
    return template;
  }

  async getTemplateStyles() {
    const template = await this.templateRepository.find({
      where: {
        documentType: TemplateDocumentType.style,
      },
    });
    return template;
  }
}
