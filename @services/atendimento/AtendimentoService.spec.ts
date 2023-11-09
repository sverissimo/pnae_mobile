import { AtendimentoAPIRepository } from "@infrastructure/api";
import { AtendimentoService } from "./AtendimentoService";

const apiRepository = new AtendimentoAPIRepository();
const atendimentoService = new AtendimentoService(apiRepository);
jest.mock("@shared/utils/fileSystemUtils", () => ({
  FileSystem: {},
}));

describe("AtendimentoService e2e tests", () => {
  it("should create a atendimento remotely", async () => {
    console.log("To be implemented...");
    expect(true).toBe(true);
  });
});
