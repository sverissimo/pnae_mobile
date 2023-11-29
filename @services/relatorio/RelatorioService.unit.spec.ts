import { RelatorioRepository } from "@domain/relatorio";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { UsuarioService } from "@services/usuario/UsuarioService";
import { RelatorioService } from "./RelatorioService";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { Usuario } from "@shared/types";
import { RelatorioServiceConfig } from "./RelatorioServiceConfig";
import relatorios from "_mockData/relatorios.json";
import { RelatorioSyncService } from "@sync/relatorio/RelatorioSyncService";

jest.mock("@infrastructure/api/files/FileAPI");
jest.mock("@shared/utils/fileSystemUtils", () => ({
  saveFile: jest.fn(),
  deleteFile: jest.fn(),
}));
jest.mock("@infrastructure/database/config/expoSQLite", () => ({
  db: {
    exec: jest.fn(),
    open: jest.fn(),
    close: jest.fn(),
  },
}));

let relatorioService: RelatorioService;
let mockLocalRepository: RelatorioRepository;
let mockRemoteRepository: RelatorioRepository;
let relatorioServiceConfig: RelatorioServiceConfig;
const mockUsuarioService = new UsuarioService();

const produtorId = "produtor-123";
const mockRelatoriosLocal: RelatorioModel[] = [];
const mockRelatoriosRemote: RelatorioModel[] = [];
const mockUsuarios: Usuario[] = [];

describe.skip("RelatorioService UNIT ONLLY!!", () => {
  beforeEach(() => {
    mockLocalRepository = {
      create: (relatorio) => Promise.resolve(),
      findByProdutorId: jest.fn().mockResolvedValue(mockRelatoriosLocal),
      update: (relatorio) => Promise.resolve(),
      delete: (relatorioId) => Promise.resolve(),
      findAll: () => Promise.resolve([]),
      createMany: (relatorios) => Promise.resolve(),
      updateMany: (relatorios) => Promise.resolve(),
    };
    mockRemoteRepository = {
      ...mockLocalRepository,
      findByProdutorId: jest.fn().mockResolvedValue(mockRelatoriosRemote),
    };

    jest.spyOn(mockUsuarioService, "getUsuariosByIds").mockResolvedValue(
      Promise.resolve([
        {
          id_usuario: "1620",
          nome_usuario: "Elisio Geraldo Campos",
          matricula_usuario: "123",
        },
      ])
    );

    // Create an instance of RelatorioService with mocked dependencies
    relatorioServiceConfig = {
      isConnected: true,
      usuarioService: mockUsuarioService,
      localRepository: mockLocalRepository,
      remoteRepository: mockRemoteRepository,
      syncService: new RelatorioSyncService(),
    };

    relatorioService = new RelatorioService(relatorioServiceConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch relatorios from local repository when disconnected", async () => {
    const relatorioService = new RelatorioService({
      ...relatorioServiceConfig,
      isConnected: false,
    });

    const relatorios = await relatorioService.getRelatorios(produtorId);

    expect(mockLocalRepository.findByProdutorId).toHaveBeenCalledWith(
      produtorId
    );
    // console.log("🚀 - it.only - relatorios:", {
    //   relatorios,
    //   mockRelatoriosLocal,
    // });

    // expect(relatorios).toEqual(mockRelatoriosLocal);
  });

  // it("should fetch and merge relatorios from both local and remote when connected", async () => {
  //   const relatorios = await relatorioService.getRelatorios(produtorId);
  //   expect(mockLocalRepository.findByProdutorId).toHaveBeenCalledWith(
  //     produtorId
  //   );
  //   expect(mockRemoteRepository.findByProdutorId).toHaveBeenCalledWith(
  //     produtorId
  //   );
  //   expect(relatorios).toEqual(
  //     expect.arrayContaining([...mockRelatoriosLocal, ...mockRelatoriosRemote])
  //   ); // Assuming mergeRelatorios does a simple array concatenation
  // });

  // it("should save updated relatorios to local repository when there are updates from server", async () => {
  //   // Mock the saveUpdatedRelatorios to track its call and arguments
  //   jest.spyOn(relatorioService, "saveUpdatedRelatorios").mockResolvedValue();
  //   await relatorioService.getRelatorios(produtorId);
  //   expect(relatorioService.saveUpdatedRelatorios).toHaveBeenCalledWith(
  //     mockRelatoriosLocal,
  //     expect.any(Array)
  //   );
  // });

  // it("should fetch technician details for the relatorios", async () => {
  //   const relatorios = await relatorioService.getRelatorios(produtorId);
  //   const tecnicoIds =
  //     RelatorioDomainService.getTecnicosIdsFromRelatoriosList(relatorios);
  //   expect(mockUsuarioService.getUsuariosByIds).toHaveBeenCalledWith(
  //     tecnicoIds
  //   );
  // });

  // it("should sort the relatorios by createdAt date", async () => {
  //   const relatorios = await relatorioService.getRelatorios(produtorId);
  //   for (let i = 1; i < relatorios.length; i++) {
  //     expect(new Date(relatorios[i].createdAt).getTime()).not.toBeLessThan(
  //       new Date(relatorios[i - 1].createdAt).getTime()
  //     );
  //   }
  // });

  // it("should handle and log errors when they occur", async () => {
  //   const error = new Error("Test error");
  //   jest
  //     .spyOn(mockLocalRepository, "findByProdutorId")
  //     .mockRejectedValue(error);
  //   await expect(relatorioService.getRelatorios(produtorId)).rejects.toThrow(
  //     error
  //   );
  // });
});
