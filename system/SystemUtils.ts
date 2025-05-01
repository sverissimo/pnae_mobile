import { env } from "@config/env";
import DatabaseService from "@infrastructure/database/config/expoSQLite";
import { LocalStorageRepository } from "@infrastructure/localStorage/LocalStorageRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkFiles, deleteFile, listFiles } from "@shared/utils";

export class SystemUtils extends LocalStorageRepository {
  protected collection = "system";
  protected key = "";
  static readonly NON_DELETABLE_KEYS = [
    // "perfilOptions",
    // "gruposProdutos",
    "user",
    // "keepLocalDataProd3",
    // "system",
  ];

  static async init_system() {
    try {
      const db = new DatabaseService();
      await db.initDB();
      console.log("% db_init %");

      const cleanInstall = !!!(await this.should_NOT_ResetData());
      console.log("🚀 SystemUtils - cleanInstall:", cleanInstall);

      if (cleanInstall) {
        await db.dropTable("relatorio");
        await db.initDB();
        await this.resetData();
        await this.deleteAllFiles();
        await AsyncStorage.setItem("keepLocalDataProd01mai25", "true");
      }
      // checkFiles()
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }

  static async should_NOT_ResetData() {
    try {
      const keepData = await AsyncStorage.getItem("keepLocalDataProd01mai25");
      return !!keepData;
    } catch (error) {
      console.error("Error checking if data should be reset:", error);
      return false;
    }
  }

  static async resetData() {
    try {
      const doNotReset = await this.should_NOT_ResetData();

      // ---->>> REMOVE THIS TO MANUALLY RESET DATA
      if (doNotReset) {
        console.log("Data reset not required.");
        return;
      }

      const allKeys = await AsyncStorage.getAllKeys();
      const keysToDelete = allKeys.filter(
        (key) => !SystemUtils.NON_DELETABLE_KEYS.includes(key)
      );

      await AsyncStorage.multiRemove(keysToDelete);
      console.log("Data reset completed.");
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  }

  static async listAllLocalData() {
    const allKeys = await AsyncStorage.getAllKeys();
    console.log("🚀 - SystemUtils - listAllLocalData - allKeys:", allKeys);

    for (const key of allKeys) {
      !["produtores", "gruposProdutos"].includes(key) &&
        console.log(`${key} ---------  `, await new SystemUtils().getData(key));
    }
  }

  private static async deleteAllFiles() {
    const doNotDelete = await SystemUtils.should_NOT_ResetData();
    if (doNotDelete) {
      return;
    }

    const folders = [env.PICTURE_FOLDER, env.ASSINATURA_FOLDER];

    await Promise.all(
      folders.map(async (folder) => {
        const files = await listFiles(folder);
        if (!files || !files.length) {
          return;
        }
        await Promise.all(files.map(deleteFile));
      })
    );
  }
}

export default SystemUtils;
