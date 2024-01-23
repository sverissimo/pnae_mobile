import { PerfilAPIRepository } from "./PerfilAPIRepository"; // Replace with the actual import path
import perfilInputDTO from "_mockData/perfil/perfilInput.json";
import perfilInput from "_mockData/perfil/perfil.json";
import { PerfilModel } from "@domain/perfil";
import { PerfilDataMapper } from "./PerfilDataMapper";

describe("PerfilAPIRepository", () => {
  let perfilAPIRepository: PerfilAPIRepository;

  const perfil = { ...perfilInput, ...perfilInputDTO } as PerfilModel;

  beforeEach(() => {
    perfilAPIRepository = new PerfilAPIRepository();
  });

  it("Create method", async () => {
    // const result = await perfilAPIRepository.create(perfil);
    // expect(result).toBeUndefined();
  });
});
