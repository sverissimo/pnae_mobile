import { LocalStorageDAO } from "../LocalStorageDAO";

export class SystemLocalStorageRepository {
  constructor(
    private systemDAO = new LocalStorageDAO("system", "lastSyncOn")
  ) {}

  async getLastSyncDate() {
    const lastSyncOn = await this.systemDAO.findOne("lastSyncOn");
    return lastSyncOn;
  }

  async saveLastSyncDate(date: string) {
    await this.systemDAO.saveData("lastSyncOn", date);
  }
}
