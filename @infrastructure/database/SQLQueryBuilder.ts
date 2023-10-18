type Entity = {
  [key: string]: any;
};

type builtQuery = {
  queryString: string;
  values: any[];
};

export class SQLQueryBuilder<T extends Entity> {
  constructor(
    protected readonly tableName: string,
    protected readonly primaryKey: string
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
  }

  findSQLQuery(values?: unknown, columnName?: string) {
    let queryString = `SELECT * FROM ${this.tableName} `;
    const column = columnName || this.primaryKey;

    if (values) {
      queryString += `WHERE ${column} = ?`;
    }

    return { queryString, values: [values] || [] };
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

  deleteSQLQuery(id: string): builtQuery {
    const queryString = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?;`;
    const values = [id];
    return { queryString, values };
  }
}
