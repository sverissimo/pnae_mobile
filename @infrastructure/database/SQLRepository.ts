type Entity = {
  [key: string]: any;
};

type builtQuery = {
  queryString: string;
  values: any[];
};

export abstract class SQLRepository<T extends Entity> {
  constructor(
    protected readonly tableName: string,
    protected readonly primaryKey: string,
    protected db?: any
  ) {}

  createSQLQuery(entity: T): builtQuery {
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
    return { queryString, values };
    // await this.executeSqlCommand(queryString, values);
  }

  async find(query?: string, values?: string[]) {
    query = query || `SELECT * FROM ${this.tableName} `;
    values = values || [];

    const result = await this.executeSqlQuery(query, values);
    return result;
  }

  updateSQLQuery(entity: T): builtQuery {
    const { [this.primaryKey]: id, ...update } = entity;
    const setClause = Object.keys(update)
      .filter((key) => key !== this.primaryKey)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(update);
    const queryString = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?;`;
    const valuesWithId = [...values, id];

    return { queryString, values: valuesWithId };
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?;`;
    const deleteResult = await this.executeSqlCommand(query, [id]);

    if (deleteResult.rowsAffected === 0) {
      throw new Error("Erro ao deletar relatório");
    }
    return;
  }

  // Implementation is needed in the child class
  protected executeSqlQuery = async (
    query: string,
    values: any[]
  ): Promise<T[]> => {
    return [] as T[];
  };

  // Implementation is needed in the child class
  protected executeSqlCommand = async (
    query: string,
    values: any[]
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        resolve(null);
        return true;
      } catch (error) {
        reject(error);
        return false;
      }
    });
  };
}
