import fs, { readFileSync, unlinkSync, ReadStream, createWriteStream, existsSync } from 'fs-extra';
import { join } from 'path';
import { Repository, ILike, Connection } from 'typeorm';
import { LanguageService } from './LanguageService';
import { CultureTranslation, TransaltionsType, TranslationsByCulture } from '../models/ILanguageTranslations';
import { LanguageEntity, TranslationEntity } from '@wisegar-org/wgo-core';

export class TranslationService {
  translationRepository: Repository<TranslationEntity>;
  languageService: LanguageService;
  /**
   *
   */
  constructor(conn: Connection) {
    this.translationRepository = conn.getRepository(TranslationEntity);
    this.languageService = new LanguageService(conn);
  }

  async getTranslation(lang: number, key: string, trim = true): Promise<string> {
    let translation = await this.translationRepository.findOne({
      where: {
        languageId: lang,
        key,
      },
    });

    if (!translation) {
      return key;
    }

    return trim ? this.removeTags(translation.value) : translation.value;
  }

  private removeTags(str: string) {
    return !str ? '' : str.replace(/(<([^>]+)>)/gi, '');
  }

  async setTranslation(lang: number, key: string, value: string) {
    const translationEntity = await this.setTranslationValue(lang, key, value);
    return !!(await this.translationRepository.manager.save(translationEntity));
  }

  async setTranslationValue(lang: number, key: string, value: string) {
    let translationEntity = await this.translationRepository.findOne({
      where: {
        key,
        languageId: lang,
      },
    });
    if (!translationEntity) {
      translationEntity = new TranslationEntity();
      translationEntity.key = key;
    }
    const language = await this.languageService.getLanguageById(lang);
    if (language) {
      translationEntity.languageId = lang;
      translationEntity.language = language;
    }
    translationEntity.value = value;
    return translationEntity;
  }

  async getAllTranslations() {
    const translations: TranslationsByCulture = {};
    const translationEntities: TranslationEntity[] = await this.translationRepository.find();
    translationEntities.forEach((tranlation) => {
      if (!(tranlation.key in translations)) {
        translations[tranlation.key] = <CultureTranslation>{};
      }
      translations[tranlation.key][tranlation.languageId] = tranlation.value;
    });
    return translations;
  }

  async getTranslationsByFilter(lang: number, search: string = '', skip: number = 0, take: number = 10) {
    const searchTranslationskeys: { [key: string]: boolean } = {};
    const translationsFile: TransaltionsType = {};
    const langs: LanguageEntity[] = await this.languageService.all(false);
    for (const language of langs) {
      await this.getKeysByFilterInDB(language.id, search, searchTranslationskeys, lang === language.id ? translationsFile : null);
    }

    const translationsKeys = Object.keys(searchTranslationskeys);
    const translationsCount = translationsKeys.length;
    const keys = translationsKeys.sort().splice(skip, take);

    const translations: { id: string; value: string; key: string }[] = [];
    keys.forEach((key) => {
      translations.push({
        id: key,
        key: key,
        value: translationsFile[key] || key,
      });
    });

    return {
      translations,
      translationsCount,
    };
  }

  async editTranslation(langId: number, cultureId: number, key: string, value: string, save: boolean = true) {
    const message = await this.getTranslation(langId, 'WG_Manager_Translator_EditSuccess');

    let translation = await this.translationRepository.findOne({
      where: {
        key,
        languageId: langId,
      },
    });
    if (!translation) {
      translation = new TranslationEntity();
      translation.key = key;
      translation.languageId = langId;
    }
    translation.value = value;
    await this.translationRepository.manager.save(translation);

    return {
      message,
    };
  }

  private saveStreamFile(stream: any, filepath: string): Promise<string> {
    return new Promise((resolve, reject) =>
      stream
        .on('error', (error: any) => {
          if (stream.truncated) unlinkSync(filepath);
          reject(error);
        })
        .pipe(createWriteStream(filepath))
        .on('error', (error: any) => {
          return reject(error);
        })
        .on('finish', () => {
          return resolve(filepath);
        })
    );
  }

