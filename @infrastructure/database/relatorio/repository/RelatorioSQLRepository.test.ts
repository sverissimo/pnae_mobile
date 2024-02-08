import { dbInit } from "@infrastructure/database/config/sqlite";
import { RelatorioSQLiteDAO } from "../dao/RelatorioSQLiteDAO";
import { RelatorioSQLRepository } from "./RelatorioSQLRepository";
import { createRelatorioTableQuery } from "@infrastructure/database/queries/createTableQueries";
import { SQL_DAO } from "@infrastructure/database/dao/SQL_DAO";
import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioLocalDTO } from "../dto/RelatorioLocalDTO";

import relatorioModel from "_mockData/relatorio/relatorioModel.json";
import relatorioDTO from "_mockData/relatorio/relatorioLocalDTO.json";

const relatorio = relatorioModel as RelatorioModel;
const expectedDTO = relatorioDTO as RelatorioLocalDTO;

let db: any;
let relatorioDAO: SQL_DAO<RelatorioLocalDTO>;
let repository: any;

describe("RelatorioSQLRepository", () => {
  beforeEach(async () => {
    db = dbInit(createRelatorioTableQuery);
    relatorioDAO = new RelatorioSQLiteDAO(db);
    repository = new RelatorioSQLRepository(relatorioDAO);
  });

  describe("toLocalDTO", () => {
    it("should convert RelatorioModel to RelatorioLocalDTO", () => {
      const relatorioLocalDTO = repository.toLocalDTO(relatorio);
      expect(relatorioLocalDTO).toHaveProperty("produtor_id");
      expect(relatorioLocalDTO).toHaveProperty("tecnico_id");
      expect(relatorioLocalDTO).toHaveProperty("numero_relatorio");
      expect(relatorioLocalDTO).toHaveProperty("assunto");
      expect(relatorioLocalDTO).toHaveProperty("orientacao");
      expect(relatorioLocalDTO).toHaveProperty("picture_uri");
      expect(relatorioLocalDTO).toHaveProperty("assinatura_uri");
      expect(relatorioLocalDTO).toHaveProperty("outro_extensionista");
      expect(relatorioLocalDTO).toHaveProperty("read_only");
      expect(relatorioLocalDTO).toHaveProperty("coordenadas");
      expect(relatorioLocalDTO).toHaveProperty("created_at");
      //   expect(relatorioLocalDTO).toHaveProperty("updated_at");
      //   expect(relatorioLocalDTO).toEqual(expectedDTO);
    });

    // it("should handle missing fields", () => {
    //   const relatorioModel = {
    //     id: "1",
    //     campoExtra: "extra",
    //   };

    //   const expectedRelatorioLocalDTO = {
    //     id: "1",
    //     campo_extra: "extra",
    //   };

    //   const relatorioLocalDTO = repository.toLocalDTO(relatorioModel);

    //   expect(relatorioLocalDTO).toEqual(expectedRelatorioLocalDTO);
    // });
  });
});
