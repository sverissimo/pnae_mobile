export type SyncData<T> = {
  upToDateIds: string[];
  outdatedOnServer: Partial<T>[];
  missingOnServer: T[];
  outdatedOnClient: T[];
  missingOnClient: T[];
};
