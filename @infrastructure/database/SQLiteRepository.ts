import { SQLResultSet } from "expo-sqlite";
import { SQLRepository } from "./SQLRepository";

type Entity = {
  [key: string]: any;
};

export class SQLiteRepository<T extends Entity> extends SQLRepository<T> {
  executeSqlQuery(query: string, values: any[]): Promise<T[]> {
    return this.db.get(query, values);
  }

  executeSqlCommand = (query: string, values: any[]): Promise<SQLResultSet> => {
    return this.db.run(query, values);
  };
}
