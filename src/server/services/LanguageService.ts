import { Context, LanguageEntity, MediaEntity, TranslationEntity } from '@wisegar-org/wgo-core';
import { Connection, Repository } from 'typeorm';
import { ILanguage } from '../models/ILanguageTranslations';
import { HistoryService } from './HistoryService';

export class LanguageService {
  languageRepository: Repository<LanguageEntity>;
  mediaRepository: Repository<MediaEntity>;
  translationRepository: Repository<TranslationEntity>;
  historyService: HistoryService<LanguageEntity>;
  context: Context;
  /**
   *
   */
  constructor(conn: Connection, context: Context) {
    this.languageRepository = conn.getRepository(LanguageEntity);
    this.translationRepository = conn.getRepository(TranslationEntity);
    this.mediaRepository = conn.getRepository(MediaEntity);
    this.historyService = new HistoryService(LanguageEntity, conn, context);
    this.context = context;
  }

  async all(whitRelations: boolean = false) {
    const language = await this.languageRepository.find({
      order: { code: 'ASC' },
      relations: whitRelations ? ['logo'] : [],
    });

    return language;
  }

  async create(language: ILanguage) {
    let lang = await this.languageRepository.findOne({
      where: { code: language.code },
    });
    if (!!lang) return false;

    lang = new LanguageEntity();
    const result = await this.setProperties(lang, language);
    await this.historyService.createPostHistory(result);
    return !!result;
  }

  async modify(language: ILanguage) {
    let lang = await this.languageRepository.findOne({
      where: {
        id: language.id,
      },
    });
    if (!language) return false;
    if (!language.enabled && lang.enabled) {
      const count = await this.languageRepository.count({ where: { enabled: true } });
      if (count === 1) language.enabled = true;
    }
    if (language.default && !lang.default) {
      const defaultLangs = await this.languageRepository.find({
        where: { default: true },
      });
      for (const langD of defaultLangs) {
        langD.default = false;
      }
      await this.languageRepository.manager.save(defaultLangs);
      await this.historyService.createPutManyHistory(defaultLangs);
    }

    const result = await this.setProperties(lang, language);
    await this.historyService.createPostHistory(result);
    return !!result;
  }

  async getLanguageByCode(code: string) {
    const lang = await this.languageRepository.findOne({
      where: {
        code: code,
      },
    });
    return lang;
  }

  async getLanguageById(id: number) {
    const lang = await this.languageRepository.findOne({
      where: {
        id,
      },
    });
    return lang;
  }

  private async setProperties(lang: LanguageEntity, language: ILanguage) {
    lang.code = language.code;
    lang.default = language.default;
    lang.enabled = language.enabled;
    if (language.logoId) {
      const media = await this.mediaRepository.findOne({
        id: language.logoId,
      });
      lang.logo = media;
    }
    return await this.languageRepository.manager.save(lang);
  }
}
