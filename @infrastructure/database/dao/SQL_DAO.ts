type Entity = {
  [key: string]: any;
};

export abstract class SQL_DAO<T extends Entity> {
  constructor(
    protected readonly tableName: string = "",
    protected readonly primaryKey: string = "",
    protected db?: any
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

  async createMany(entities: T[]): Promise<void> {
    const syncResult = await Promise.allSettled(
      entities.map((e) => this.create(e))
    );
    console.log("🚀 SQL_DAO - CreateMany 34 syncResult:", syncResult);
  }

  async find(values?: unknown, columnName?: string): Promise<T[]> {
    let queryString = `SELECT * FROM ${this.tableName} `;
    const column = columnName || this.primaryKey;

    if (values) {
      queryString += `WHERE ${column} = ?`;
    }
    const parsedValues = values ? [values] : [];

    const result = await this.executeSqlQuery(queryString, parsedValues);
    return result;
  }
  async findAll(): Promise<T[]> {
    return await this.find();
  }

  async update(entity: T): Promise<void> {
    const { [this.primaryKey]: id, ...update } = entity;
    const setClause = Object.keys(update)
      .filter((key) => key !== this.primaryKey)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(update);
    const queryString = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?;`;
    const valuesWithId = [...values, id];

    await this.executeSqlCommand(queryString, valuesWithId);
  }

  async updateMany(entities: T[]): Promise<void> {
    const syncResult = await Promise.allSettled(
      entities.map((e) => this.update(e))
    );
    console.log("🚀 SQL_DAO - UpdateMany 94 syncResult:", syncResult);
  }

  async delete(id: string): Promise<void> {
    const queryString = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?;`;
    const values = [id];
    await this.executeSqlCommand(queryString, values);
  }

  protected abstract executeSqlQuery(
    query: string,
    values: any[]
  ): Promise<T[]>;
  protected abstract executeSqlCommand(
    query: string,
    values: any[]
  ): Promise<unknown>;
}
