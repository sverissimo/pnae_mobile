import { SQLResultSet, SQLiteDatabase, SQLTransaction } from "expo-sqlite";
import { SQL_DAO } from "@infrastructure/database/dao/SQL_DAO";
import { RelatorioLocalDTO } from "../dto/RelatorioLocalDTO";
import { db as expoSQLiteDB } from "@infrastructure/database/config/expoSQLite";

export class RelatorioExpoSQLDAO extends SQL_DAO<RelatorioLocalDTO> {
  constructor(db: SQLiteDatabase = expoSQLiteDB) {
    super("relatorio", "id");
    this.db = db;
  }

  executeSqlQuery = (
    query: string,
    values: any[]
  ): Promise<RelatorioLocalDTO[]> => {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
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
      this.db.transaction((tx: SQLTransaction) => {
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
