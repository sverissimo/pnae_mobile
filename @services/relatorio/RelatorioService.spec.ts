import { dbInit } from "@infrastructure/database/config/sqlite";
import { createRelatorioTableQuery } from "@infrastructure/database/queries/createTableQueries";
import { RelatorioSQLiteDAO } from "@infrastructure/database/relatorio/dao/RelatorioSQLiteDAO";
import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioService } from "./RelatorioService";
import { RelatorioModel } from "@features/relatorio/types";

jest.mock("@shared/utils/fileSystemUtils", () => ({
  deleteFile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@infrastructure/api/files/FileAPI", () =>
  jest.fn().mockImplementation(() => ({
    getMissingFilesFromServer: async () => jest.fn(),
  }))
);

jest.mock("@infrastructure/database/config/expoSQLite", () => ({
  db: {
    exec: async () => jest.fn(),
    open: async () => jest.fn(),
    close: async () => jest.fn(),
  },
}));

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

let db: any;
let relatorioService: RelatorioService;
let repository: RelatorioRepository;
let relatorioDAO: RelatorioSQLiteDAO;

describe("RelatorioService e2e tests", () => {
  beforeEach(async () => {
    db = await dbInit(createRelatorioTableQuery);
    relatorioDAO = new RelatorioSQLiteDAO(db);
    repository = new RelatorioSQLRepository(relatorioDAO);
    relatorioService = new RelatorioService(false, repository);
  });

  afterEach(async () => {
    await db.exec("DROP TABLE relatorio");
    await db.close();
  });

  it("should create relatorio locally", async () => {
    await relatorioService.createRelatorio(relatorioInput);
    console.log("----------------- a -------------");

    const relatorio = (await relatorioService.getRelatorios(
      "1"
    )) as RelatorioModel[];
    console.log("🚀 - it.only - relatorio:", relatorio);

    expect(relatorio[0].id).toHaveLength(36);
    expect(relatorio[0].produtorId).toBe("1");
    expect(relatorio[0].assunto).toBe("Teste");
    expect(relatorio[0].numeroRelatorio).toBe(30);
    expect(relatorio[0].outroExtensionista).toEqual([]);
    expect(relatorio[0].readOnly).toBe(false);
    expect(relatorio[0].createdAt).not.toBeNull();
    expect(Date.parse(relatorio[0].createdAt)).toBeTruthy();
    expect(
      Date.parse(relatorio[0].createdAt) < new Date().getTime()
    ).toBeTruthy();
  });

  it("should update relatorio", async () => {
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
  it("should delete relatorio by its id", async () => {
    const relatorioId = await relatorioService.createRelatorio(relatorioInput);
    const relatorio = (await repository.findById!(
      relatorioId
    )) as RelatorioModel;

    expect(relatorio).toHaveProperty("id", relatorioId);

    await relatorioService.deleteRelatorio(relatorioId);
    const updatedRelatorios = (await relatorioService.getRelatorios(
      "1"
    )) as RelatorioModel[];

    expect(updatedRelatorios).toHaveLength(0);
  });
});