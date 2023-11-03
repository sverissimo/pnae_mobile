import { AtendimentoModel } from "@domain/atendimento";
import { AtendimentoAPIRepository } from "./AtendimentoAPIRepository";

describe("AtendimentoAPIRepository", () => {
  const atendimentoAPI = new AtendimentoAPIRepository();

  it("should create an atendimento with link_pdf", async () => {
    const atendimentoModel: AtendimentoModel = {
      id_relatorio: "123",
      id_usuario: "2093",
      id_und_empresa: "H0683",
      id_pessoa_demeter: "170150",
      id_pl_propriedade: "2321",
    };

    const atendimentoDTO = atendimentoAPI.toDTO(atendimentoModel);

    expect(atendimentoDTO).toHaveProperty("link_pdf");
    expect(atendimentoDTO.link_pdf).toMatch(
      `/relatorios/pdf/${atendimentoModel.id_relatorio}`
    );
    expect(atendimentoDTO.id_pessoa_demeter).toBe(
      atendimentoModel.id_pessoa_demeter
    );
    expect(atendimentoDTO.id_pl_propriedade).toBe(
      atendimentoModel.id_pl_propriedade
    );
    expect(atendimentoDTO.id_und_empresa).toBe(atendimentoModel.id_und_empresa);
  });
});
