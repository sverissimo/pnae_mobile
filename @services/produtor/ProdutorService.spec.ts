import { ProdutorService } from "./ProdutorService";
import { ProdutorAPIRepository } from "@infrastructure/api";

const apiRepository = new ProdutorAPIRepository();
const produtorService = new ProdutorService(apiRepository);

jest.mock(
  "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository",
  () => {
    return {
      ProdutorLocalStorageRepository: jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockResolvedValue(undefined),
          findByCPF: jest.fn().mockResolvedValue(null), // or mockResolvedValue(mockedProdutor) if you want to return a specific produtor
          findAll: jest.fn().mockResolvedValue([]), // or mockResolvedValue(mockedProdutoresArray) if you want to return an array of produtores
          update: jest
            .fn()
            .mockRejectedValue(new Error("Method not implemented.")),
          delete: jest.fn().mockResolvedValue(undefined),
        };
      }),
    };
  }
);

jest.mock("@shared/utils/fileSystemUtils", () => ({
  FileSystem: {},
}));

describe("RelatorioService e2e tests", () => {
  it("should fetch an existing produtor remotely", async () => {
    const produtor = await produtorService.getProdutor("15609048605");

    console.log("🚀 - produtorService:", produtor);

    expect(produtor).not.toBeNull();
    expect(produtor).toHaveProperty("id_pessoa_demeter");
    expect(produtor).toHaveProperty("nm_pessoa");
  });
  it("should return undefined when a produtor is not found", async () => {
    const produtor = await produtorService.getProdutor("321");
    expect(produtor).toBeUndefined();
  });
});
