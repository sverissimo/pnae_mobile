import * as SQLite from "expo-sqlite";
import { createRelatorioTableQuery } from "../queries/createTableQueries";

export const db = SQLite.openDatabase("pnae_mobile.db");

export async function init_db() {
  await new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      try {
        await executeSqlAsync(tx, createRelatorioTableQuery);
        resolve(true);
        console.log("Table ensured or created");
      } catch (error) {
        console.error("Error creating table", error);
        reject(error);
      }
    });
  });

  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      try {
        const tableInfo: any = await executeSqlAsync(
          tx,
          "PRAGMA table_info(relatorio);"
        );

        const existingColumns = Array(tableInfo.rows)[0]._array.map(
          (row: any) => row.name
        );

        const columnExists = existingColumns.some(
          (col: string) => col === "id_contrato"
        );

        if (!columnExists) {
          await executeSqlAsync(
            tx,
            "ALTER TABLE relatorio ADD COLUMN id_contrato INTEGER;"
          );
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function drop_table_relatorio() {
  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      try {
        await executeSqlAsync(tx, "DROP TABLE IF EXISTS relatorio;");
        resolve(true);
      } catch (error) {
        console.log("🚀 - db.transaction - error:", error);
        reject(false);
      }
    });
  });
}

function executeSqlAsync(
  tx: SQLite.SQLTransaction,
  query: string,
  params = []
) {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      query,
      params,
      (_, result) => {
        resolve(result);
      },
      (_, error) => {
        console.error(`Error executing query: ${query}`, error);
        reject(error);
        return false;
      }
    );
  });
}

// export function init_db(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         createRelatorioTableQuery,
//         [],
//         () => {
//           resolve();
//         },
//         (_: SQLite.SQLTransaction, err: SQLite.SQLError) => {
//           console.log(err);
//           reject(err);
//           return true;
//         }
//       );
//     });
//   });
// }
