import { CheckForUpdatesResult } from "@services/system/types/CheckForUpdatesResult";

export interface Repository<T> {
  create(entity: T): Promise<void>;
  findById?(id: unknown): Promise<T | null>;
  findMany?: (ids: string[]) => Promise<T[]>;
  findAll?(): Promise<T[]>;
  update(entity: Partial<T>): Promise<void>;
  delete?(id: string): Promise<void>;
  checkForUpdates?(
    input: Record<string, any>[]
  ): Promise<CheckForUpdatesResult<T>>;
}
