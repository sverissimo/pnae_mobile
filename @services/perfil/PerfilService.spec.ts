import { PerfilAPIRepository } from "@infrastructure/api";
import { PerfilService } from "./PerfilService";
import { PerfilLocalStorageRepository } from "@infrastructure/localStorage/perfil/PerfilLocalStorageRepository";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { PerfilServiceConfig } from "./PerfilConfigService";
import { SyncHelpers } from "@sync/SyncHelpers";
import perfil from "_mockData//perfil/perfil.json";
import gruposProdutosOptions from "_mockData/perfil/gruposProdutosOptions.json";
import { GruposProdutosOptions } from "@domain/perfil";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";

jest.mock("@shared/utils/fileSystemUtils");

jest.mock("@infrastructure/api/perfil/PerfilAPIRepository", () => {
  return {
    PerfilAPIRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      getPerfilOptions: jest.fn(),
      getGruposProdutos: jest.fn(),
    })),
  };
});

jest.mock("@sync/SyncHelpers", () => {
  return {
    SyncHelpers: jest.fn().mockImplementation(() => ({
      shouldSync: jest.fn(),
    })),
  };
});

jest.mock(
  "@infrastructure/localStorage/perfil/PerfilLocalStorageRepository",
  () => {
    return {
      PerfilLocalStorageRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        findByRelatorioId: jest.fn(),
        findAll: jest.fn(),
        delete: jest.fn(),
        getPerfilOptions: jest.fn(),
        savePerfilOptions: jest.fn(),
        getGruposProdutos: jest.fn(),
        saveGruposProdutos: jest.fn(),
      })),
    };
  }
);

const perfilInput = perfil as any;

const isConnected = true;
let perfilService: PerfilService;
let localRepository: PerfilRepository;
let remoteRepository: PerfilRepository;
let syncHelpers: SyncHelpers;
let perfilServiceTestConfig: PerfilServiceConfig;

