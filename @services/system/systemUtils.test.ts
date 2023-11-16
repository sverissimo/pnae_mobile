jest.mock("@infrastructure/localStorage/system/SystemLocalStorageRepository");
import { SystemLocalStorageRepository } from "@infrastructure/localStorage/system/SystemLocalStorageRepository";
import { saveLastSyncDate, getLastSyncDate, shouldSync } from "./systemUtils";

jest.mock("@shared/utils/fileSystemUtils");
jest.mock("@infrastructure/database/config/expoSQLite");
// jest.mock(
//   "@infrastructure/localStorage/system/SystemLocalStorageRepository",
//   () => {
//     return {
//       SystemLocalStorageRepository: jest.fn().mockImplementation(() => ({
//         saveLastSyncDate: jest.fn(),
//         // other methods
//       })),
//     };
//   }
// )

const mockSystemLocalStorageRepository = new SystemLocalStorageRepository();

describe("systemUtils Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("saveLastSyncDate", () => {
    it("should call localStorage save method", async () => {
      const mockedMethod = jest.spyOn(
        SystemLocalStorageRepository.prototype,
        "saveLastSyncDate"
      );

      await saveLastSyncDate();
      expect(mockedMethod).toHaveBeenCalled();
    });
  });

  describe("getLastSyncDate", () => {
    it("should return the last sync date", async () => {
      const lastSyncDate = "2021-10-03T00:00:00.000Z";
      const mockedMethod = jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValue(lastSyncDate);

      const result = await getLastSyncDate();

      expect(result).toBe(lastSyncDate);
    });

    it("should throw an error if the get operation fails", async () => {
      const error = new Error("Test error");
      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockRejectedValue(error);

      await expect(getLastSyncDate()).rejects.toThrow(error);
    });
  });

  describe("shouldSync", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it("should return true if there is no last sync date", async () => {
      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValue(new Date("invalid"));

      const result = await shouldSync();
      expect(result).toBe(true);
    });

    it("should return true if there is no last sync date is invalid date", async () => {
      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValue(new Date("invalid"));

      const result = await shouldSync();
      expect(result).toBe(true);
    });

    it("should return true if the last sync date is more than one day ago", async () => {
      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValue("2023-11-13T00:00:00.000Z");

      const result = await shouldSync();
      expect(result).toBe(true);
    });

    it("should return false if the last sync date is less than one day ago", async () => {
      const dateTwoHoursAgo = new Date();
      dateTwoHoursAgo.setHours(dateTwoHoursAgo.getHours() - 23);
      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValue(dateTwoHoursAgo.toISOString());

      const result = await shouldSync();

      expect(result).toBe(false);
    });

    it("should return true if the last sync date is less (before) than next specified sync time in ms", async () => {
      const date30SecondsAgo = new Date();
      date30SecondsAgo.setMilliseconds(-1000 * 30);

      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValueOnce(date30SecondsAgo.toISOString());

      const result = await shouldSync(1000 * 5);

      expect(result).toBe(true);
    });

    it("should return false if the last sync date is more (after) than specified sync time in ms", async () => {
      const dateFiveSecondsAgo = new Date();
      dateFiveSecondsAgo.setMilliseconds(-1000 * 5);

      jest
        .spyOn(SystemLocalStorageRepository.prototype, "getLastSyncDate")
        .mockResolvedValueOnce(dateFiveSecondsAgo.toISOString());

      const result = await shouldSync(1000 * 30);

      expect(result).toBe(false);
    });
  });
});
