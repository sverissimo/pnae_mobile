import { db } from "../config";

export function checkDBSchema() {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
      [],
      (_, { rows: tableRows }) => {
        for (let i = 0, tableIndex = 0; i < tableRows.length; i++) {
          const tableName = tableRows.item(i).name;

          if (tableName === "android_metadata") {
            continue; // Skip the system table
          }

          console.log(`Table ${tableIndex}: ${tableName}`);
          tx.executeSql(
            `PRAGMA table_info("${tableName}");`,
            [],
            (_, { rows: columnRows }) => {
              for (let j = 0; j < columnRows.length; j++) {
                console.log(
                  `Column ${j}: ${columnRows.item(j).name} (type: ${
                    columnRows.item(j).type
                  })`
                );
              }
            }
          );

          tableIndex++; // Increment the table index only for non-system tables
        }
      }
    );
  });
}
