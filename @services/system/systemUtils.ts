import { SystemLocalStorageRepository } from "@infrastructure/localStorage/system/SystemLocalStorageRepository";

const systemLocalStorage = new SystemLocalStorageRepository();

export async function saveLastSyncDate() {
  try {
    const lastSyncDate = new Date().toISOString();
    await systemLocalStorage.saveLastSyncDate(lastSyncDate);
  } catch (error) {
    console.log("🚀 - SyncService - saveLastSyncDate - error:", error);
    throw error;
  }
}

export async function getLastSyncDate() {
  try {
    const lastSyncDate = await systemLocalStorage.getLastSyncDate();
    return lastSyncDate;
  } catch (error) {
    console.log("🚀 - SyncService - getLastSyncDate - error:", error);
    throw error;
  }
}

export async function shouldSync(miliseconds?: number) {
  const currentDate = new Date();
  const lastSyncDate = await getLastSyncDate();

  if (!lastSyncDate || lastSyncDate.toString() === "Invalid Date") {
    return true;
  }

  const syncExpirationDate = new Date(lastSyncDate);

  if (miliseconds) {
    syncExpirationDate.setMilliseconds(miliseconds);
    console.log("🚀 - shouldSync - miliseconds:", miliseconds / 1000 / 60 / 60);

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
