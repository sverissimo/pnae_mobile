jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageRepository } from "./LocalStorageRepository";

class TestLocalStorageRepository extends LocalStorageRepository {
  protected collection = "testCollection";
  protected key = "testKey";
}

const mockGetItem = AsyncStorage.getItem as jest.Mock;

const testKey = "1";
const testData = { foo: "bar" };
let testRepo: LocalStorageRepository;

describe("TestLocalStorageRepository", () => {
  beforeEach(() => {
    testRepo = new TestLocalStorageRepository();
    jest.clearAllMocks();
  });

  it("should save data correctly", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("{}");

    await testRepo.saveData(testKey, testData);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "testCollection",
      JSON.stringify({ [testKey]: JSON.stringify(testData) })
    );
  });

  it("should find one entity correctly", async () => {
    mockGetItem.mockResolvedValueOnce(
      JSON.stringify({ [testKey]: JSON.stringify(testData) })
    );

    const result = await testRepo.findOne(testKey);

    expect(result).toEqual(testData);
  });

  it("should handle findOne when entity does not exist", async () => {
    const testKey = "nonexistent";

    mockGetItem.mockResolvedValueOnce(JSON.stringify({}));
    const result = await testRepo.findOne(testKey);

    expect(result).toBeUndefined();
  });

  it("should find many entities correctly", async () => {
    const keys = ["1", "2"];
    const entities = {
      "1": JSON.stringify({ foo: "bar" }),
      "2": JSON.stringify({ baz: "qux" }),
    };

    mockGetItem.mockResolvedValueOnce(JSON.stringify(entities));
    const result = await testRepo.findMany(keys);

    expect(result).toEqual([
      JSON.parse(entities["1"]),
      JSON.parse(entities["2"]),
    ]);
  });

  it("should return empty array when no entity is found", async () => {
    const keys = ["1", "2"];

    mockGetItem.mockResolvedValueOnce(null);
    const result = await testRepo.findMany(keys);

    expect(result).toEqual([]);
  });

  it("should get all entities in the collection", async () => {
    const entities = {
      "1": JSON.stringify({ foo: "bar" }),
      "2": JSON.stringify({ baz: "qux" }),
    };

    mockGetItem.mockResolvedValueOnce(JSON.stringify(entities));
    const result = await testRepo.findAll();
    expect(result).toEqual(Object.values(entities).map((e) => JSON.parse(e)));
  });

  it("should remove data correctly", async () => {
    const testKey = "1";
    const initialData = {
      "1": JSON.stringify({ foo: "bar" }),
      "2": JSON.stringify({ baz: "qux" }),
    };

    mockGetItem.mockResolvedValueOnce(JSON.stringify(initialData));
    await testRepo.removeData(testKey);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "testCollection",
      JSON.stringify({ "2": JSON.stringify({ baz: "qux" }) })
    );
  });
});
