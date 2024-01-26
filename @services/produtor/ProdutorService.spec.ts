import { ProdutorService } from "./ProdutorService";
import { ProdutorAPIRepository } from "@infrastructure/api";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { ProdutorSyncService } from "@sync/produtor/ProdutorSyncService";

const mockedProdutor: ProdutorModel = {
  id_pessoa_demeter: "1",
  nm_pessoa: "Teste",
  nr_cpf_cnpj: "01234567890",
  tp_sexo: "M",
  dt_nascimento: "1990-01-01",
  dt_update_record: "2021-01-01",
  sn_ativo: "1",
  dap: "123",
  caf: "123",
  perfis: [],
  propriedades: [],
};

jest.mock(
  "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository",
  () => {
    return {
      ProdutorLocalStorageRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        findByCPF: jest
          .fn()
          .mockImplementation(() => Promise.resolve(undefined)),
      })),
    };
  }
);

jest.mock("@infrastructure/api/produtor/ProdutorAPIRepository", () => {
  return {
    ProdutorAPIRepository: jest.fn().mockImplementation(() => ({
      findByCPF: jest.fn(),
    })),
  };
});

jest.mock("@shared/utils/fileSystemUtils");
jest.mock("@infrastructure/database/config/expoSQLite");
jest.mock("@sync/produtor/ProdutorSyncService");

let localRepository: ProdutorRepository;
let remoteRepository: ProdutorRepository;
let syncService: ProdutorSyncService;
let produtorService: ProdutorService;

describe("ProdutorService integration tests", () => {
  beforeEach(() => {
    remoteRepository = new ProdutorAPIRepository();
    localRepository = new ProdutorLocalStorageRepository();
    syncService = new ProdutorSyncService();
    produtorService = new ProdutorService({
      isConnected: true,
      localRepository,
      remoteRepository,
      syncService,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return undefined when not found locally and not connected to the internet.", async () => {
    const produtorService = new ProdutorService({
      isConnected: false,
      localRepository,
    });
    const produtor = await produtorService.getProdutor("doesnt exist");

    expect(localRepository.findByCPF).toHaveBeenCalledWith("doesnt exist");
    expect(remoteRepository.findByCPF).not.toHaveBeenCalled();
    expect(syncService.syncProdutorAndPerfis).not.toHaveBeenCalled();
    expect(produtor).toBeUndefined();
  });

  it("should return produtor local when saved locally and not connected to the internet.", async () => {
    jest.spyOn(localRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    const produtorService = new ProdutorService({
      isConnected: false,
      localRepository,
    });
    const produtor = await produtorService.getProdutor("01234567890");

    expect(localRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(remoteRepository.findByCPF).not.toHaveBeenCalled();
    expect(syncService.syncProdutorAndPerfis).not.toHaveBeenCalled();
    expect(produtor).toEqual(mockedProdutor);
  });

  it("should return undefined when not found locally, connected to the internet, but also not found on server.", async () => {
    const produtor = await produtorService.getProdutor("doesnt exist");

    expect(localRepository.findByCPF).toHaveBeenCalledWith("doesnt exist");
    expect(remoteRepository.findByCPF).toHaveBeenCalledWith("doesnt exist");
    expect(syncService.syncProdutorAndPerfis).not.toHaveBeenCalled();
    expect(produtor).toBeUndefined();
  });

  it("should fetch an existing produtor remotely and save into localRepository when online if not saved locally", async () => {
    jest.spyOn(remoteRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    const produtor = await produtorService.getProdutor("01234567890");
    expect(localRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(remoteRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(localRepository.create).toHaveBeenCalledWith(mockedProdutor);
    expect(syncService.syncProdutorAndPerfis).not.toHaveBeenCalled();
    expect(produtor).toEqual(mockedProdutor);
  });

  it("should fetch an existing produtor locally and call syncService and call remoteRepository if savedLocally and connected to the internet", async () => {
    jest.spyOn(localRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    jest.spyOn(localRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    remoteRepository.findByCPF = jest.fn(() => Promise.resolve(mockedProdutor));

    const produtor = await produtorService.getProdutor("01234567890");

    expect(localRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(remoteRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(localRepository.create).toHaveBeenCalledWith(mockedProdutor);
    expect(produtor).toEqual(mockedProdutor);
  });

  it("should return undefined when connected, but produtor is not found locally or remote", async () => {
    const produtor = await produtorService.getProdutor("321");
    expect(localRepository.findByCPF).toHaveBeenCalledWith("321");
    expect(remoteRepository.findByCPF).toHaveBeenCalledWith("321");
    expect(localRepository.create).not.toHaveBeenCalled();
    expect(syncService.syncProdutorAndPerfis).not.toHaveBeenCalled();

    expect(produtor).toBeUndefined();
  });
});

// describe.skip("ProdutorService e2e tests", () => {
//   it("should fetch an existing produtor remotely", async () => {
//     const produtor = await produtorService.getProdutor("15609048605");

//     console.log("🚀 - produtorService:", produtor);

//     expect(produtor).not.toBeNull();
//     expect(produtor).toHaveProperty("id_pessoa_demeter");
//     expect(produtor).toHaveProperty("nm_pessoa");
//   });
//   it("should return undefined when a produtor is not found", async () => {
//     const produtor = await produtorService.getProdutor("321");
//     expect(produtor).toBeUndefined();
//   });
// });
