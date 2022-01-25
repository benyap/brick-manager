import { Database, DatabaseSchema, Index } from "~/types";

import { IndexNotLoadedError, ModelNotFoundError } from "./errors";

export abstract class EntityLoader<K extends keyof DatabaseSchema> {
  private _index?: Index<DatabaseSchema[K][0]>;

  constructor(public readonly key: K, private readonly db: Database) {}

  protected get index() {
    if (!this._index) throw new IndexNotLoadedError(EntityLoader.name);
    return this._index;
  }

  async load() {
    await this.db.read();
    const collection = this.db.data?.[this.key];
    this._index = this.createIndex(collection ?? []);
    return this;
  }

  protected abstract createIndex(
    collection: DatabaseSchema[K]
  ): Index<DatabaseSchema[K][0]>;

  exists(id: string): boolean {
    if (this.index[id]) return true;
    return false;
  }

  get(id: string): DatabaseSchema[K][0] | undefined {
    return this.index[id];
  }

  async update(
    id: string,
    fields: Partial<DatabaseSchema[K][0]>
  ): Promise<DatabaseSchema[K][0]> {
    this.index[id] = {
      ...this.index[id],
      ...fields,
    };
    this.db.data![this.key] = Object.values(this.index) as DatabaseSchema[K];
    await this.db.write();
    return this.index[id];
  }

  async delete(id: string): Promise<void> {
    delete this.index[id];
    this.db.data![this.key] = Object.values(this.index) as DatabaseSchema[K];
    await this.db.write();
  }
}

export class Entity<K extends keyof DatabaseSchema> {
  constructor(
    public readonly id: string,
    protected readonly loader: EntityLoader<K>
  ) {}

  get<T extends keyof DatabaseSchema[K][0]>(field: T): DatabaseSchema[K][0][T] {
    const data = this.loader.get(this.id);
    if (!data) throw new ModelNotFoundError(this.id, Entity.name);
    return data[field];
  }

  async update(
    fields: Partial<DatabaseSchema[K][0]>
  ): Promise<DatabaseSchema[K][0]> {
    const result = await this.loader.update(this.id, fields);
    return result;
  }
}
