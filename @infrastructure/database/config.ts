import * as SQLite from "expo-sqlite";
import { createRelatorioTableQuery } from "./queries/createTableQueries";

export const db = SQLite.openDatabase("pnae_mobile.db");

export function init_db(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        createRelatorioTableQuery,
        [],
        () => {
          resolve();
        },
        (_: SQLite.SQLTransaction, err: SQLite.SQLError) => {
          console.log(err);
          reject(err);
          return true;
        }
      );
    });
  });
}
