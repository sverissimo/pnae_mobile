import { PerfilAPIRepository } from "@infrastructure/api";
import { PerfilService } from "./PerfilService";
import { PerfilLocalStorageRepository } from "@infrastructure/localStorage/perfil/PerfilLocalStorageRepository";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { PerfilServiceConfig } from "./PerfilConfigService";
import { SyncHelpers } from "@sync/SyncHelpers";
import { GruposProdutosOptions } from "@domain/perfil";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import perfil from "_mockData/perfil/perfil.json";
// import perfilInput
import perfilOptions from "_mockData/perfil/perfilOptions.json";
import { ContractInfo } from "@domain/perfil/ContractInfo";

jest.mock("@shared/utils/fileSystemUtils");

jest.mock("@infrastructure/api/perfil/PerfilAPIRepository", () => {
  return {
    PerfilAPIRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      getPerfilOptions: jest.fn(),
      getGruposProdutos: jest.fn(),
      getContractInfo: jest.fn(),
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
        findAllWithLocalIds: jest.fn(),
        delete: jest.fn(),
        getPerfilOptions: jest.fn(),
        savePerfilOptions: jest.fn(),
        getGruposProdutos: jest.fn(),
        saveGruposProdutos: jest.fn(),
        getContractInfo: jest.fn(),
        saveContractInfo: jest.fn(),
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
        perfilService.getPerfilOptions = jest
          .fn()
          .mockResolvedValue(perfilOptions);

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
        offlinePerfilService.getPerfilOptions = jest.fn().mockResolvedValue({});
        await offlinePerfilService.create(perfilInput);
        expect(localRepository.create).toHaveBeenCalledWith(perfilInput);
      });
    });

    describe("uploadPerfil method tests", () => {
      it("should upload perfil remotely and delete it locally", async () => {
        const perfilWithLocalId = { ...perfil, localId: "0123456" } as any;
        jest
          .spyOn(localRepository, "findAllWithLocalIds")
          .mockResolvedValue([perfilWithLocalId]);
        jest.spyOn(remoteRepository, "create").mockResolvedValue(undefined);
        jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);
        jest
          .spyOn(localRepository, "getPerfilOptions")
          .mockResolvedValue(perfilOptions as PerfilOptions);

        await perfilService.sync();

        expect(localRepository.findAllWithLocalIds).toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalled();
        expect(localRepository.delete).toHaveBeenCalledWith(
          perfilWithLocalId.localId
        );
      });

      it("should not upload perfil if it does not exist locally", async () => {
        jest
          .spyOn(localRepository, "findAllWithLocalIds")
          .mockResolvedValue([]);
        jest.spyOn(remoteRepository, "create").mockResolvedValue(undefined);
        jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);

        await perfilService.sync();

        expect(localRepository.findAllWithLocalIds).toHaveBeenCalled();
        expect(remoteRepository.create).not.toHaveBeenCalled();
        expect(localRepository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe("PerfilService 2nd run", () => {
    describe("create method tests", () => {
      it("should create an perfil remotely when online", async () => {
        perfilService.getPerfilOptions = jest
          .fn()
          .mockResolvedValue(perfilOptions);

        const result = await perfilService.create(perfilInput);

        expect(localRepository.create).not.toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it("should store an perfil locally when offline", async () => {
        perfilService = new PerfilService({
          ...perfilServiceTestConfig,
          isConnected: false,
        });
        perfilService.getPerfilOptions = jest
          .fn()
          .mockResolvedValue(perfilOptions);

        await perfilService.create(perfilInput);

        expect(localRepository.create).toHaveBeenCalled();
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

      it("should get perfilOptions from REMOTE and save in localRepo if online sync is up to date, but NO LOCAL data.", async () => {
        jest.spyOn(localRepository, "getPerfilOptions").mockResolvedValue(null);
        jest
          .spyOn(remoteRepository, "getPerfilOptions")
          .mockResolvedValueOnce(perfilOptions);
        jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(false);

        const perfilOptionsOutput = await perfilService.getPerfilOptions();

        expect(localRepository.getPerfilOptions).toHaveBeenCalled();
        expect(remoteRepository.getPerfilOptions).toHaveBeenCalled();
        expect(localRepository.savePerfilOptions).toHaveBeenCalledWith(
          perfilOptionsOutput
        );
        expect(perfilOptionsOutput).toEqual(perfilOptions);
      });

      it("should NOT get perfilOptions from remote repository and save in localRepo if online but sync is up to date", async () => {
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

      it("should get gruposProdutos from REMOTE repository if online, NOT time to sync but also NO LOCAL data available", async () => {
        jest
          .spyOn(localRepository, "getGruposProdutos")
          .mockResolvedValue(null);

        jest
          .spyOn(remoteRepository, "getGruposProdutos")
          .mockResolvedValueOnce({} as GruposProdutosOptions);

        jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(false);

        const gruposProdutos = await perfilService.getGruposProdutos();

        expect(localRepository.getGruposProdutos).toHaveBeenCalled();
        expect(syncHelpers.shouldSync).toHaveBeenCalled();
        expect(remoteRepository.getGruposProdutos).toHaveBeenCalled();
        expect(localRepository.saveGruposProdutos).toHaveBeenCalledWith({});
        expect(gruposProdutos).toEqual({});
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

        localRepository.findAllWithLocalIds = jest
          .fn()
          .mockResolvedValue([perfilInput, perfilInput2]);
        remoteRepository.create = jest.fn().mockResolvedValue(true);
        localRepository.delete = jest.fn().mockResolvedValue(undefined);
        localRepository.getPerfilOptions = jest
          .fn()
          .mockResolvedValue(perfilOptions);

        perfilService.getGruposProdutos = jest.fn();
        perfilService.getContractInfo = jest.fn();

        await perfilService.sync();

        expect(localRepository.findAllWithLocalIds).toHaveBeenCalled();
        expect(perfilService.getGruposProdutos).toHaveBeenCalled();
        expect(perfilService.getContractInfo).toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalledTimes(2);
        expect(localRepository.delete).toHaveBeenCalledTimes(2);
      });

      it("should NOT sync perfils if there aint any saved locally", async () => {
        localRepository.findAllWithLocalIds = jest.fn().mockResolvedValue([]);
        perfilService.getGruposProdutos = jest.fn();
        perfilService.getContractInfo = jest.fn();

        await perfilService.sync();

        expect(localRepository.findAllWithLocalIds).toHaveBeenCalled();
        expect(perfilService.getGruposProdutos).not.toHaveBeenCalled();
        expect(perfilService.getContractInfo).not.toHaveBeenCalled();
        expect(remoteRepository.create).not.toHaveBeenCalled();
        expect(localRepository.delete).not.toHaveBeenCalled();
      });
    });

    describe("getContractInfo method tests", () => {
      it("should get contractInfo from local repository if offline", async () => {
        perfilService = new PerfilService({
          ...perfilServiceTestConfig,
          isConnected: false,
        });

        jest
          .spyOn(localRepository, "getContractInfo")
          .mockResolvedValue(perfilInput);

        const contractInfo = await perfilService.getContractInfo();
        expect(localRepository.getContractInfo).toHaveBeenCalled();
        expect(remoteRepository.getContractInfo).not.toHaveBeenCalled();
        expect(contractInfo).toEqual(perfilInput);
      });

      it("should get contractInfo from LOCAL repository online but NOT time to sync", async () => {
        const mockedContractInfo = [] as ContractInfo[];
        localRepository.getContractInfo = jest
          .fn()
          .mockResolvedValue(mockedContractInfo);

        jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(false);

        const contractInfo = await perfilService.getContractInfo();

        expect(localRepository.getContractInfo).toHaveBeenCalled();
        expect(syncHelpers.shouldSync).toHaveBeenCalled();
        expect(remoteRepository.getContractInfo).not.toHaveBeenCalled();
        expect(localRepository.saveContractInfo).not.toHaveBeenCalled();
        expect(contractInfo).toEqual(mockedContractInfo);
      });

      it("should get contractInfo from REMOTE repository if online, time to sync but NO LOCAL data available", async () => {
        const mockedContractInfo = [] as ContractInfo[];
        localRepository.getContractInfo = jest.fn().mockResolvedValue(null);

        remoteRepository.getContractInfo = jest.fn(() =>
          Promise.resolve(mockedContractInfo)
        );

        jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(false);

        const contractInfo = await perfilService.getContractInfo();

        expect(localRepository.getContractInfo).toHaveBeenCalled();
        expect(syncHelpers.shouldSync).toHaveBeenCalled();
        expect(remoteRepository.getContractInfo).toHaveBeenCalled();
        expect(localRepository.saveContractInfo).toHaveBeenCalledWith(
          mockedContractInfo
        );
        expect(contractInfo).toEqual(mockedContractInfo);
      });

      it("should get contractInfo from remote repository and save in localRepo if online and SHOULD UPDATE", async () => {
        const mockedContractInfo = [] as ContractInfo[];
        localRepository.getContractInfo = jest
          .fn()
          .mockResolvedValue(mockedContractInfo);
        remoteRepository.getContractInfo = jest.fn().mockResolvedValue([]);

        jest.spyOn(syncHelpers, "shouldSync").mockResolvedValueOnce(true);

        const contractInfo = await perfilService.getContractInfo();

        expect(localRepository.getContractInfo).toHaveBeenCalled();
        expect(syncHelpers.shouldSync).toHaveBeenCalled();
        expect(remoteRepository.getContractInfo).toHaveBeenCalled();
        expect(localRepository.saveContractInfo).toHaveBeenCalledWith(
          mockedContractInfo
        );
        expect(contractInfo).toEqual(mockedContractInfo);
      });
    });
  });
});