describe("PerfilService tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localRepository = new PerfilLocalStorageRepository();
    remoteRepository = new PerfilAPIRepository();
    syncHelpers = new SyncHelpers();

    perfilServiceTestConfig = {
      isConnected,
      localRepository,
      remoteRepository,
      syncHelpers,
    };

    perfilService = new PerfilService(perfilServiceTestConfig);
  });

  describe("PerfilService 1st run", () => {
    describe("create perfil method tests", () => {
      it("should create a perfil remotely if online", async () => {
        await perfilService.create(perfilInput);
        expect(remoteRepository.create).toHaveBeenCalled();
        expect(localRepository.create).not.toHaveBeenCalled();
        expect(localRepository.delete).not.toHaveBeenCalled();
      });

      it("should create a perfil locally if offline", async () => {
        const offlinePerfilService = new PerfilService({
          ...perfilServiceTestConfig,
          isConnected: false,
        });
        await offlinePerfilService.create(perfilInput);
        expect(localRepository.create).toHaveBeenCalledWith(perfilInput);
      });
    });

    describe("uploadPerfil method tests", () => {
      it("should upload perfil remotely and delete it locally", async () => {
        jest.spyOn(localRepository, "findAll").mockResolvedValue([perfilInput]);
        jest.spyOn(remoteRepository, "create").mockResolvedValue(undefined);
        jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);
        jest
          .spyOn(perfilService, "getPerfilOptions")
          .mockResolvedValue({} as PerfilOptions);
        await perfilService.sync();

        expect(localRepository.findAll).toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalledWith(perfil, {});
        expect(localRepository.delete).toHaveBeenCalledWith(perfil.id);
      });

      it("should not upload perfil if it does not exist locally", async () => {
        jest.spyOn(localRepository, "findAll").mockResolvedValue([]);
        jest.spyOn(remoteRepository, "create").mockResolvedValue(undefined);
        jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);

        await perfilService.sync();

        expect(localRepository.findAll).toHaveBeenCalled();
        expect(remoteRepository.create).not.toHaveBeenCalled();
        expect(localRepository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe("PerfilService 2nd run", () => {
    describe("create method tests", () => {
      it("should create an perfil remotely when online", async () => {
        jest
          .spyOn(perfilService, "getPerfilOptions")
          .mockResolvedValue({} as PerfilOptions);

        const result = await perfilService.create(perfilInput);

        expect(localRepository.create).not.toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalledWith(perfilInput, {});
        expect(result).toBeUndefined();
      });

      it("should store an perfil locally when offline", async () => {
        perfilService = new PerfilService({
          isConnected: false,
          localRepository: localRepository,
          remoteRepository: remoteRepository,
        });

        await perfilService.create(perfilInput);

        expect(localRepository.create).toHaveBeenCalledWith(perfilInput);
        expect(remoteRepository.create).not.toHaveBeenCalled();
        expect(localRepository.delete).not.toHaveBeenCalled();
      });
    });

    describe("getPerfilOptions method", () => {
      it("should get perfil options from local repository if offline", async () => {
        perfilService = new PerfilService({
          ...perfilServiceTestConfig,
          isConnected: false,
        });

        jest
          .spyOn(localRepository, "getPerfilOptions")
          .mockResolvedValue(perfilInput);

        const perfilOptions = await perfilService.getPerfilOptions();
        expect(localRepository.getPerfilOptions).toHaveBeenCalled();
        expect(remoteRepository.getPerfilOptions).not.toHaveBeenCalled();
        expect(perfilOptions).toEqual(perfilInput);
      });

      it("should get perfil options from remote repository and save in localRepo if online", async () => {
        jest
          .spyOn(remoteRepository, "getPerfilOptions")
          .mockResolvedValueOnce(perfilInput);
        jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(true);

        const perfilOptions = await perfilService.getPerfilOptions();

        expect(localRepository.getPerfilOptions).toHaveBeenCalled();
        expect(remoteRepository.getPerfilOptions).toHaveBeenCalled();
        expect(localRepository.savePerfilOptions).toHaveBeenCalledWith(
          perfilInput
        );
        expect(perfilOptions).toEqual(perfilInput);
      });
    });

    it("should NOT get perfil options from remote repository and save in localRepo if online but sync is up to date", async () => {
      jest
        .spyOn(localRepository, "getPerfilOptions")
        .mockResolvedValueOnce(perfilInput);
      jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(false);

      const perfilOptions = await perfilService.getPerfilOptions();

      expect(localRepository.getPerfilOptions).toHaveBeenCalled();
      expect(remoteRepository.getPerfilOptions).not.toHaveBeenCalled();
      expect(localRepository.savePerfilOptions).not.toHaveBeenCalled();
      expect(perfilOptions).toEqual(perfilInput);
    });
  });

  describe("getGruposProdutos method", () => {
    it("should get gruposProdutos from local repository if offline", async () => {
      perfilService = new PerfilService({
        ...perfilServiceTestConfig,
        isConnected: false,
      });

      jest
        .spyOn(localRepository, "getGruposProdutos")
        .mockResolvedValue(perfilInput);

      const gruposProdutos = await perfilService.getGruposProdutos();
      expect(localRepository.getGruposProdutos).toHaveBeenCalled();
      expect(remoteRepository.getGruposProdutos).not.toHaveBeenCalled();
      expect(gruposProdutos).toEqual(perfilInput);
    });
    it("should get gruposProdutos from remote repository and save in localRepo if online", async () => {
      jest
        .spyOn(localRepository, "getGruposProdutos")
        .mockResolvedValue({} as GruposProdutosOptions);

      jest
        .spyOn(remoteRepository, "getGruposProdutos")
        .mockResolvedValueOnce(perfilInput);

      jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(true);

      const gruposProdutos = await perfilService.getGruposProdutos();

      expect(localRepository.getGruposProdutos).toHaveBeenCalled();
      expect(syncHelpers.shouldSync).toHaveBeenCalled();
      expect(remoteRepository.getGruposProdutos).toHaveBeenCalled();
      expect(localRepository.saveGruposProdutos).toHaveBeenCalledWith(
        perfilInput
      );
      expect(gruposProdutos).toEqual(perfilInput);
    });
  });
  describe("sync method tests", () => {
    it("should retrieve all perfils from local repository", async () => {
      localRepository.findAll = jest.fn().mockResolvedValue([perfilInput]);

      const result = await perfilService.getAllLocalPerfils();

      expect(localRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([perfilInput]);
    });

    it("should sync all perfils", async () => {
      const perfilInput2 = { ...perfilInput, id: "456" };

      localRepository.findAll = jest
        .fn()
        .mockResolvedValue([perfilInput, perfilInput2]);
      remoteRepository.create = jest.fn().mockResolvedValue(true);
      localRepository.delete = jest.fn().mockResolvedValue(undefined);

      await perfilService.sync();

      expect(localRepository.findAll).toHaveBeenCalled();
      expect(remoteRepository.create).toHaveBeenCalledTimes(2);
      expect(localRepository.delete).toHaveBeenCalledTimes(2);
    });

    it("should NOT sync perfils if there aint any saved locally", async () => {
      localRepository.findAll = jest.fn().mockResolvedValue([]);

      await perfilService.sync();

      expect(localRepository.findAll).toHaveBeenCalled();
      expect(remoteRepository.create).not.toHaveBeenCalled();
      expect(localRepository.delete).not.toHaveBeenCalled();
    });
  });
});
