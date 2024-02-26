import * as SQLite from "expo-sqlite";
import { createRelatorioTableQuery } from "../queries/createTableQueries";

export const db = SQLite.openDatabase("pnae_mobile.db");

type Column = {
  columnName: string;
  type: string;
};
class DatabaseService {
  private db: SQLite.SQLiteDatabase = db;

  constructor(databaseName: string = "pnae_mobile.db") {
    if (databaseName) this.db = SQLite.openDatabase(databaseName);
  }

  public async initDB(): Promise<void> {
    await this.ensureTable(createRelatorioTableQuery);
    await this.ensureColumns("relatorio", [
      {
        columnName: "id_contrato",
        type: "INTEGER",
      },
      {
        columnName: "id_at_atendimento",
        type: "TEXT",
      },
    ]);
  }

  private async ensureTable(createTableQuery: string): Promise<void> {
    await this.executeTransactionAsync(
      createTableQuery,
      "Table ensured or created",
      "Error creating table"
    );
  }

  private async ensureColumns(
    tableName: string,
    columns: Column[]
  ): Promise<void> {
    const existingColumns = await this.getTableColumns(tableName);

    for (const col of columns) {
      const { columnName, type } = col;
      const columnExists = existingColumns.includes(columnName);
      console.log("🚀 - columnExists:", col, columnExists);

      if (!columnExists) {
        await this.addColumn(tableName, columnName, type);
      }
    }
  }

  private async getTableColumns(tableName: string): Promise<string[]> {
    const tableInfo: any = await this.executeTransactionAsync(
      `PRAGMA table_info(${tableName});`,
      "",
      "Error getting table info"
    );
    return tableInfo.rows._array.map((row: any) => row.name);
  }

  private async addColumn(
    tableName: string,
    columnName: string,
    type: string
  ): Promise<void> {
    await this.executeTransactionAsync(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${type};`,
      `Column ${columnName} added`,
      "Error adding column"
    );
  }

  public async dropTable(tableName: string): Promise<void> {
    await this.executeTransactionAsync(
      `DROP TABLE IF EXISTS ${tableName};`,
      `${tableName} dropped`,
      `Error dropping ${tableName}`
    );
  }

  private async executeTransactionAsync(
    query: string,
    successMessage: string = "",
    errorMessage: string = ""
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            console.log(successMessage);
            resolve(result);
          },
          (_, error) => {
            console.error(errorMessage, error);
            reject(error);
            return false;
          }
        );
      });
    });
  }
}

export default DatabaseService;
