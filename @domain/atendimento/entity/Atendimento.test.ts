import { Atendimento, AtendimentoModel } from "./Atendimento";

const atendimentoModel: AtendimentoModel = {
  id_relatorio: "123",
  id_usuario: "2093",
  id_und_empresa: "H0683",
  id_pessoa_demeter: "170150",
  id_pl_propriedade: "2321",
  link_pdf: "",
};

describe("Atendimento", () => {
  describe("constructor", () => {
    it("should throw an error if id_usuario is not provided", () => {
      const atendimento = {
        ...atendimentoModel,
        id_usuario: "",
      };
      expect(() => new Atendimento(atendimento)).toThrow(
        "id_usuario é necessário para a criação do atendimento"
      );
    });

    it("should throw an error if id_und_empresa is not provided", () => {
      const atendimento = {
        ...atendimentoModel,
        id_und_empresa: "",
      };
      expect(() => new Atendimento(atendimento)).toThrow(
        "id_und_empresa é necessário para a criação do atendimento"
      );
    });

    it("should throw an error if id_relatorio is not provided", () => {
      const atendimento = {
        ...atendimentoModel,
        id_relatorio: "",
      };
      expect(() => new Atendimento(atendimento)).toThrow(
        "id_relatorio é necessário para a criação do atendimento"
      );
    });

    it("should throw an error if id_pessoa_demeter is not provided", () => {
      const atendimento = {
        ...atendimentoModel,
        id_pessoa_demeter: "",
      };
      expect(() => new Atendimento(atendimento)).toThrow(
        "id_pessoa_demeter é necessário para a criação do atendimento"
      );
    });

    it("should throw an error if id_pl_propriedade is not provided", () => {
      const atendimento = {
        ...atendimentoModel,
        id_pl_propriedade: "",
      };
      expect(() => new Atendimento(atendimento)).toThrow(
        "id_pl_propriedade é necessário para a criação do atendimento"
      );
    });

    it("should not throw an error if all required fields are provided", () => {
      const atendimento = {
        ...atendimentoModel,
      };
      expect(() => new Atendimento(atendimento)).not.toThrow();
    });
  });

  describe("toModel", () => {
    it("should return the atendimento object as a model", () => {
      const atendimento = new Atendimento(atendimentoModel);
      expect(atendimento.toModel()).toEqual(atendimentoModel);
    });
  });

  describe("toDTO", () => {
    it("should return the atendimento object as a DTO", () => {
      const atendimento = new Atendimento(atendimentoModel);
      const { id_relatorio, ...atendimentoDTO } = atendimentoModel;
      expect(atendimento.toDTO()).toEqual(atendimentoDTO);
    });
  });

  describe("addPDFLink", () => {
    it("should add the PDF link to the atendimento object", () => {
      const serverURL = "https://example.com";
      const atendimento = new Atendimento(atendimentoModel);
      atendimento.addPDFLink(serverURL);

      const atendimentoCreatedModel = atendimento.toModel();
      const atendimentoDTO = atendimento.toDTO();
      expect(atendimentoCreatedModel.link_pdf).toBe(
        `${serverURL}/relatorios/pdf/${atendimentoCreatedModel.id_relatorio}`
      );
      expect(atendimentoDTO.link_pdf).toBe(
        `${serverURL}/relatorios/pdf/${atendimentoCreatedModel.id_relatorio}`
      );
    });
  });
});
