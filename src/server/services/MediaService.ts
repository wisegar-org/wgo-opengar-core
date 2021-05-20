import { UploadedFile } from 'express-fileupload';
import { Connection, Repository } from 'typeorm';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, normalize, extname } from 'path';
import { MediaEntityTypeEnum } from '@wisegar-org/wgo-opengar-shared';
import MediaEntity from '../database/entities/MediaEntity';

export class MediaService {
  private connection: Connection;
  private mediaRepository: Repository<MediaEntity>;
  constructor(conn: Connection) {
    this.connection = conn;
    this.mediaRepository = this.connection.getRepository(MediaEntity);
  }

  async saveImage(uploadedFile: UploadedFile, options: { isPublic: boolean }) {
    this.saveMedia(uploadedFile, options, MediaEntityTypeEnum.image);
  }

  async saveDocument(uploadedFile: UploadedFile, options: { isPublic: boolean }) {
    this.saveMedia(uploadedFile, options, MediaEntityTypeEnum.document);
  }

  async saveFile(uploadedFile: UploadedFile, options: { isPublic: boolean }) {
    this.saveMedia(uploadedFile, options, MediaEntityTypeEnum.file);
  }

  async saveMedia(uploadedFile: UploadedFile, options: { isPublic: boolean }, mediaType: MediaEntityTypeEnum) {
    const { name, data, encoding, md5, mimetype, truncated, size, tempFilePath } = uploadedFile;
    const fileExt = extname(name);
    const nameFile = `${md5}${fileExt}`;
    let mediaEntity = await this.mediaRepository.findOne({
      fileName: nameFile,
    });

    if (mediaEntity) {
      return mediaEntity;
    }

    mediaEntity = new MediaEntity();
    mediaEntity.fileName = nameFile;
    mediaEntity.fileExt = fileExt;
    mediaEntity.mediaType = mediaType;
    mediaEntity.displayName = name;
    mediaEntity.fileContent = data;
    mediaEntity.isPublic = options.isPublic;

    if (options.isPublic) {
      const pathInPublic = await this.saveBufferInPublicFolder(nameFile, data, mediaType);
      mediaEntity.path = pathInPublic;
    }

    mediaEntity = await this.mediaRepository.manager.save(mediaEntity);
    return mediaEntity;
  }

  async saveMediaEntityInPublicFolder(mediaEntity: MediaEntity) {
    this.saveBufferInPublicFolder(mediaEntity.fileName, mediaEntity.fileContent, mediaEntity.mediaType);
  }

  private async saveBufferInPublicFolder(name: string, data: Buffer, path?: string | undefined) {
    const publicName = 'public';
    const dirname = __dirname.split('node_modules');
    const buildPath = __dirname.split('build');
    const srcPath = __dirname.split('src');
    let pathPublic = '';
    if (dirname.length > 1) {
      pathPublic = normalize(join(dirname[0], publicName));
    } else if (buildPath.length > 1) {
      pathPublic = normalize(join(buildPath[0], publicName));
    } else if (srcPath.length > 1) {
      pathPublic = normalize(join(srcPath[0], publicName));
    } else {
      throw "Media Service Error: Can't resolve public folder path";
    }
    if (!existsSync(pathPublic)) {
      mkdirSync(pathPublic);
    }

    if (path) {
      const pathInPublic = join(pathPublic, path);
      if (!existsSync(pathInPublic)) {
        mkdirSync(pathInPublic);
      }
      pathPublic = pathInPublic;
    }

    return await this.saveBufferInFolder(name, pathPublic, data);
  }

  async saveMediaEntityInFolder(mediaEntity: MediaEntity, folderPath: string, displayName: boolean) {
    return await this.saveBufferInFolder(
      displayName ? mediaEntity.displayName : mediaEntity.fileName,
      folderPath,
      mediaEntity.fileContent
    );
  }

  private async saveBufferInFolder(nameFile: string, pathFolder: string, data: Buffer) {
    const namePath = normalize(join(pathFolder, nameFile));
    writeFileSync(namePath, data);
    return namePath;
  }

  async getMediaById(id: number): Promise<MediaEntity> {
    return await this.mediaRepository.findOne({
      id,
    });
  }
  async getMediaByName(fileName: string): Promise<MediaEntity> {
    return await this.mediaRepository.findOne({
      fileName,
    });
  }
  async getAllMediaByType(typeMedia: MediaEntityTypeEnum): Promise<MediaEntity[]> {
    return await this.mediaRepository.find({
      mediaType: typeMedia,
    });
  }
  async getAllMedia(): Promise<MediaEntity[]> {
    return await this.mediaRepository.find();
  }
}