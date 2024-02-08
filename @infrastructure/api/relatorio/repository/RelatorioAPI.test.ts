import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioAPIRepository } from "./RelatorioAPIRepository";
import { RelatorioBackendDTO } from "../dto";
import relatorioModel from "_mockData/relatorio/relatorioModel.json";
import relatorioDTO from "_mockData/relatorio/relatorioBackendDTO.json";

const relatorio = relatorioModel as RelatorioModel;
const expectedDTO = relatorioDTO as RelatorioBackendDTO;

jest.mock("@shared/utils/fileSystemUtils", () => ({
  FileSystem: {},
}));

const api = new RelatorioAPIRepository() as any;
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
