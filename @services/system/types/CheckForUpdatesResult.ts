export type CheckForUpdatesResult<T> = {
  upToDateIds: string[];
  missingIdsOnServer: string[];
  outdatedIdsOnServer: string[];
  missingOnClient: T[];
  outdatedOnClient: T[];
};
