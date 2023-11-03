import sqlite3 from "sqlite3";
import { SQL_DAO } from "@infrastructure/database/dao/SQL_DAO";
import { RelatorioLocalDTO } from "../dto/RelatorioLocalDTO";

export class RelatorioSQLiteDAO extends SQL_DAO<RelatorioLocalDTO> {
  constructor(db: sqlite3.Database) {
    super("relatorio", "id");
    this.db = db;
  }

  async executeSqlQuery(
    query: string,
    values: any[]
  ): Promise<RelatorioLocalDTO[]> {
    return this.db.all(query, values);
  }

  async executeSqlCommand(
    query: string,
    values: any[]
  ): Promise<sqlite3.RunResult> {
    return this.db.run(query, values);
  }
}
