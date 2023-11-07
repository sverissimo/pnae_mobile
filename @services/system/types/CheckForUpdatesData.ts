export type CheckForUpdatesData<T> = {
  upToDateIds: string[];
  missingOnServer: T[];
  outdatedOnServer: T[];
  missingOnClient: T[];
  outdatedOnClient: T[];
};
