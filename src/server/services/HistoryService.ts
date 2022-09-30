import { Actions, Context, ErrorResponse, HistoryEntity, OGBaseEntity } from '@wisegar-org/wgo-core';
import { Connection, ObjectType, Repository } from 'typeorm';

export class HistoryService<TEntity extends OGBaseEntity> {
  private conn: Connection;
  private repository: Repository<HistoryEntity>;
  private readonly type: ObjectType<TEntity>;
  private context?: Context;
  /**
   *
   */
  constructor(type: ObjectType<TEntity>, conn: Connection, context?: Context) {
    this.conn = conn;
    this.repository = this.conn.getRepository(HistoryEntity);
    this.type = type;
    this.context = context;
  }

  public async getHistory(entityRecordId: number): Promise<HistoryEntity[]> {
    const history = await this.repository.find({
      where: { entity: this.type.name, recordId: entityRecordId },
    });
    return history;
  }

  public async getAllHistory() {
    const history = await this.repository.find({
      where: { entity: this.type.name },
    });
    return history;
  }

  public async getAllHistoryByUser(userId: number) {
    const history = await this.repository.find({
      where: { entity: this.type.name, userId: userId },
    });
    return history;
  }

  public getHistoryModel(entity: TEntity) {
    const {
      user: { userId, email },
    } = this.context;

    if (!userId) throw `Il valore Context.userId non è valido per il parametro undefined`;
    if (!email) throw `Il valore Context.email non è valido per il parametro undefined`;
    if (!entity.id) throw `Il valore entity.id non è valido per il parametro undefined`;

    return {
      action: Actions.Unknown,
      entity: this.type.name,
      message: `Il record con id: ${entity.id} della entità: ${this.type.name} è stato in qualche modo modificato`,
      recordId: entity.id,
      userId: userId,
      username: email,
      snapshot: '{}',
    };
  }

  public async create(entity: HistoryEntity): Promise<HistoryEntity> {
    if (!this.context) return undefined;
    if (!!entity.id) throw `Impossibile creare una nuova entity con un id valido`;
    const result = await this.repository.insert(entity);
    if (!result.identifiers || result.identifiers.length === 0) throw `Non è stato possibile registrare il nuovo record!`;

    return result.raw;
  }

  public async createMany(historyEntities: HistoryEntity[]): Promise<HistoryEntity[]> {
    if (!this.context) return undefined;
    const inserResult = await this.repository.insert(historyEntities);
    if (!inserResult.identifiers || inserResult.identifiers.length === 0) throw `Non è stato possibile registrare il nuovo record!`;

    return inserResult.raw;
  }

  public async createPostHistory(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historyModel = this.getHistoryModel(entity);

    historyModel.message = !customMessage ? `Creato` : customMessage;
    historyModel.action = Actions.Add;
    return this.create(Object.assign(new HistoryEntity(), historyModel));
  }

  public async createPutHistory(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historyModel = this.getHistoryModel(entity);
    historyModel.action = Actions.Update;
    historyModel.message = !customMessage ? `Modificato` : customMessage;
    return this.create(Object.assign(new HistoryEntity(), historyModel));
  }

  public async createPutManyHistory(entities: TEntity[], customMessage?: string) {
    if (!this.context) return undefined;
    const historyModels = entities.map((entity) => this.getHistoryModel(entity));
    for (let historyEntityModel of historyModels) {
      historyEntityModel.action = Actions.Update;
      historyEntityModel.message = !customMessage ? `Modificato da modifica massiva` : customMessage;
    }
    const historyEntities = historyModels.map((historyModel) => Object.assign(new HistoryEntity(), historyModel));
    return await this.createMany(historyEntities);
  }

  public async createDeleteHistory(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historyModel = this.getHistoryModel(entity);
    historyModel.action = Actions.SoftDelete;
    historyModel.message = !customMessage ? `Cancellato soft` : customMessage;
    historyModel.snapshot = JSON.stringify(entity);
    return this.create(Object.assign(new HistoryEntity(), historyModel));
  }

  public async createDeleteHardHistory(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historyModel = this.getHistoryModel(entity);
    historyModel.action = Actions.Delete;
    historyModel.message = !customMessage ? `Cancellato` : customMessage;
    historyModel.snapshot = JSON.stringify(entity);
    return this.create(Object.assign(new HistoryEntity(), historyModel));
  }

  public async createRestoreHistory(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historyModel = this.getHistoryModel(entity);
    historyModel.action = Actions.Restore;
    historyModel.message = !customMessage ? `Restore` : customMessage;
    historyModel.snapshot = JSON.stringify(entity);
    return this.create(Object.assign(new HistoryEntity(), historyModel));
  }

  public static ParseHistoryResponse(historyEntity: HistoryEntity) {
    return {
      action: historyEntity.action,
      creatoIl: historyEntity.creatoIl,
      id: historyEntity.id,
      message: historyEntity.message,
      modificatoIl: historyEntity.modificatoIl,
      userId: historyEntity.userId,
      username: historyEntity.username,
      snapshot: historyEntity.snapshot,
    };
  }
}
