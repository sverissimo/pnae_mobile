import { CheckForUpdatesResponse } from "@sync/types/CheckForUpdatesResponse";

export interface Repository<T> {
  create(entity: T, options?: any): Promise<void>;
  createMany?(entities: T[]): Promise<void>;
  findById?(id: unknown): Promise<T | null>;
  findMany?: (ids: string[]) => Promise<T[]>;
  findAll?(): Promise<T[]>;
  update(entity: Partial<T>): Promise<void>;
  delete?(id: string): Promise<void>;
  getSyncInfo?(url: string, body: any): Promise<CheckForUpdatesResponse<T>>;
}
