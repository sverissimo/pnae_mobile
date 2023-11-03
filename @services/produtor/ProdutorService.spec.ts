import { ProdutorService } from "./ProdutorService";
import { ProdutorAPIRepository } from "@infrastructure/api";

const apiRepository = new ProdutorAPIRepository();
const produtorService = new ProdutorService(apiRepository);

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
