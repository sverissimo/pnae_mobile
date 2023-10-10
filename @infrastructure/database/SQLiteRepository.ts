import { SQLResultSet } from "expo-sqlite";
import { db } from "./config";

type Entity = {
  [key: string]: any;
};

export class SQLiteRepository<T extends Entity> {
  constructor(
    private readonly tableName: string,
    private readonly primaryKey: string
  ) {}

  async create(entity: T): Promise<void> {
    const keys: (keyof T)[] = Object.keys(entity).filter(
      (key) =>
        entity[key as keyof T] !== null && entity[key as keyof T] !== undefined
    ) as (keyof T)[];

    const values = keys.map((key) => entity[key]);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const queryString = `
        INSERT INTO ${this.tableName} (${columns})
        VALUES (${placeholders})
        `;

    await this.executeSqlCommand(queryString, values);
  }

  async find(query?: string, values?: string[]) {
    query = query || `SELECT * FROM ${this.tableName} `;
    values = values || [];

    const result = await this.executeSqlQuery(query, values);
    return result;
  }

  async update(entity: T): Promise<void> {
    const { [this.primaryKey]: id, ...update } = entity;
    const setClause = Object.keys(update)
      .filter((key) => key !== this.primaryKey)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(update);
    const query = `UPDATE relatorio SET ${setClause} WHERE ${this.primaryKey} = ?;`;
    const valuesWithId = [...values, id];

    await this.executeSqlCommand(query, valuesWithId);
    return;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM relatorio WHERE id = ?;`;
    const deleteResult = await this.executeSqlCommand(query, [id]);

    if (deleteResult.rowsAffected === 0) {
      throw new Error("Erro ao deletar relatório");
    }
    return;
  }

  private executeSqlQuery = (query: string, values: any[]) => {
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

  private executeSqlCommand = async (
    query: string,
    values: any[]
  ): Promise<SQLResultSet> => {
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
