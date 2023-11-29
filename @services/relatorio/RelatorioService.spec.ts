import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { RelatorioService } from "./RelatorioService";
import { RelatorioModel } from "@features/relatorio/types";
import { UsuarioService } from "@services/usuario/UsuarioService";
import { RelatorioSyncService } from "@sync/relatorio/RelatorioSyncService";
import { RelatorioAPIRepository } from "@infrastructure/api/relatorio/repository/RelatorioAPIRepository";

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

const usuarioInput = {
  id_usuario: "1620",
  nome_usuario: "Elisio Geraldo Campos",
  matricula_usuario: "1620",
};

jest.mock("@shared/utils/fileSystemUtils", () => ({
  deleteFile: jest.fn(),
  fileExists: jest.fn(),
}));
jest.mock("@infrastructure/api/files/FileAPI");
jest.mock("@infrastructure/database/config/expoSQLite");

jest.mock(
  "@infrastructure/database/relatorio/repository/RelatorioSQLRepository"
);
jest.mock("@sync/relatorio/RelatorioSyncService");

jest.mock("@infrastructure/api/relatorio/repository/RelatorioAPIRepository");
jest.mock("@services/usuario/UsuarioService", () => ({
  UsuarioService: jest.fn().mockImplementation(() => {
    return {
      setConnectionStatus: jest.fn(),
      getUsuariosByIds: jest.fn(),
    };
  }),
}));

const syncService = new RelatorioSyncService();
const db = jest.fn() as any;
const localRepository = new RelatorioSQLRepository(
  db
) as jest.Mocked<RelatorioSQLRepository>;
const remoteRepository =
  new RelatorioAPIRepository() as jest.Mocked<RelatorioAPIRepository>;
const usuarioService = new UsuarioService() as jest.Mocked<UsuarioService>;

const relatorioServiceConfig = {
  isConnected: true,
  localRepository,
  remoteRepository,
  usuarioService,
  syncService,
};

describe("RelatorioService tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(usuarioService, "getUsuariosByIds")
      .mockResolvedValue([usuarioInput]);
  });
  describe("getRelatorios Method", () => {
    it("should return relatorios from local repository and not sync if offline", async () => {
      jest
        .spyOn(localRepository, "findByProdutorId")
        .mockResolvedValue([relatorioInput]);

      const relatorioService: RelatorioService = new RelatorioService({
        ...relatorioServiceConfig,
        isConnected: false,
        localRepository,
      });

      const relatorios = await relatorioService.getRelatorios("1");

      console.log("🚀 RelatorioService.spec.ts:86- relatorios:", relatorios);
      // expect(relatorios).toEqual([relatorioInput]);

      expect(localRepository.findByProdutorId).toHaveBeenCalledTimes(1);
      expect(remoteRepository.findAll).not.toHaveBeenCalled();
      expect(syncService.syncRelatorios).not.toHaveBeenCalled();
      expect(relatorios).toHaveLength(1);
    });
    it("should return relatorios from server if local repository is empty", async () => {
      jest.spyOn(localRepository, "findByProdutorId").mockResolvedValue([]);

      jest
        .spyOn(remoteRepository, "findByProdutorId")
        .mockResolvedValue([relatorioInput]);

      const relatorioService: RelatorioService = new RelatorioService(
        relatorioServiceConfig
      );

      const relatorios = await relatorioService.getRelatorios("1");

      expect(localRepository.findByProdutorId).toHaveBeenCalledTimes(1);
      expect(remoteRepository.findByProdutorId).toHaveBeenCalledTimes(1);
      expect(syncService.syncRelatorios).not.toHaveBeenCalled();
      expect(relatorios).toHaveLength(1);
    });

    it("should return relatorios from local repository and sync if online", async () => {
      jest
        .spyOn(localRepository, "findByProdutorId")
        .mockResolvedValue([relatorioInput]);

      const relatorioService: RelatorioService = new RelatorioService(
        relatorioServiceConfig
      );

      const relatorios = await relatorioService.getRelatorios("1");

      expect(localRepository.findByProdutorId).toHaveBeenCalledTimes(2);
      expect(remoteRepository.findByProdutorId).not.toHaveBeenCalled();
      expect(syncService.syncRelatorios).toHaveBeenCalledTimes(1);
      expect(relatorios).toHaveLength(1);
    });

    it("should return an empty array if there is no relatorio", async () => {
      jest.spyOn(localRepository, "findByProdutorId").mockResolvedValue([]);
      jest.spyOn(remoteRepository, "findByProdutorId").mockResolvedValue([]);

      const relatorioService: RelatorioService = new RelatorioService(
        relatorioServiceConfig
      );

      const relatorios = await relatorioService.getRelatorios("1");

      expect(localRepository.findByProdutorId).toHaveBeenCalledTimes(1);
      expect(remoteRepository.findByProdutorId).toHaveBeenCalledTimes(1);
      expect(syncService.syncRelatorios).not.toHaveBeenCalled();
      expect(relatorios).toHaveLength(0);
    });
  });

  describe("deleteRelatorio Method", () => {
    it("should throw an error if offline", async () => {
      const relatorioService: RelatorioService = new RelatorioService({
        ...relatorioServiceConfig,
        isConnected: false,
        localRepository,
      });

      await expect(relatorioService.deleteRelatorio("1")).rejects.toThrow(
        new Error(
          "Não é possível apagar o relatório sem conexão com a internet."
        )
      );
    });
    it("should delete relatorio from local repository and sync if online", async () => {
      const relatorioService: RelatorioService = new RelatorioService(
        relatorioServiceConfig
      );

      jest.spyOn(localRepository, "findById").mockResolvedValue(relatorioInput);
      jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);
      jest.spyOn(remoteRepository, "delete").mockResolvedValue(undefined);

      await relatorioService.deleteRelatorio("1");

      expect(localRepository.delete).toHaveBeenCalledTimes(1);
      expect(remoteRepository.delete).toHaveBeenCalledTimes(1);
      expect(syncService.syncRelatorios).not.toHaveBeenCalled();
    });
  });
  it("should throw an error if relatorio is not found", async () => {
    const relatorioService: RelatorioService = new RelatorioService(
      relatorioServiceConfig
    );

    jest.spyOn(localRepository, "findById").mockResolvedValue(null);

    await expect(relatorioService.deleteRelatorio("1")).rejects.toThrowError();
  });
});
