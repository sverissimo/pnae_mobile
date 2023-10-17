import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import { RelatorioModel } from "@features/relatorio/types";
import { createRelatorioTableQuery } from "@infrastructure/database/queries/createTableQueries";
import { RelatorioSQLiteRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLiteRepository";
import { RelatorioService } from "./RelatorioService";

jest.mock("@shared/utils/fileSystemUtils", () => {
  return jest.fn().mockImplementation(() => {
    return {
      deleteFile: async () => jest.fn(),
    };
  });
});

jest.mock("@infrastructure/api/FileAPI", () =>
  jest.fn().mockImplementation(() => {
    return {
      getMissingFilesFromServer: async () => jest.fn(),
    };
  })
);

jest.mock("@infrastructure/database/config", () => {
  return jest.fn().mockImplementation(() => {
    return {
      db: jest.fn().mockImplementation(() => {
        return {
          exec: async () => jest.fn(),
          open: async () => jest.fn(),
          close: async () => jest.fn(),
        };
      }),
    };
  });
});

const relatorioInput: RelatorioModel = {
  id: "",
  produtorId: "1",
  tecnicoId: "1620",
  nomeTecnico: "Elisio Geraldo Campos",
  numeroRelatorio: 30,
  assunto: "Teste",
  orientacao: "Teste",
  pictureURI: "Teste",
  assinaturaURI: "Teste",
  outroExtensionista: [],
  matriculaOutroExtensionista: "Teste",
  nomeOutroExtensionista: "Teste",
  coordenadas: "Teste",
  createdAt: undefined,
};

describe("RelatorioService e2e tests", () => {
  let db: any;
  let relatorioService: RelatorioService;

  beforeEach(async () => {
    db = await sqlite.open({
      filename: ":memory:",
      driver: sqlite3.Database,
    });
    await db.exec(createRelatorioTableQuery);
    const repository = new RelatorioSQLiteRepository("relatorio", "id", db);
    relatorioService = new RelatorioService(false, repository);
  });

  afterEach(async () => {
    await db.exec("DROP TABLE relatorio");
    await db.close();
  });

  it("should insert data locally", async () => {
    await relatorioService.createRelatorio(relatorioInput);
    const relatorio = (await relatorioService.getRelatorios(
      "1"
    )) as RelatorioModel[];

    expect(relatorio[0].id).toHaveLength(36);
    expect(relatorio[0].produtorId).toBe("1");
    expect(relatorio[0].assunto).toBe("Teste");
    expect(relatorio[0].numeroRelatorio).toBe(30);
    expect(relatorio[0].readOnly).toBe(false);
    expect(relatorio[0].createdAt).not.toBeNull();
    expect(Date.parse(relatorio[0].createdAt)).toBeTruthy();
    expect(
      Date.parse(relatorio[0].createdAt) < new Date().getTime()
    ).toBeTruthy();
  });

  it("should update data", async () => {
    const relatorioId = await relatorioService.createRelatorio(relatorioInput);
    const relatorios = (await relatorioService.getRelatorios(
      "1"
    )) as RelatorioModel[];

    const relatorioUpdate = {
      id: relatorioId,
      produtorId: "1",
      tecnicoId: "1620",
      nomeTecnico: "John Should Be Replaced",
      numeroRelatorio: 31,
      assunto: "Updated teste",
      orientacao: "Updated orientação",
      pictureURI: "Updated pictureURI",
      assinaturaURI: "Updated assinaturaURI",
      outroExtensionista: [],
      matriculaOutroExtensionista: "Updated matriculaOutroExtensionista",
      nomeOutroExtensionista: "Updated nomeOutroExtensionista",
      createdAt: undefined,
    };

    await relatorioService.updateRelatorio(relatorioUpdate);

    const updatedRelatorios = (await relatorioService.getRelatorios(
      "1"
    )) as RelatorioModel[];

    const [[relatorio], [updatedRelatorio]] = [relatorios, updatedRelatorios];

    expect(relatorioId).toHaveLength(36);
    expect(relatorio.updatedAt).toBeFalsy();
    expect(updatedRelatorio.id).toBe(relatorioId);
    expect(updatedRelatorio.produtorId).toBe("1");
    expect(updatedRelatorio.nomeTecnico).toBe("Elisio Geraldo Campos");
    expect(updatedRelatorio.assunto).toBe("Updated teste");
    expect(updatedRelatorio.numeroRelatorio).toBe(31);
    expect(updatedRelatorio.readOnly).toBe(false);
    expect(updatedRelatorio.createdAt).not.toBeNull();
    expect(Date.parse(updatedRelatorio.createdAt)).toBeTruthy();
    expect(
      Date.parse(updatedRelatorio.createdAt) <
        Date.parse(updatedRelatorio.updatedAt)
    ).toBeTruthy();
  });
});
