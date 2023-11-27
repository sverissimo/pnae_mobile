import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorSyncService } from "./ProdutorSyncService";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { ProdutorAPIRepository } from "@infrastructure/api";
import produtoresJSON from "_mockData/produtores.json";

jest.mock("@shared/utils/fileSystemUtils");
jest.mock("../SyncHelpers");
jest.mock("@infrastructure/api/produtor/ProdutorAPIRepository");
jest.mock(
  "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository"
);

let mockLocalRepository: ProdutorLocalStorageRepository;
let mockRemoteRepository: ProdutorAPIRepository;
let syncService: ProdutorSyncService;
const syncURL = "http://example.com/sync";
const produtor = produtoresJSON[0];

const mockProdutor: ProdutorModel = {
  ...produtor,
  propriedades: [],
  perfis: [],
};

const mockSyncInfo = {
  missingIdsOnServer: [],
  outdatedOnServer: [],
  missingOnClient: [],
  outdatedOnClient: [],
  upToDateIds: [],
};

describe("ProdutorSyncService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalRepository = new ProdutorLocalStorageRepository();
    mockRemoteRepository = new ProdutorAPIRepository();
    syncService = new ProdutorSyncService({
      produtorLocalRepository: mockLocalRepository,
      produtorRemoteRepository: mockRemoteRepository,
      syncURL,
    });
  });

  describe("syncProdutoresAndPerfis", () => {
    it("should create a produtor locally if missing on client", async () => {
      const syncInfo = {
        ...mockSyncInfo,
        missingOnClient: [mockProdutor],
      };
      jest.spyOn(mockLocalRepository, "create").mockResolvedValue(undefined);
      jest
        .spyOn(mockRemoteRepository, "getSyncInfo")
        .mockResolvedValue(syncInfo);

      const result = await syncService.syncProdutorAndPerfis(mockProdutor);

      expect(mockRemoteRepository.getSyncInfo).toHaveBeenCalledWith(syncURL, {
        produtorId: mockProdutor.id_pessoa_demeter,
        updatedAt: mockProdutor.dt_update_record,
      });
      expect(mockLocalRepository.create).toHaveBeenCalledWith(
        syncInfo.missingOnClient[0]
      );
      expect(result).toEqual(syncInfo.missingOnClient[0]);
      expect(mockProdutor).toEqual(syncInfo.missingOnClient[0]);
      expect(mockLocalRepository.update).not.toHaveBeenCalled();
      expect(mockRemoteRepository.create).not.toHaveBeenCalled();
      expect(mockRemoteRepository.update).not.toHaveBeenCalled();
    });

    it("should update a produtor locally if outdated on client", async () => {
      const syncInfo = {
        ...mockSyncInfo,
        outdatedOnClient: [mockProdutor],
      };
      jest.spyOn(mockLocalRepository, "update").mockResolvedValue(undefined);
      jest
        .spyOn(mockRemoteRepository, "getSyncInfo")
        .mockResolvedValue(syncInfo);

      const result = await syncService.syncProdutorAndPerfis(mockProdutor);

      expect(mockRemoteRepository.getSyncInfo).toHaveBeenCalledWith(syncURL, {
        produtorId: mockProdutor.id_pessoa_demeter,
        updatedAt: mockProdutor.dt_update_record,
      });
      expect(mockLocalRepository.update).toHaveBeenCalledWith(
        syncInfo.outdatedOnClient[0]
      );
      expect(result).toEqual(syncInfo.outdatedOnClient[0]);
      expect(mockProdutor).toEqual(syncInfo.outdatedOnClient[0]);
      expect(mockLocalRepository.create).not.toHaveBeenCalled();
      expect(mockRemoteRepository.create).not.toHaveBeenCalled();
      expect(mockRemoteRepository.update).not.toHaveBeenCalled();
    });

    it("should create a produtor remotely if missing on server", async () => {
      const syncInfo = {
        ...mockSyncInfo,
        missingIdsOnServer: [mockProdutor.id_pessoa_demeter],
      };
      jest.spyOn(mockRemoteRepository, "create").mockResolvedValue(undefined);
      jest
        .spyOn(mockRemoteRepository, "getSyncInfo")
        .mockResolvedValue(syncInfo);

      await syncService.syncProdutorAndPerfis(mockProdutor);

      expect(mockRemoteRepository.getSyncInfo).toHaveBeenCalledWith(syncURL, {
        produtorId: mockProdutor.id_pessoa_demeter,
        updatedAt: mockProdutor.dt_update_record,
      });
      expect(mockRemoteRepository.create).toHaveBeenCalledWith(mockProdutor);
      expect(mockRemoteRepository.update).not.toHaveBeenCalled();
      expect(mockLocalRepository.create).not.toHaveBeenCalled();
      expect(mockLocalRepository.update).not.toHaveBeenCalled();
    });

    it("should update a produtor remotely if outdated on server", async () => {
      const syncInfo = {
        ...mockSyncInfo,
        outdatedOnServer: [mockProdutor.id_pessoa_demeter],
      };
      jest.spyOn(mockRemoteRepository, "update").mockResolvedValue(undefined);
      jest
        .spyOn(mockRemoteRepository, "getSyncInfo")
        .mockResolvedValue(syncInfo);

      await syncService.syncProdutorAndPerfis(mockProdutor);

      expect(mockRemoteRepository.getSyncInfo).toHaveBeenCalledWith(syncURL, {
        produtorId: mockProdutor.id_pessoa_demeter,
        updatedAt: mockProdutor.dt_update_record,
      });
      expect(mockRemoteRepository.update).toHaveBeenCalledWith(mockProdutor);
      expect(mockRemoteRepository.create).not.toHaveBeenCalled();
      expect(mockLocalRepository.create).not.toHaveBeenCalled();
      expect(mockLocalRepository.update).not.toHaveBeenCalled();
    });

    it("should not perform any action if the produtor is up-to-date", async () => {
      const syncInfo = {
        ...mockSyncInfo,
        upToDateIds: [mockProdutor.id_pessoa_demeter],
      };

      jest
        .spyOn(mockRemoteRepository, "getSyncInfo")
        .mockResolvedValue(syncInfo);

      const result = await syncService.syncProdutorAndPerfis(mockProdutor);

      expect(mockRemoteRepository.getSyncInfo).toHaveBeenCalledWith(syncURL, {
        produtorId: mockProdutor.id_pessoa_demeter,
        updatedAt: mockProdutor.dt_update_record,
      });
      expect(mockLocalRepository.create).not.toHaveBeenCalled();
      expect(mockLocalRepository.update).not.toHaveBeenCalled();
      expect(mockRemoteRepository.create).not.toHaveBeenCalled();
      expect(mockRemoteRepository.update).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
