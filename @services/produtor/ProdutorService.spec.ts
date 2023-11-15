import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorService } from "./ProdutorService";
import { ProdutorAPIRepository } from "@infrastructure/api";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";

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
          .mockImplementation(async (cpfProdutor: string) =>
            Promise.resolve(undefined)
          ),
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

jest.mock("@shared/utils/fileSystemUtils", () => ({
  FileSystem: {},
}));

let apiRepository: ProdutorRepository;
let localStorage: ProdutorRepository;
let produtorService: ProdutorService;

describe("ProdutorService integration tests", () => {
  beforeEach(() => {
    apiRepository = new ProdutorAPIRepository();
    localStorage = new ProdutorLocalStorageRepository();
    produtorService = new ProdutorService(true, localStorage, apiRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch an existing produtor locally and and not call remoteAPI if savedLocally", async () => {
    jest.spyOn(localStorage, "findByCPF").mockResolvedValue(mockedProdutor);
    const produtor = await produtorService.getProdutor("01234567890");
    expect(localStorage.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(apiRepository.findByCPF).not.toHaveBeenCalled();
    expect(localStorage.create).not.toHaveBeenCalled();
    expect(produtor).toEqual(mockedProdutor);
  });

  it("should fetch an existing produtor remotely and save into localStorage when online if not saved locally", async () => {
    jest.spyOn(apiRepository, "findByCPF").mockResolvedValue(mockedProdutor);
    const produtor = await produtorService.getProdutor("01234567890");
    expect(localStorage.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(apiRepository.findByCPF).toHaveBeenCalledWith("01234567890");
    expect(localStorage.create).toHaveBeenCalledWith(mockedProdutor);
    expect(produtor).toEqual(mockedProdutor);
  });
  it("should return undefined when a produtor is not found", async () => {
    const produtor = await produtorService.getProdutor("321");
    expect(localStorage.findByCPF).toHaveBeenCalledWith("321");
    expect(apiRepository.findByCPF).toHaveBeenCalledWith("321");
    expect(localStorage.create).not.toHaveBeenCalled();
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
