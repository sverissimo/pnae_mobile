export interface Repository<T> {
  create(entity: T): Promise<void>;
  findById?(id: string): Promise<T | null>;
  findAll?(): Promise<T[]>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
