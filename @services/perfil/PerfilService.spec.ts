import { PerfilAPIRepository } from "@infrastructure/api";
import { PerfilService } from "./PerfilService";
import { PerfilLocalStorageRepository } from "@infrastructure/localStorage/perfil/PerfilLocalStorageRepository";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { PerfilServiceConfig } from "./PerfilConfigService";
import perfil from "_mockData/perfil.json";

jest.mock("@shared/utils/fileSystemUtils");

jest.mock("@infrastructure/api/perfil/PerfilAPIRepository", () => {
  return {
    PerfilAPIRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      getPerfilOptions: jest.fn(),
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
      })),
    };
  }
);

const perfilInput = perfil as any;

const isConnected = true;
let perfilService: PerfilService;
let localRepository: PerfilRepository;
let remoteRepository: PerfilRepository;
let perfilServiceTestConfig: PerfilServiceConfig;

describe("PerfilService tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localRepository = new PerfilLocalStorageRepository();
    remoteRepository = new PerfilAPIRepository();

    perfilServiceTestConfig = {
      isConnected,
      localRepository,
      remoteRepository,
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

        await perfilService.sync();

        expect(localRepository.findAll).toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalledWith(perfil);
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

        const perfilOptions = await perfilService.getPerfilOptions();

        expect(remoteRepository.getPerfilOptions).toHaveBeenCalled();
        expect(localRepository.getPerfilOptions).not.toHaveBeenCalled();
        expect(localRepository.savePerfilOptions).toHaveBeenCalledWith(
          perfilInput
        );
        expect(perfilOptions).toEqual(perfilInput);
      });
    });
    describe("create method tests", () => {
      it("should create an perfil remotely when online", async () => {
        const result = await perfilService.create(perfilInput);

        expect(localRepository.create).not.toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalledWith(perfilInput);
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
});
