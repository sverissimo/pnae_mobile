import AsyncStorage from "@react-native-async-storage/async-storage";

export abstract class LocalStorageRepository {
  protected abstract collection: string;
  protected abstract key: string;
  protected storage = AsyncStorage;

  async saveData(key: string, value: {}) {
    try {
      const entity = JSON.stringify(value);

      const collection = await this.getCollection();
      const updatedCollection = {
        ...collection,
        [key]: entity,
      };
      await AsyncStorage.setItem(
        this.collection,
        JSON.stringify(updatedCollection)
      );
    } catch (e) {
      console.log("🚀 - LocalStorageRepository - saveData 17 - e:", e);
      throw new Error(
        `Erro ao salvar ${this.collection} no local storage: ${e}`
      );
    }
  }

  async findOne(key: string) {
    try {
      const collection = await this.getCollection();
      const entity = collection[key];
      if (entity) {
        return JSON.parse(entity);
      }
    } catch (e) {
      console.log("🚀 ~ file: localStorage.ts:17 ~ getData ~ e:", e);
    }
  }

  async findMany(keys: string[]) {
    const result = await this.getCollection();

    if (!Object.keys(result).length) {
      return [];
    }

    const collection = keys
      .map((key) => (result[key] ? JSON.parse(result[key]) : null))
      .filter((item) => item !== null);

    return collection;
  }

  async getCollection() {
    try {
      const fetchResult = await AsyncStorage.getItem(this.collection);
      const collection = fetchResult ? JSON.parse(fetchResult) : {};
      return collection;
    } catch (e) {
      console.log("🚀 ~ file: localStorage.ts:17 ~ getData ~ e:", e);
    }
  }

  async findAll() {
    const result = await AsyncStorage.getItem(this.collection);

    if (!result) {
      return [];
    }
    const collection = [];
    const entityDTO = JSON.parse(result);

    for (const key in entityDTO) {
      collection.push(JSON.parse(entityDTO[key]));
    }
    return collection;
  }

  async getAllKeys() {
    return await AsyncStorage.getAllKeys();
  }

  async getData(collectionName: string) {
    try {
      const fetchResult = await AsyncStorage.getItem(collectionName);

      const collection = fetchResult ? JSON.parse(fetchResult) : {};
      return collection;
    } catch (e) {
      console.log("🚀 ~ file: localStorage.ts:17 ~ getData ~ e:", e);
    }
  }

  async removeData(key: string) {
    try {
      const collection = await this.getCollection();
      delete collection[key];
      await AsyncStorage.setItem(this.collection, JSON.stringify(collection));
    } catch (e) {
      console.log("🚀 ~ file: localStorage.ts:25 ~ removeValue ~ e:", e);
    }
  }
}
