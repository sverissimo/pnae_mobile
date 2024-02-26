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
  beforeAll(async () => {
    db = await dbInit(createRelatorioTableQuery);
    relatorioDAO = new RelatorioSQLiteDAO(db);
    repository = new RelatorioSQLRepository(relatorioDAO);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("toLocalDTO", () => {
    it("should have RelatorioLocalDTO props", () => {
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
      expect(relatorioLocalDTO).not.toHaveProperty("updated_at");
      expect(relatorioLocalDTO).not.toHaveProperty("nome_outro_extensionista");
      //   expect(relatorioLocalDTO).toEqual(expectedDTO);
    });

    it("should convert RelatorioModel to RelatorioLocalDTO", () => {
      const relatorioLocalDTO = repository.toLocalDTO(relatorio);

      expect(relatorioLocalDTO.id_contrato).toEqual(1);
      expect(relatorioLocalDTO.assinatura_uri).toEqual("assinaturaURI");
      expect(relatorioLocalDTO.picture_uri).toEqual("pictureURI");
      expect(relatorioLocalDTO.outro_extensionista).toEqual("456");
      expect(relatorioLocalDTO.read_only).toEqual(true);
      expect(relatorioLocalDTO.id_at_atendimento).toEqual(undefined);
    });
  });
  describe("toModel", () => {
    it("should convert RelatorioLocalDTO to RelatorioModel", () => {
      const relatorioModel = repository.toModel(expectedDTO);

      expect(relatorioModel.contratoId).toEqual(1);
      expect(relatorioModel.assinaturaURI).toEqual(
        "file:///data/user/0/br.gov.mg.emater.pnae_mobile/files/1698103234950.png"
      );
      expect(relatorioModel.pictureURI).toEqual(
        "file:///data/user/0/br.gov.mg.emater.pnae_mobile/cache/ImagePicker/24d9cd00-9e86-4522-ac5c-79c95334558a.jpeg"
      );
      expect(relatorioModel.readOnly).toEqual(false);
      expect(relatorioModel.atendimentoId).toEqual(undefined);
    });
  });
});
