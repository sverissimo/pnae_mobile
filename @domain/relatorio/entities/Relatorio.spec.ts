import { env } from "@config/env";
import { Relatorio } from "./Relatorio";

const filesFolder = env.FILES_FOLDER;
const relatorio = {
  id: "1",
  produtorId: "123",
  tecnicoId: "456",
  numeroRelatorio: 1,
  assunto: "assunto",
  orientacao: "orientacao",
  nomeTecnico: "nomeTecnico",
  pictureURI: "pictureURI",
  assinaturaURI: "assinaturaURI",
  outroExtensionista: [
    {
      id_usuario: "789",
      nome_usuario: "nomeOutroExtensionista",
      matricula_usuario: "matriculaOutroExtensionista",
      password: "password",
      perfis: ["admin", "user"],
      id_und_empresa: "H0806",
    },
    {
      id_usuario: "0123456",
      nome_usuario: "nomeOutroExtensionista2",
      matricula_usuario: "matriculaOutroExtensionista2",
      password: "password2",
      perfis: ["admin2", "user2"],
      id_und_empresa: "H0806",
    },
  ],
  nomeOutroExtensionista: "nomeOutroExtensionista,nomeOutroExtensionista2",
  matriculaOutroExtensionista:
    "matriculaOutroExtensionista,matriculaOutroExtensionista2",
  createdAt: "createdAt",
};

describe("Relatorio domain class", () => {
  describe("Testing data validation", () => {
    it("should throw an error if produtorId is not provided", () => {
      expect(() => new Relatorio({ ...relatorio, produtorId: "" })).toThrow(
        "Produtor não pode ser vazio"
      );
    });

    it("should throw an error if tecnicoId is not provided", () => {
      expect(() => new Relatorio({ ...relatorio, tecnicoId: "" })).toThrow(
        "Técnico não pode ser vazio"
      );
    });

    it("should throw an error if numeroRelatorio is not between 1 and 999", () => {
      expect(() => new Relatorio({ ...relatorio, numeroRelatorio: 0 })).toThrow(
        "Número do relatório inválido"
      );
      expect(
        () => new Relatorio({ ...relatorio, numeroRelatorio: 1000 })
      ).toThrow("Número do relatório inválido");
    });
  });

  describe("getUpdatedProps", () => {
    it("should throw an error if an object with same keys/values has been passed to getUpdatedProps", () => {
      const relatorioModel = new Relatorio(relatorio);
      expect(() => relatorioModel.getUpdatedProps(relatorio)).toThrow(
        "Nenhum dado foi alterado"
      );
    });

    it("should return a new RelatorioModel object with changed properties plus id and updatedAt", () => {
      const updatedRelatorio = {
        ...relatorio,
        orientacao: "orientacao2",
      };
      const relatorioModel = new Relatorio(updatedRelatorio);
      const newRelatorio = relatorioModel.getUpdatedProps(relatorio);
      expect(Object.keys(newRelatorio)).toHaveLength(3);
      expect(newRelatorio.id).toBe(relatorioModel.toModel().id);
      expect(newRelatorio).toHaveProperty("orientacao");
      expect(newRelatorio).toHaveProperty("updatedAt");
      expect(newRelatorio).not.toHaveProperty("numeroRelatorio");
      expect(newRelatorio).not.toHaveProperty("assunto");
      expect(newRelatorio).not.toHaveProperty("pictureURI");
      expect(newRelatorio).not.toHaveProperty("assinaturaURI");
      expect(newRelatorio).not.toHaveProperty("outroExtensionista");
      expect(newRelatorio).not.toHaveProperty("nomeOutroExtensionista");
      expect(newRelatorio).not.toHaveProperty("nomeTecnico");
      expect(newRelatorio).not.toHaveProperty("createdAt");
    });

    it("should compare objects regardless of pictureURI and assinaturaURI filePaths, and return only updated ones", () => {
      const updatedRelatorio = {
        ...relatorio,
        pictureURI: filesFolder + "/differentPictureURI",
        assinaturaURI: filesFolder + "/assinaturaURI",
        numeroRelatorio: "1",
        assunto: "assunto2",
      };

      const relatorioModel = new Relatorio(updatedRelatorio as any);
      const updates = relatorioModel.getUpdatedProps(relatorio);
      console.log("🚀 - it - updates:", updates);

      expect(updates).toHaveProperty("assunto");
      expect(updates).toHaveProperty("pictureURI");
      expect(updates).toHaveProperty("updatedAt");
      expect(updates).not.toHaveProperty("numeroRelatorio");
      expect(updates).not.toHaveProperty("assinaturaURI");
      expect(updates).not.toHaveProperty("outroExtensionista");
    });

    it("should throw an error if no properties were updated, even if in different formats", () => {
      const updatedRelatorio = {
        ...relatorio,
        pictureURI: filesFolder + "/pictureURI",
        assinaturaURI: filesFolder + "/assinaturaURI",
        numeroRelatorio: "1",
        outroExtensionista: [...relatorio.outroExtensionista],
      };

      const relatorioModel = new Relatorio(updatedRelatorio as any);
      expect(() => relatorioModel.getUpdatedProps(relatorio)).toThrow(
        expect.objectContaining({ message: "Nenhum dado foi alterado" })
      );
    });
  });
});
