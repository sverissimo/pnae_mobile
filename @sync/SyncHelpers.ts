import { SystemLocalStorageRepository } from "@infrastructure/localStorage/system/SystemLocalStorageRepository";

export class SyncHelpers {
  constructor(private systemStorage = new SystemLocalStorageRepository()) {}

  async saveLastSyncDate() {
    try {
      const lastSyncDate = new Date().toISOString();
      await this.systemStorage.saveLastSyncDate(lastSyncDate);
      return lastSyncDate;
    } catch (error) {
      console.log("🚀 - SyncService - saveLastSyncDate - error:", error);
      throw error;
    }
  }

  async getLastSyncDate() {
    try {
      const lastSyncDate = await this.systemStorage.getLastSyncDate();
      return lastSyncDate;
    } catch (error) {
      console.log("🚀 - SyncService - getLastSyncDate - error:", error);
      throw error;
    }
  }

  async shouldSync(miliseconds?: number) {
    console.log(
      "🚀 - file: SyncHelpers.ts:28 - SyncHelpers - shouldSync - miliseconds:",
      miliseconds
    );

    const currentDate = new Date();
    const lastSyncDate = await this.getLastSyncDate();

    if (!lastSyncDate || lastSyncDate.toString() === "Invalid Date") {
      return true;
    }

    const syncExpirationDate = new Date(lastSyncDate);

    if (miliseconds) {
      syncExpirationDate.setMilliseconds(miliseconds);
      console.log(
        "🚀 - shouldSync - miliseconds:",
        miliseconds / 1000 / 60 / 60
      );

      console.log("🚀 - SyncService - shouldSync - syncExpirationDate:", {
        currentDate,
        lastSyncDate,
        syncExpirationDate,
      });
      return currentDate > syncExpirationDate;
    }

    syncExpirationDate.setDate(syncExpirationDate.getDate() + 1);

    return currentDate > syncExpirationDate;
  }
}
