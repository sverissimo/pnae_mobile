import { PerfilAPIRepository } from "./PerfilAPIRepository"; // Replace with the actual import path
import { PerfilInputDTO } from "@services/perfil/dto/PerfilInputDTO";
import perfilInputDTO from "_mockData/perfil/createPerfilInputComplete.json";

describe("PerfilAPIRepository", () => {
  let perfilAPIRepository: PerfilAPIRepository;

  beforeEach(() => {
    perfilAPIRepository = new PerfilAPIRepository();
  });

  it("Create method", async () => {
    // const result = await perfilAPIRepository.create(perfil);
    // expect(result).toBeUndefined();
  });
});
