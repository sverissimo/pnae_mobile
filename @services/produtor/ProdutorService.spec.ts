import { ProdutorService } from "./ProdutorService";
import { ProdutorAPIRepository } from "@infrastructure/api";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";

const mockedProdutor = {
  id_pessoa_demeter: "1",
  nm_pessoa: "Teste",
  nr_cpf_cnpj: "01234567890",
  tp_sexo: "M",
  dt_nascimento: "1990-01-01",
  sn_ativo: "1",
  dap: "123",
  caf: "123",
  perfis: [],
  relatorios: [],
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

let remoteRepository: ProdutorRepository;
let localRepository: ProdutorRepository;
let produtorService: ProdutorService;

describe("ProdutorService integration tests", () => {
  beforeEach(() => {
    remoteRepository = new ProdutorAPIRepository();
    localRepository = new ProdutorLocalStorageRepository();
    produtorService = new ProdutorService({
      isConnected: true,
      localRepository,
      remoteRepository,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch an existing produtor locally and and not call remoteAPI if savedLocally", async () => {
    jest.spyOn(localRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    const produtor = await produtorService.getProdutor("01234567890");
    expect(localRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(remoteRepository.findByCPF).not.toHaveBeenCalled();
    expect(localRepository.create).not.toHaveBeenCalled();
    expect(produtor).toEqual(mockedProdutor);
  });

  it("should fetch an existing produtor remotely and save into localRepository when online if not saved locally", async () => {
    jest.spyOn(remoteRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    const produtor = await produtorService.getProdutor("01234567890");
    expect(localRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(remoteRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(localRepository.create).toHaveBeenCalledWith(mockedProdutor);
    expect(produtor).toEqual(mockedProdutor);
  });
  it("should return undefined when a produtor is not found", async () => {
    const produtor = await produtorService.getProdutor("321");
    expect(localRepository.findByCPF).toHaveBeenCalledWith("321");
    expect(remoteRepository.findByCPF).toHaveBeenCalledWith("321");
    expect(localRepository.create).not.toHaveBeenCalled();
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
