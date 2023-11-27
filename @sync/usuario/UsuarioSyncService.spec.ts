import { UsuarioSyncService } from "./UsuarioSyncService";
import { Repository } from "@domain/Repository";
import { Usuario } from "@shared/types";
import { SyncHelpers } from "../SyncHelpers";
import { UsuarioAPIRepository } from "@infrastructure/api/usuario/UsuarioAPIRepository";
import { UsuarioLocalStorageRepository } from "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository";

let usuarioSyncService: UsuarioSyncService;
let mockLocalRepository: Repository<Usuario>;
let mockRemoteRepository: Partial<Repository<Usuario>>;
let syncHelpers: SyncHelpers;
const mockUsuarios: Usuario[] = [
  { id_usuario: "1", nome_usuario: "Test User 1", matricula_usuario: "123" },
  { id_usuario: "2", nome_usuario: "Test User 2", matricula_usuario: "456" },
];

jest.mock("@shared/utils/fileSystemUtils");
jest.mock(
  "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository",
  () => {
    return {
      UsuarioLocalStorageRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        createMany: jest.fn(),
        findAll: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      })),
    };
  }
);

jest.mock("@infrastructure/api/usuario/UsuarioAPIRepository", () => {
  return {
    UsuarioAPIRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      createMany: jest.fn(),
      findAll: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    })),
  };
});

jest.mock("../SyncHelpers", () => {
  return {
    SyncHelpers: jest.fn().mockImplementation(() => ({
      shouldSync: jest.fn().mockReturnValue(true),
    })),
  };
});

describe("UsuarioSyncService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    syncHelpers = new SyncHelpers();
    mockLocalRepository = new UsuarioLocalStorageRepository();
    mockRemoteRepository = new UsuarioAPIRepository();
    usuarioSyncService = new UsuarioSyncService({
      syncURL: "http://example.com/sync",
      usuarioLocalRepository: mockLocalRepository,
      usuarioRemoteRepository: mockRemoteRepository,
      syncHelpers,
    });
  });

  it("should not perform sync if not needed", async () => {
    jest.spyOn(syncHelpers, "shouldSync").mockResolvedValue(false);

    await usuarioSyncService.sync();

    expect(syncHelpers.shouldSync).toHaveBeenCalled();
    expect(mockLocalRepository.findAll).not.toHaveBeenCalled();
    expect(mockRemoteRepository.findMany).not.toHaveBeenCalled();
    expect(mockLocalRepository.createMany).not.toHaveBeenCalled();
  });

  it("should sync users when needed", async () => {
    //mockLocalRepository.findAll.mockResolvedValue(mockUsuarios);
    //mockRemoteRepository.findMany.mockResolvedValue(mockUsuarios);
    jest.spyOn(mockLocalRepository, "findAll").mockResolvedValue(mockUsuarios);
    jest
      .spyOn(mockRemoteRepository, "findMany")
      .mockResolvedValue(mockUsuarios);

    await usuarioSyncService.sync();

    expect(syncHelpers.shouldSync).toHaveBeenCalled();
    expect(mockLocalRepository.findAll).toHaveBeenCalled();
    expect(mockRemoteRepository.findMany).toHaveBeenCalledWith(
      mockUsuarios.map((u) => u.id_usuario)
    );
    expect(mockLocalRepository.createMany).toHaveBeenCalledWith(mockUsuarios);
  });

  //   it("should not perform sync if local repository is empty", async () => {
  //     mockLocalRepository.findAll.mockResolvedValue([]);

  //     await usuarioSyncService.sync();

  //     expect(syncHelpers.shouldSync).toHaveBeenCalled();
  //     expect(mockLocalRepository.findAll).toHaveBeenCalled();
  //     expect(mockRemoteRepository.findMany).not.toHaveBeenCalled();
  //     expect(mockLocalRepository.createMany).not.toHaveBeenCalled();
  //   });
});
