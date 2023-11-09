export type CheckForUpdatesResponse<T> = {
  upToDateIds: string[];
  outdatedOnServer: Partial<T>[];
  missingIdsOnServer: string[];
  outdatedOnClient: T[];
  missingOnClient: T[];
};
