jest.mock("@infrastructure/localStorage/system/SystemLocalStorageRepository");
import { SystemLocalStorageRepository } from "@infrastructure/localStorage/system/SystemLocalStorageRepository";
import { SyncHelpers } from "./SyncHelpers";

jest.mock("@shared/utils/fileSystemUtils");
jest.mock("@infrastructure/database/config/expoSQLite");

let syncHelpers: SyncHelpers;
let systemStorageMock: SystemLocalStorageRepository;

describe("SyncHelpers Tests", () => {
  beforeEach(() => {
    systemStorageMock = new SystemLocalStorageRepository();
    syncHelpers = new SyncHelpers(systemStorageMock);
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("saveLastSyncDate", () => {
    it("should call localStorage save method and return ISODate", async () => {
      jest.spyOn(systemStorageMock, "saveLastSyncDate");

      const ISOStringDate = await syncHelpers.saveLastSyncDate();
      expect(systemStorageMock.saveLastSyncDate).toHaveBeenCalled();
      expect(ISOStringDate).toBeDefined();
      expect(typeof ISOStringDate === "string").toBeTruthy();
      expect(ISOStringDate).toHaveLength(24);
    });
  });

  describe("getLastSyncDate", () => {
    it("should return the last sync date", async () => {
      const lastSyncDate = "2021-10-03T00:00:00.000Z";
      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValue(lastSyncDate);

      const result = await systemStorageMock.getLastSyncDate();

      expect(result).toBe(lastSyncDate);
    });

    it("should throw an error if the get operation fails", async () => {
      const error = new Error("Test error");
      jest.spyOn(systemStorageMock, "getLastSyncDate").mockRejectedValue(error);

      await expect(syncHelpers.getLastSyncDate()).rejects.toThrow(error);
    });
  });

  describe("shouldSync", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it("should return true if there is no last sync date", async () => {
      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValue(new Date("invalid"));

      const result = await syncHelpers.shouldSync();
      expect(result).toBe(true);
    });

    it("should return true if there is no last sync date is invalid date", async () => {
      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValue(new Date("invalid"));

      const result = await syncHelpers.shouldSync();
      expect(result).toBe(true);
    });

    it("should return true if the last sync date is more than one day ago", async () => {
      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValue("2023-11-13T00:00:00.000Z");

      const result = await syncHelpers.shouldSync();
      expect(result).toBe(true);
    });

    it("should return false if the last sync date is less than one day ago", async () => {
      const dateTwoHoursAgo = new Date();
      dateTwoHoursAgo.setHours(dateTwoHoursAgo.getHours() - 23);
      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValue(dateTwoHoursAgo.toISOString());

      const result = await syncHelpers.shouldSync();

      expect(result).toBe(false);
    });

    it("should return true if the last sync date is less (before) than next specified sync time in ms", async () => {
      const date30SecondsAgo = new Date();
      date30SecondsAgo.setMilliseconds(-1000 * 30);

      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValueOnce(date30SecondsAgo.toISOString());

      const result = await syncHelpers.shouldSync(1000 * 5);

      expect(result).toBe(true);
    });

    it("should return false if the last sync date is more (after) than specified sync time in ms", async () => {
      const dateFiveSecondsAgo = new Date();
      dateFiveSecondsAgo.setMilliseconds(-1000 * 5);

      jest
        .spyOn(systemStorageMock, "getLastSyncDate")
        .mockResolvedValueOnce(dateFiveSecondsAgo.toISOString());

      const result = await syncHelpers.shouldSync(1000 * 30);

      expect(result).toBe(false);
    });
  });
});