  async importTranslations(lang: number, buffer: any, temPath: string) {
    try {
      const documentName = 'translationsImport.csv';
      const pathDoc = join(temPath, documentName);
      if (existsSync(pathDoc)) unlinkSync(pathDoc);

      const { createReadStream } = buffer;
      const stream: ReadStream = createReadStream();
      await this.saveStreamFile(stream, pathDoc);

      const langs: LanguageEntity[] = await this.languageService.all(false);
      const format = ' __*__,';
      let doc: string = readFileSync(pathDoc, 'utf-8');
      langs.forEach((lang) => {
        doc = doc.split(`\n${lang.code}`).join(`${format}${lang.code}`);
      });
      const translations = doc.split(format).slice(1);
      const translationsEntity: TranslationEntity[] = [];
      for (const str of translations) {
        const trans = str.split(',');
        const lang = langs.find((lang) => lang.code === trans[0]);
        if (trans[1] !== trans[2] && !!lang) {
          const entity = await this.setTranslationValue(lang.id, trans[1], trans[2]);
          translationsEntity.push(entity);
        }
      }
      await this.translationRepository.manager.save(translationsEntity);
      unlinkSync(pathDoc);
      return {
        isSuccess: true,
        message: 'Success',
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error,
      };
    }
  }

  async exportTranslation(temPath: string) {
    const langs: LanguageEntity[] = await this.languageService.all(false);
    const documentName = 'translations.csv';
    const pathDoc = join(temPath, documentName);
    if (existsSync(pathDoc)) unlinkSync(pathDoc);
    const searchTranslationskeys: { [key: string]: boolean } = {};

    for (const lang of langs) {
      if (lang.enabled) {
        await this.getKeysByFilterInDB(lang.id, '', searchTranslationskeys);
      }
    }

    const writeStream = fs.createWriteStream(pathDoc);

    writeStream.write('" Language "," Key "," Value ",\n');

    for (const lang of langs) {
      if (lang.enabled) {
        const translations = await this.writeTranslations(lang);
        const rows = Object.keys(searchTranslationskeys).map((key) => {
          const value = key in translations && !!translations[key] ? translations[key] : key;
          return `${lang.code},${key},${value},\n`;
        });

        writeStream.write(rows.join(''));
      }
    }

    return new Promise((resolve, reject) => {
      new Promise((res, rej) => {
        writeStream.end(res);
      }).then(() => {
        const storedFileContent = readFileSync(pathDoc, 'base64');
        resolve({
          data: storedFileContent,
          isSuccess: true,
        });
      });
    });
  }

  private async writeTranslations(language: LanguageEntity) {
    const translations: TransaltionsType = {};
    const translationsEntities: TranslationEntity[] = await this.translationRepository.find({
      languageId: language.id,
    });
    translationsEntities.forEach((translation) => {
      translations[translation.key] = translation.value;
    });

    return translations;
  }

  private getKeysByFilter(translationsFile: TransaltionsType, filter = '', searchTranslationskeys: { [key: string]: boolean }) {
    const search = filter.toLowerCase();
    Object.keys(translationsFile).map((key) => {
      if (
        !(key in searchTranslationskeys) &&
        (!search || key.toLowerCase().indexOf(search) !== -1 || translationsFile[key].toLowerCase().indexOf(search) !== -1)
      ) {
        searchTranslationskeys[key] = true;
      }
    });
  }

  private async getKeysByFilterInDB(
    language: number,
    filter = '',
    searchTranslationskeys: { [key: string]: boolean },
    translationFile: TransaltionsType | null = null
  ) {
    const search = filter.toLowerCase();
    const filterLanguage = { languageId: language };
    const translations = await this.translationRepository.find({
      where: search
        ? [
            { ...filterLanguage, key: ILike(`%${search}%`) },
            { ...filterLanguage, value: ILike(`%${search}%`) },
          ]
        : filterLanguage,
    });
    translations.forEach((translation) => {
      searchTranslationskeys[translation.key] = true;
      if (translationFile) {
        translationFile[translation.key] = translation.value;
      }
    });
  }

  async removeTranslation(key: string) {
    const translations = await this.translationRepository.find({
      key,
    });

    for (const translation of translations) {
      await this.translationRepository.manager.remove(translation);
    }
  }
}
