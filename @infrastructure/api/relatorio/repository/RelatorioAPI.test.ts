import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioAPI } from "./RelatorioAPI";
import { RelatorioBackendDTO } from "../dto";

const relatorio: RelatorioModel = {
  id: "123",
  produtorId: "123",
  tecnicoId: "123",
  numeroRelatorio: 1,
  nomeTecnico: "John Doe",
  assunto: "Assunto",
  orientacao: "Orientação",
  pictureURI: "pictureURI",
  assinaturaURI: "assinaturaURI",
  outroExtensionista: [
    { id_usuario: "456", matricula_usuario: "456", nome_usuario: "Jane Doe" },
  ],
  nomeOutroExtensionista: "Jane Doe",
  matriculaOutroExtensionista: "456",
  coordenadas: "",
  readOnly: true,
  createdAt: "2021-10-01T00:00:00.000Z",
};

const expectedDTO: RelatorioBackendDTO = {
  id: "123",
  produtorId: "123",
  tecnicoId: "123",
  numeroRelatorio: 1,
  assunto: "Assunto",
  orientacao: "Orientação",
  pictureURI: "pictureURI",
  assinaturaURI: "assinaturaURI",
  outroExtensionista: "456",
  readOnly: true,
  coordenadas: "",
  createdAt: "2021-10-01T00:00:00.000Z",
};

const api = new RelatorioAPI() as any;
describe("Test RelatorioAPI methods", () => {
  describe("toDTO", () => {
    it("should convert a RelatorioModel to a RelatorioBackendDTO", () => {
      const actualDTO = api.toDTO(relatorio);
      expect(actualDTO).toEqual(expectedDTO);
    });
  });
  describe("createFormData", () => {
    it("should create a FormData from a RelatorioBackendDTO", async () => {
      const formData = await api.createFormData(expectedDTO);
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("assunto")).toBe("Assunto");
      expect(formData.get("orientacao")).toBe("Orientação");
    });
  });
});
