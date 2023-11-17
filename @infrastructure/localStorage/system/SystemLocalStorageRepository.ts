import { LocalStorageRepository } from "../LocalStorageRepository";

export class SystemLocalStorageRepository extends LocalStorageRepository {
  protected collection = "system";
  protected key = "lastSyncOn";

  async getLastSyncDate() {
    const lastSyncOn = await this.findOne("lastSyncOn");
    return lastSyncOn;
  }

  async saveLastSyncDate(date: string) {
    await this.saveData("lastSyncOn", date);
  }
}
