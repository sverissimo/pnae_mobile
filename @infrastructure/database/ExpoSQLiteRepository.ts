import { SQLResultSet } from "expo-sqlite";
import { db } from "./config";
import { SQLRepository } from "./SQLRepository";

type Entity = {
  [key: string]: any;
};

export class ExpoSQLiteRepository<T extends Entity> extends SQLRepository<T> {
  executeSqlQuery = (query: string, values: any[]): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          query,
          values,
          (_, { rows: { _array } }) => {
            resolve(_array);
            return true;
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  executeSqlCommand = (query: string, values: any[]): Promise<SQLResultSet> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          query,
          values,
          (_, result) => {
            resolve(result);
            return true;
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };
}
